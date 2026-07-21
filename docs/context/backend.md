# Service Provider App — Backend Documentation

## Tech Stack

| Layer            | Technology                     |
|------------------|--------------------------------|
| Runtime          | Node.js                        |
| Framework        | Express.js                     |
| Database         | MongoDB                        |
| ODM              | Mongoose                       |
| Authentication   | Firebase OTP Authentication + JWT |
| Notifications    | Firebase Cloud Messaging (FCM) |
| Payments         | Razorpay                       |
| Image Storage    | Cloudinary                     |
| API Security     | JWT Tokens                     |
| Validation       | Express Validator              |
| Logging          | Morgan                         |
| File Upload      | Multer                         |
| Environment Config | dotenv (.env)                |
| Version Control  | GitHub                         |
| Frontend         | React Native                   |

## High-Level Architecture

```
React Native App
      │
      │  (Firebase ID Token, then JWT on subsequent calls)
      ▼
Express.js API Gateway
      │
      ├── Middleware: Morgan (logging) → CORS → Firebase Admin verify → JWT auth → Express Validator
      │
      ├── Controllers ──> Services (business logic) ──> Mongoose Models ──> MongoDB
      │
      ├── Integrations:
      │      ├── Firebase Admin SDK (auth verification)
      │      ├── Firebase Cloud Messaging (push notifications)
      │      ├── Razorpay SDK (payments/webhooks)
      │      └── Cloudinary SDK (image upload/storage)
      │
      └── Error handler (centralized) ──> Standard JSON error response
```

## Folder Structure

```
backend/
│
├── config/
│   ├── db.js
│   ├── firebase.js
│   ├── cloudinary.js
│   └── razorpay.js
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── serviceController.js
│   ├── bookingController.js
│   ├── paymentController.js
│   ├── complaintController.js
│   ├── notificationController.js
│   └── reviewController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── adminMiddleware.js
│   ├── uploadMiddleware.js
│   └── errorMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Category.js
│   ├── Service.js
│   ├── Booking.js
│   ├── Payment.js
│   ├── Notification.js
│   ├── Complaint.js
│   ├── Review.js
│   └── Query.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── serviceRoutes.js
│   ├── bookingRoutes.js
│   ├── paymentRoutes.js
│   ├── reviewRoutes.js
│   ├── complaintRoutes.js
│   └── notificationRoutes.js
│
├── utils/
├── uploads/
├── app.js
├── server.js
└── .env
```

## Data Model

The database uses MongoDB with Mongoose, with the following design choices:

- Addresses & cart items are embedded inside User (one-to-few embed pattern).
- Categories have their own collection (with parent_id for sub-categories).
- Payments are a separate collection from Bookings (not embedded) for independent querying.
- Reviews are split out from Complaints and kept in their own collection.
- Bookings store a service_snapshot and address_snapshot (extended reference pattern) to preserve historical data.

### Collections

#### User

| Field         | Type                          | Notes                                         |
|---------------|-------------------------------|-----------------------------------------------|
| first_name, last_name | String                | required                                      |
| email         | String                        | required, unique, lowercase                   |
| phone         | String                        | required (preserve leading zeros/country code) |
| img_url       | String                        |                                               |
| role          | enum: customer, provider, admin | default: customer                           |
| addresses     | [Address subdocument]         | embedded                                      |
| cart_items    | [{service_id, quantity, added_at}] | embedded                                  |
| is_active     | Boolean                       | default true                                  |
| created_at / updated_at | Date                  |                                               |

#### Category

| Field      | Type                      |
|------------|---------------------------|
| parent_id  | ObjectId (self-ref, nullable) |
| name       | String, unique            |
| is_active  | Boolean                   |

#### Service

| Field          | Type            | Notes                          |
|----------------|-----------------|--------------------------------|
| category_id    | ObjectId → Category |                            |
| name           | String          | merges old "name" + "title"    |
| description    | String          |                                |
| price          | Decimal128      | avoids float rounding issues   |
| duration_mins  | Number          |                                |
| images         | [String]        |                                |
| tags           | [String]        | multikey index                 |
| avg_rating, review_count | Number | cached, updated on review create/edit |
| is_active      | Boolean         |                                |

#### Booking

| Field             | Type                                           | Notes                |
|-------------------|------------------------------------------------|----------------------|
| user_id           | ObjectId → User                                |                      |
| service_snapshot  | {service_id, name, price}                      | extended reference   |
| address_snapshot  | {line1, line2, city, state, pincode, country, lat, lng} | extended reference |
| booking_date      | Date                                           | full datetime        |
| total_amount      | Decimal128                                     |                      |
| status            | enum: pending, confirmed, in_progress, completed, cancelled |                      |
| is_active         | Boolean                                        |                      |

#### Payment

| Field         | Type                                | Notes                |
|---------------|-------------------------------------|----------------------|
| booking_id    | ObjectId → Booking                  |                      |
| payment_mode  | enum: card, upi, netbanking, wallet, cash |                 |
| transaction_id| String                              | gateway IDs are alphanumeric |
| amount        | Decimal128                          |                      |
| status        | enum: pending, successful, failed, refunded |                 |
| payment_date  | Date                                |                      |

#### Notification

| Field        | Type                                            |
|--------------|-------------------------------------------------|
| user_id      | ObjectId → User                                 |
| type         | enum: booking, payment, complaint, promotion, system |
| title, message | String                                        |
| reference_id | ObjectId (e.g. booking_id)                      |
| is_read      | Boolean                                         |

#### Complaint

| Field            | Type                                      |
|------------------|-------------------------------------------|
| booking_id       | ObjectId → Booking                        |
| user_id          | ObjectId → User                           |
| title, description | String                                  |
| status           | enum: open, in_progress, resolved, closed |
| resolution_notes | String                                    |
| resolved_at      | Date                                      |

#### Review

| Field       | Type                     |
|-------------|--------------------------|
| booking_id  | ObjectId → Booking, unique |
| user_id     | ObjectId → User          |
| service_id  | ObjectId → Service       |
| rating      | Number (1–5)             |
| comment     | String                   |

#### Query (contact-us / lead form)

| Field        | Type                          |
|--------------|-------------------------------|
| user_id      | ObjectId → User, nullable (guests can submit) |
| name, email, phone | String                   |
| title, message | String                     |
| status       | enum: open, closed           |

## Authentication Flow (Firebase OTP → JWT)

1. User enters phone number on the login screen.
2. App calls Firebase Auth signInWithPhoneNumber; Firebase sends an SMS OTP.
3. User enters the OTP; app verifies it with Firebase and receives an ID token + Firebase UID.
4. App sends the Firebase ID token to the backend: `POST /auth/verify`.
5. Backend verifies the token via the Firebase Admin SDK.
   - Invalid/expired → reject request.
   - Valid → extract phone_number + firebase_uid.
6. Backend looks up the user by firebase_uid:
   - Exists → fetch user, update `last_login_at`.
   - Doesn't exist → create a new user (role: customer, is_active: true, profile_complete: false).
   - On first creation, trigger a system notification ("Welcome to the platform").
7. Backend issues its own JWT to the app; the app stores it and attaches it as `Authorization: Bearer <token>` on every subsequent request.
8. If `profile_complete` is false, the app prompts for first name, last name, email, and address, then calls an update endpoint to mark the profile complete.
9. On every later request, the backend verifies the JWT (Firebase handles token refresh on-device separately for re-auth scenarios).

## API Endpoints

All routes are prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <JWT>`.

### Auth

| Method | Endpoint                    | Description                                    |
|--------|-----------------------------|------------------------------------------------|
| POST   | /auth/verify                | Verify Firebase ID token, create/fetch user, issue JWT |
| POST   | /auth/complete-profile      | Complete profile (name, email, address)        |
| POST   | /auth/logout                | Invalidate session/token client-side           |

### Users

| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| GET    | /users/me                             | Get current user profile         |
| PATCH  | /users/me                             | Update profile                   |
| POST   | /users/me/addresses                   | Add address                      |
| PATCH  | /users/me/addresses/:addressId        | Update address                   |
| DELETE | /users/me/addresses/:addressId        | Remove address                   |
| POST   | /users/me/upload-image                | Upload profile image (Multer → Cloudinary) |

### Categories & Services

| Method | Endpoint              | Description                                          |
|--------|-----------------------|------------------------------------------------------|
| GET    | /categories           | List categories (supports parent/sub filtering)      |
| GET    | /services             | List/search services (query: category, tags, text search, pagination) |
| GET    | /services/:id         | Service detail (incl. avg_rating, review_count)      |
| POST   | /services             | Create service (admin/provider)                      |
| PATCH  | /services/:id         | Update service (admin/provider)                      |
| DELETE | /services/:id         | Deactivate service (admin/provider)                  |

### Cart

| Method | Endpoint                    | Description                     |
|--------|-----------------------------|---------------------------------|
| GET    | /cart                       | Get current cart items (embedded on user) |
| POST   | /cart                       | Add item to cart                |
| PATCH  | /cart/:serviceId            | Update quantity                 |
| DELETE | /cart/:serviceId            | Remove item                     |
| DELETE | /cart                       | Clear cart                      |

### Bookings

| Method | Endpoint                     | Description                                      |
|--------|------------------------------|--------------------------------------------------|
| POST   | /bookings                    | Create booking (snapshot service + address, status: pending) |
| GET    | /bookings                    | List current user's bookings (filter by status)  |
| GET    | /bookings/:id                | Booking detail                                   |
| PATCH  | /bookings/:id/cancel         | Cancel booking (pending/confirmed only)           |
| PATCH  | /bookings/:id/status         | Update status (admin/provider — confirmed/in_progress/completed) |

### Payments

| Method | Endpoint                      | Description                                        |
|--------|-------------------------------|----------------------------------------------------|
| POST   | /payments/create-order        | Create Razorpay order for a booking                |
| POST   | /payments/verify              | Verify Razorpay payment signature, mark payment + booking status |
| POST   | /payments/webhook             | Razorpay webhook (handles async success/failure/refund events) |
| GET    | /payments/:bookingId          | Get payment record(s) for a booking                |

### Reviews

| Method | Endpoint                  | Description                                             |
|--------|---------------------------|---------------------------------------------------------|
| POST   | /reviews                  | Submit review for a completed booking (updates service avg_rating/review_count) |
| GET    | /services/:id/reviews     | List reviews for a service                              |

### Complaints

| Method | Endpoint                       | Description                                       |
|--------|--------------------------------|---------------------------------------------------|
| POST   | /complaints                   | File complaint against a booking                  |
| GET    | /complaints                   | List current user's complaints                    |
| GET    | /complaints/:id               | Complaint detail                                  |
| PATCH  | /complaints/:id/status        | Update status (admin — triggers notification)     |

### Notifications

| Method | Endpoint                         | Description                                       |
|--------|----------------------------------|---------------------------------------------------|
| GET    | /notifications                   | List current user's notifications (paginated, unread-first) |
| PATCH  | /notifications/:id/read          | Mark as read                                      |
| PATCH  | /notifications/read-all          | Mark all as read                                  |

### Queries (Contact Us)

| Method | Endpoint                   | Description                          |
|--------|----------------------------|--------------------------------------|
| POST   | /queries                   | Submit a query (guest or logged-in)  |
| GET    | /queries                   | List queries (admin)                 |
| PATCH  | /queries/:id/close         | Mark resolved/closed (admin)         |

## Business Flows

- **Booking creation:** Browse Services → Add to Cart → Create Booking → status: pending
- **Payment:**
  - Initiate Payment → Successful → Booking status: confirmed
  - Initiate Payment → Failed → Retry (loops back) or Booking cancelled if abandoned
- **Booking status lifecycle:**
  - pending → confirmed → in_progress → completed
  - pending → cancelled
  - confirmed → cancelled
- **Post-completion:**
  - Completed → Review submitted (rating + comment), or
  - Completed → Complaint filed → open → in_progress → resolved → closed
- **Query / Contact-Us:** Query submitted (open) → Support responds → optionally linked to user_id → closed

## Notification Triggers

| Event                              | Notification type |
|------------------------------------|-------------------|
| Booking status → Confirmed         | booking           |
| Payment status → Failed            | payment           |
| Complaint status changes           | complaint         |
| Promotional campaign sent          | promotion         |
| New user created                   | system            |

Notifications are persisted in MongoDB and pushed to the device via Firebase Cloud Messaging.

## Security & Validation

- All protected routes verify the JWT via middleware before hitting the controller.
- Firebase ID tokens are verified server-side using the Firebase Admin SDK — never trust a client-asserted UID.
- Request bodies are validated with Express Validator at the route layer before reaching business logic.
- Razorpay payment verification uses HMAC signature validation on both the client-confirm call and the webhook, so payment status is never trusted from the client alone.
- Passwords aren't stored — auth is entirely OTP/Firebase-based.
- Role-based access control (customer, provider, admin) gates service/booking-status/complaint-status mutation endpoints.
- Rate limiting recommended on `/auth/verify` and `/queries` to prevent OTP/spam abuse.

## Error Handling

Centralized Express error-handling middleware returns a consistent shape:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "BOOKING_NOT_FOUND"
}
```

Common cases to handle explicitly:
- Invalid/expired Firebase token
- Invalid/expired JWT
- Validation errors (422)
- Not-found (404)
- Razorpay signature mismatch
- Duplicate email/phone on signup

## Environment Variables (.env)

```
PORT=
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRY=
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

# Implementation Plan

## Overview

This plan outlines the phased implementation of the ServiceProviderApp, a React Native + Express.js application with MongoDB, Firebase Auth, Razorpay payments, and Cloudinary media storage. Each phase specifies frontend and backend tasks, APIs, and deliverables mapped to the project architecture defined in `docs/context/`.

**Reference Documents:**
- `docs/context/tech-stack.md` — Technology choices
- `docs/context/frontend.md` — Frontend folder structure & UI specification
- `docs/context/backend.md` — Backend architecture, data model, API endpoints, auth flow
- `docs/context/db-table.md` — Detailed MongoDB/Mongoose schema design
- `docs/context/applicationflow.md` — Business process flows

---

## Phase 1: Project Setup & Environment Configuration

### Frontend Tasks
- Initialize React Native TypeScript project (`npx react-native init` or Expo)
- Create folder structure per `docs/context/frontend.md`:
  - `src/screens/auth/`, `src/screens/user/`, `src/screens/admin/`
  - `src/navigation/`, `src/services/`, `src/store/`
  - `src/components/common/`, `src/hooks/`, `src/types/`, `src/utils/`
- Install and configure React Navigation (Stack + Bottom Tab) — see `frontend.md`
- Install and configure Zustand for client state management
- Install and configure TanStack Query (React Query) for server state — `QueryClientProvider` in `App.tsx`
- Setup `.env` file with Firebase, API base URL
- Configure Firebase SDK (`src/services/firebase.ts`)
- Configure Axios API client with base URL and JWT interceptor
- Setup reusable theme constants in `src/utils/constants.ts`:
  - Primary: Royal Blue `#2563EB`, Yellow `#FACC15`
  - Design tokens for card-based UI, rounded corners, soft shadows

### Backend Tasks
- Initialize Node.js + Express project with the structure from `docs/context/backend.md`:
  - `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `utils/`, `uploads/`
- Configure MongoDB connection (`config/db.js`)
- Setup Mongoose models per `docs/context/db-table.md` (User, Category, Service, Booking, Payment, Notification, Complaint, Review, Query)
- Setup `.env` file per `docs/context/backend.md` env vars
- Configure Morgan logging middleware
- Configure CORS
- Setup centralized error handling middleware (`middleware/errorMiddleware.js`) — consistent JSON error shape per `backend.md`
- Configure JWT authentication middleware (`middleware/authMiddleware.js`)
- Configure role-based access middleware (`middleware/adminMiddleware.js`)

### Deliverables
- Running frontend project with folder structure and navigation skeleton
- Running backend server on configurable port
- MongoDB connection established
- Firebase SDK configured on both frontend and backend (Admin SDK)
- Centralized error handler returning `{ success, message, code }` format

---

## Phase 2: Authentication Module

### Frontend — Screens & Features
Per `docs/context/frontend.md`:
- **Splash Screen** — Company logo centered, Login/Get Started button
- **Login Screen** (`screens/auth/LoginScreen.tsx`) — Phone number input, Generate OTP button, phone format validation, Sign in with Google, Sign in as Guest
- **OTP Screen** (`screens/auth/OtpScreen.tsx`) — OTP input fields, Verify OTP button, resend timer, loading state
- **Complete Profile Screen** — First name, last name, email, address fields (triggered when `profile_complete: false`)

Per `docs/context/applicationflow.md` — Create User Flow:
```
User enters phone -> Firebase sends OTP -> User enters OTP
  -> Firebase returns ID token
  -> App sends to POST /auth/verify
  -> Backend creates/fetches user, returns JWT
  -> If profile_complete: false -> prompt for details
  -> User lands on home
```

Per `docs/context/applicationflow.md` — Guest Access Flow:
```
Login Screen -> User taps "Sign in as Guest"
  -> useAuthStore.loginAsGuest() sets isGuest: true
  -> AppNavigator detects hasAccess (isGuest = true)
  -> Main app (UserTabs) rendered
  -> Guest can browse; booking/profile actions prompt login
```

Store: `src/store/useAuthStore.ts` (Zustand) — manage auth state, token persistence, session restoration, guest mode (`isGuest`, `loginAsGuest`)

### AppNavigator Change
- Auth gating changed from `isAuthenticated` to `isAuthenticated || isGuest`
- Unauthenticated users without guest mode still see Splash/Login/OTP screens

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/verify | Verify Firebase ID token via Admin SDK, create/fetch user by firebase_uid, issue JWT, trigger welcome notification for new users |
| POST   | /auth/complete-profile | Update first_name, last_name, email, address; set `profile_complete: true` |
| POST   | /auth/logout | Client-side token invalidation |

Per `docs/context/backend.md` auth flow:
- Firebase Admin SDK verifies ID token → extract `phone_number` + `firebase_uid`
- Lookup user by `firebase_uid` — create if not exists (`role: customer`, `is_active: true`, `profile_complete: false`)
- On new user → create system notification ("Welcome to the platform")
- Return JWT + user profile

### Models Used
- `User` — first_name, last_name, email, phone, img_url, role, addresses[], cart_items[], is_active

### Deliverables
- User can login using phone OTP
- JWT authentication working (stored on device, sent as `Authorization: Bearer <token>`)
- User profile completion flow implemented
- Welcome notification on first signup
- Guest mode — users can skip authentication and browse the app
- "Sign in as Guest" CTA on Login Screen
- Auth gating uses `isAuthenticated || isGuest` — no forced redirect to login

---

## Phase 3: User Profile Module

### Frontend — Screens
Per `docs/context/frontend.md`:
- **Profile Screen** (`screens/user/ProfileScreen.tsx`)
  - Display: profile picture, full name, phone number, address
  - Actions: Edit Profile, Manage Addresses
- Edit Profile modal/screen — update first_name, last_name, email
- Address management — Add/Edit/Delete address with label (home/work/other)
- Profile image upload with preview

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /users/me | Get current user profile |
| PATCH  | /users/me | Update profile fields |
| POST   | /users/me/addresses | Add address (embedded subdocument per `db-table.md`) |
| PATCH  | /users/me/addresses/:addressId | Update specific address |
| DELETE | /users/me/addresses/:addressId | Remove address |
| POST   | /users/me/upload-image | Upload profile image via Multer → Cloudinary |

### Models Used
- `User` — addresses[] embedded, img_url

### Integrations
- Cloudinary SDK (`config/cloudinary.js`) for image upload

### Deliverables
- Profile management (view, edit) complete
- Address CRUD working
- Image upload to Cloudinary working

---

## Phase 4: Categories & Services Module

### Frontend — Screens
Per `docs/context/frontend.md`:
- **Home Screen** (`screens/user/HomeScreen.tsx`) — ✅ **Done**
  - Sections: Featured Services, How It Works (4 steps), Why Choose Us, Need Help?
  - Service cards, promotional banners, popular services
- **Services Screen** (`screens/user/ServicesScreen.tsx`) — ✅ **Done** (with mock data)
  - Search bar with client-side filtering by name/description/tags
  - Category filter chips (6 categories) with toggle selection
  - 2-column card grid with service images from Unsplash
  - Loading skeletons, empty states, navigation to ServiceDetail
- **Service Detail Screen** (`screens/user/ServiceDetailScreen.tsx`)
  - Display: name, description, pricing, duration, ratings & reviews, available time slots
  - Actions: Add to Cart, Book Now
  - Sub-services display (e.g., Basic Cleaning, Deep Cleaning, Kitchen Cleaning) with price, duration, Book button

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /categories | List categories with parent/sub filtering per Category model (parent_id) |
| GET    | /services | List/search services — query params: category, tags, text search, pagination |
| GET    | /services/:id | Service detail incl. avg_rating, review_count |
| POST   | /services | Create service (admin/provider) |
| PATCH  | /services/:id | Update service (admin/provider) |
| DELETE | /services/:id | Deactivate service (admin/provider) — soft delete via `is_active: false` |

### Models Used
- `Category` — parent_id (self-ref for sub-categories), name, is_active
- `Service` — category_id, name, description, price (Decimal128), duration_mins, images[], tags[], avg_rating, review_count, is_active

### Indexes (per `db-table.md`)
- Category: `{ name: 1 }` unique
- Service: `{ category_id: 1 }`, `{ tags: 1 }` multikey, `{ name: 'text', description: 'text' }` full-text search

### Hooks
- `src/hooks/useServices.ts` — fetch services, search, filter by category
- `src/hooks/useUserRole.ts` — gate admin/provider actions

### Deliverables
- Categories & services visible to users on Home and Services screens
- Search and category filtering working
- Service detail page with ratings display

---

## Phase 5: Cart Module

### Frontend
Per `docs/context/frontend.md`:
- Cart icon in top navigation bar
- **Cart Screen** — selected services list, quantity controls, price summary, checkout button
- Add to Cart / Book Now buttons on Service Detail screen
- Empty state component (`components/common/EmptyState.tsx`)

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /cart | Get current cart items (embedded on User) |
| POST   | /cart | Add item to cart `{ service_id, quantity }` |
| PATCH  | /cart/:serviceId | Update quantity |
| DELETE | /cart/:serviceId | Remove item from cart |
| DELETE | /cart | Clear entire cart |

### Models Used
- `User.cart_items[]` — embedded `{ service_id, quantity, added_at }`

### Deliverables
- Fully functional cart system — add, remove, update quantity, clear, price summary

---

## Phase 6: Booking Module

### Frontend — Screens
Per `docs/context/frontend.md`:
- **Booking Screen** (`screens/user/BookingScreen.tsx`) — select address, select date & time, booking confirmation
- **My Bookings Screen** (`screens/user/MyBookingsScreen.tsx`) — ✅ **Done** (with mock data)
  - Active/History tab switcher with pill toggle
  - Active Bookings: service icon, name, booking ID, date & time, StatusBadge (color-coded), amount, cancel button
  - Booking History: completed & cancelled bookings (no cancel option)
  - Cancel with confirmation alert → optimistic local state update
  - Loading skeleton cards, tab-aware empty states
  - Floating Action Button (+) navigates to Services tab
- **BookingItem** (`components/BookingItem.tsx`) — ✅ **Built** reusable card component with StatusBadge integration

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /bookings | Create booking — snapshot service (`service_id, name, price`) + address (`line1, line2, city, state, pincode, country, lat, lng`), status: pending |
| GET    | /bookings | List current user's bookings, filterable by status |
| GET    | /bookings/:id | Booking detail |
| PATCH  | /bookings/:id/cancel | Cancel booking (pending/confirmed only) |
| PATCH  | /bookings/:id/status | Update status (admin/provider) — confirmed, in_progress, completed |

### Booking Lifecycle (per `docs/context/applicationflow.md`)
```
Pending -> Confirmed -> In Progress -> Completed
Pending -> Cancelled
Confirmed -> Cancelled
```

### Models Used
- `Booking` — user_id, service_snapshot (extended reference), address_snapshot (extended reference), booking_date, total_amount (Decimal128), status (enum), is_active

### Indexes
- `{ user_id: 1 }`, `{ 'service_snapshot.service_id': 1 }`, `{ booking_date: 1 }`, `{ status: 1 }`

### Hooks
- `src/hooks/useBookings.ts` — fetch booking list, create, cancel

### Deliverables
- Complete booking workflow operational
- Booking creation with service & address snapshots
- Booking history and cancellation working

---

## Phase 7: Payment Integration

### Frontend
- Checkout flow from cart → payment screen
- Razorpay checkout integration (order creation → payment → verification)
- Price summary display
- Payment success/failure handling

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /payments/create-order | Create Razorpay order for a booking |
| POST   | /payments/verify | Verify Razorpay payment signature (HMAC), mark payment + booking status |
| POST   | /payments/webhook | Razorpay webhook — handles async success/failure/refund events |
| GET    | /payments/:bookingId | Get payment record(s) for a booking |

### Payment Flow (per `docs/context/applicationflow.md`)
```
Initiate Payment -> Successful -> Booking Status: Confirmed
Initiate Payment -> Failed -> Retry Payment or Booking Cancelled
```

### Models Used
- `Payment` — booking_id, payment_mode (card/upi/netbanking/wallet/cash), transaction_id, amount (Decimal128), status (pending/successful/failed/refunded), payment_date

### Integrations
- Razorpay SDK (`config/razorpay.js`)
- HMAC signature verification on both client confirm and webhook

### Security (per `docs/context/backend.md`)
- Payment status never trusted from client alone
- Razorpay webhook signature validation

### Deliverables
- End-to-end payment processing with Razorpay
- Order creation, verification, webhook handling
- Booking status auto-updated on payment success

---

## Phase 8: Notifications System

### Frontend
- Notifications icon in top navigation bar
- Notification list screen with read/unread state
- Real-time updates via Firebase Cloud Messaging (FCM)

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /notifications | List current user's notifications (paginated, unread-first) |
| PATCH  | /notifications/:id/read | Mark single notification as read |
| PATCH  | /notifications/read-all | Mark all notifications as read |

### Notification Triggers (per `docs/context/applicationflow.md`)
| Event | Type |
|-------|------|
| Booking status → Confirmed | booking |
| Payment status → Failed | payment |
| Complaint status changes | complaint |
| Promotional campaign sent | promotion |
| New user created | system |

### Models Used
- `Notification` — user_id, type (booking/payment/complaint/promotion/system), title, message, reference_id, is_read, created_at

### Integration
- Firebase Cloud Messaging (FCM) for push delivery
- Notifications persisted in MongoDB (`config/firebase.js` for Admin SDK setup)

### Deliverables
- Push notifications working via FCM
- Notification history stored in MongoDB
- Read/unread tracking

---

## Phase 9: Reviews Module

### Frontend
- Rating component on completed bookings
- Review form — star rating (1-5) + comment
- Reviews display on Service Detail screen

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /reviews | Submit review for a completed booking — updates Service avg_rating & review_count |
| GET    | /services/:id/reviews | List reviews for a service |

### Post-Completion Flow (per `docs/context/applicationflow.md`)
```
Booking Completed -> Review Submitted (rating + comment) [end]
Booking Completed -> Complaint Filed -> Open -> In Progress -> Resolved -> Closed
```

### Models Used
- `Review` — booking_id (unique, one review per booking), user_id, service_id, rating (1-5), comment
- `Service.avg_rating` and `Service.review_count` — cached/denormalized, updated via Review triggers

### Indexes
- `Review: { service_id: 1 }`
- Service full-text search index for catalog

### Deliverables
- Review and rating system completed
- Average rating auto-updated on Service model

---

## Phase 10: Complaint Management

### Frontend
- Raise Complaint option on completed bookings (per `frontend.md` Profile → Support section)
- Complaint status tracking screen
- Help Centre / Raise Complaint / Contact Support options

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /complaints | File complaint against a booking |
| GET    | /complaints | List current user's complaints |
| GET    | /complaints/:id | Complaint detail |
| PATCH  | /complaints/:id/status | Update status (admin) — triggers notification per Phase 8 |

### Complaint Lifecycle
```
Open -> In Progress -> Resolved -> Closed
```

### Models Used
- `Complaint` — booking_id, user_id, title, description, status (open/in_progress/resolved/closed), resolution_notes, resolved_at, is_active

### Indexes
- `{ booking_id: 1 }`, `{ user_id: 1 }`

### Deliverables
- Complaint filing, tracking, and admin resolution operational
- Status change notifications triggered

---

## Phase 11: Contact Us Module

### Frontend
Per `docs/context/frontend.md`:
- FAQ section
- Contact Support / Customer Care Information form
- Query submission with name, email, phone, message

### Backend — APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /queries | Submit a query (guest or logged-in user) |
| GET    | /queries | List queries (admin) |
| PATCH  | /queries/:id/close | Mark resolved/closed (admin) |

### Models Used
- `Query` — user_id (nullable for guests), name, email, phone, title, message, status (open/closed)

### Indexes
- `{ email: 1 }`

### Deliverables
- Contact support workflow completed
- Guest users can submit queries

---

## Phase 12: Admin Panel Features

### Frontend — Screens (per `docs/context/frontend.md`)
- **Admin Dashboard** (`screens/admin/AdminDashboardScreen.tsx`)
  - Total bookings, revenue, pending bookings, active users
- **Admin Bookings** (`screens/admin/AdminBookingsScreen.tsx`) — confirm bookings, update status
- **Admin Services** (`screens/admin/AdminServicesScreen.tsx`) — add/edit/disable services
- **Admin Clients** (`screens/admin/AdminClientsScreen.tsx`) — view users, block users
- **Client Detail** (`screens/admin/ClientDetailScreen.tsx`) — user-specific booking history
- Complaint management — resolve complaints, update status

### Backend — Admin APIs (already defined in prior phases)
| Resource | Admin Actions |
|----------|---------------|
| Services | POST /services, PATCH /services/:id, DELETE /services/:id |
| Bookings | PATCH /bookings/:id/status |
| Complaints | PATCH /complaints/:id/status |
| Users | Admin-specific endpoints (view users, block) |
| Queries | GET /queries, PATCH /queries/:id/close |

### Navigation (per `docs/context/frontend.md`)
- `AdminTabNavigator.tsx` — separate bottom tab navigator for admin
- `AppNavigator.tsx` — role-based routing (user vs admin tabs)

### Middleware
- `middleware/adminMiddleware.js` — role-based access gate (admin only)

### Deliverables
- Admin dashboard with key metrics
- Booking, service, user, and complaint management from admin panel

---

## Phase 13: Security & Validation

### Tasks (per `docs/context/backend.md`)
- JWT middleware on all protected routes — verify `Authorization: Bearer <token>`
- Role-based access control — customer, provider, admin roles gate mutation endpoints
- Input validation with Express Validator at route layer (422 responses on failure)
- Rate limiting on `/auth/verify` and `/queries` to prevent OTP/spam abuse
- Razorpay HMAC signature verification on both client confirm and webhook
- Request sanitization to prevent injection
- Firebase Admin SDK verification for all auth requests — never trust client-asserted UID

### Error Handling (per `docs/context/backend.md`)
Centralized middleware returns consistent JSON:
```json
{
  "success": false,
  "message": "Human-readable error message",
  "code": "BOOKING_NOT_FOUND"
}
```

Explicitly handled cases:
- Invalid/expired Firebase token
- Invalid/expired JWT
- Validation errors (422)
- Not-found (404)
- Razorpay signature mismatch
- Duplicate email/phone on signup

### Deliverables
- Secure, production-ready APIs with consistent error responses

---

## Phase 14: Testing & QA

### Testing Areas
- **Authentication flow** — OTP verification, JWT issuance, profile completion, token expiry
- **Booking flow** — creation, snapshots, status transitions, cancellation rules
- **Payment flow** — order creation, signature verification, webhooks, refunds
- **Notifications** — trigger events, FCM delivery, read/unread state
- **Error handling** — edge cases (network failure, invalid tokens, missing fields)
- **Admin operations** — role-based access, CRUD on services/bookings/complaints

### Testing Types
- **Unit testing** — utility functions, validators, formatters
- **API testing** — endpoint response validation (status codes, response shape, error codes)
- **Integration testing** — full flows (auth → browse → cart → booking → payment → review)
- **Manual testing** — UI flows on device/emulator, OTP flow, edge cases

### Deliverables
- Stable release candidate with documented test coverage

---

## Phase 15: Deployment

### Backend Deployment
- Deploy Express.js server to production host (e.g., AWS EC2, Railway, Render, Heroku)
- Configure production MongoDB (MongoDB Atlas or self-hosted)
- Configure production Firebase project (Admin SDK credentials)
- Configure Razorpay production keys
- Set all `.env` variables for production
- Enable HTTPS and CORS for production frontend origin

### Frontend Deployment
- Generate Android APK/AAB (`cd android && ./gradlew assembleRelease`)
- Generate iOS build (Xcode Archive → App Store Connect)
- Configure production API base URL in `.env`
- Configure production Firebase project (google-services.json, GoogleService-Info.plist)
- Code signing and keystore management for app store submission

### Deliverables
- Production deployment complete
- Both platforms (Android + iOS) build-ready
- Backend API live with production database and integrations

---

## Summary

| Phase | Area | Key Deliverables |
|-------|------|------------------|
| 1 | Setup | Project scaffold, DB connection, Firebase config, Zustand + TanStack Query |
| 2 | Auth | OTP login, JWT, profile completion |
| 3 | Profile | User profile CRUD, address management, image upload |
| 4 | Services | Categories, service catalog, search, filters | 🟡 Services screen done (mock data), Home screen done, ServiceDetail placeholder |
| 5 | Cart | Add/remove/update cart, price summary |
| 6 | Bookings | Booking creation, lifecycle, history | 🟡 My Bookings screen done (mock data), Booking screen placeholder, BookingItem done |
| 7 | Payments | Razorpay integration, verification, webhooks |
| 8 | Notifications | FCM push, notification history, read/unread |
| 9 | Reviews | Ratings, reviews, avg_rating caching |
| 10 | Complaints | Filing, tracking, admin resolution |
| 11 | Contact Us | Query submission, admin response, FAQ |
| 12 | Admin Panel | Dashboard, booking/service/user/complaint management |
| 13 | Security | JWT, RBAC, validation, rate limiting, sanitization |
| 14 | Testing | Unit, API, integration, manual testing |
| 15 | Deployment | Production server, APK/AAB, iOS build |

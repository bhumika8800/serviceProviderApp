# System Architecture

## Overview

ServiceProviderApp follows a **client-server architecture** with a React Native mobile frontend communicating with an Express.js REST API gateway. The system uses MongoDB for persistence, Firebase for authentication and push notifications, Razorpay for payments, and Cloudinary for media storage.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        React Native App                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Auth     │  │ User     │  │ Admin    │  │ Shared Components │  │
│  │ Screens  │  │ Screens  │  │ Screens  │  │ (common UI kit)   │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────────────────┘  │
│       │              │              │                               │
│  ┌────┴──────────────┴──────────────┴───────────────────────────┐  │
│  │                    Navigation Layer                            │  │
│  │  AppNavigator → UserTabNavigator / AdminTabNavigator          │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────┴──────────────────────────────────┐  │
│  │                    State Layer (Zustand)                       │  │
│  │         useAuthStore │ useBookingStore                         │  │
│  └────────────────────────────┬──────────────────────────────────┘  │
│                               │                                      │
│  ┌────────────────────────────┴──────────────────────────────────┐  │
│  │                    Service Layer                               │  │
│  │  Firebase SDK │ Axios HTTP Client → JWT in Authorization      │  │
│  └───────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬──────────────────────────────────┘
                                   │ HTTPS / JSON
                                   │ Authorization: Bearer <JWT>
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      Express.js API Gateway                           │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                   Middleware Pipeline                             │  │
│  │  Morgan → CORS → Firebase Admin Verify → JWT Auth → Validator   │  │
│  └────────────────────────────┬────────────────────────────────────┘  │
│                               │                                        │
│  ┌────────────────────────────┴────────────────────────────────────┐  │
│  │                    Controllers → Services                        │  │
│  │  auth │ user │ service │ booking │ payment │ review             │  │
│  │  complaint │ notification │ query                                 │  │
│  └────────────────────────────┬────────────────────────────────────┘  │
│                               │                                        │
│  ┌────────────────────────────┴────────────────────────────────────┐  │
│  │                    Mongoose Models → MongoDB                      │  │
│  │  User │ Category │ Service │ Booking │ Payment                  │  │
│  │  Notification │ Complaint │ Review │ Query                       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    External Integrations                          │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │  │
│  │  │ Firebase │  │ Razorpay │  │Cloudinary│  │  FCM          │  │  │
│  │  │ Admin SDK│  │    SDK   │  │   SDK    │  │ (Push Notif)  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │              Centralized Error Handler                            │  │
│  │  Returns: { success: false, message, code }                     │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Layer Architecture

### 1. Frontend Layer (React Native + TypeScript)

```
┌──────────────────────────────────────────────────────────────────────┐
│                      React Native App                                 │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Screens (src/screens/)                                           │ │
│  │  ┌─────────────┐  ┌────────────────┐  ┌──────────────────────┐  │ │
│  │  │ auth/       │  │ user/          │  │ admin/               │  │ │
│  │  │ • Splash    │  │ • Home         │  │ • Dashboard          │  │ │
│  │  │ • Login     │  │ • Booking      │  │ • Bookings           │  │ │
│  │  │ • OTP       │  │ • MyBookings   │  │ • Services           │  │ │
│  │  │             │  │ • Profile      │  │ • Clients            │  │ │
│  │  │             │  │ • ServiceDetail│  │ • ClientDetail       │  │ │
│  │  └─────────────┘  └────────────────┘  └──────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Navigation (src/navigation/)                                     │ │
│  │  AppNavigator (Stack) → UserTabNavigator / AdminTabNavigator    │ │
│  │  Tabs: Home | Services | Bookings | Profile                      │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Reusable Components (src/components/)                            │ │
│  │  common/: Button, Input, Loader, EmptyState, StatusBadge         │ │
│  │  Domain: ServiceCard, BookingItem, ClientCard                    │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  State (src/store/) — Zustand                                    │ │
│  │  useAuthStore: token, user, isAuthenticated, isGuest,           │  │
│  │  login, loginAsGuest, logout                                     │  │
│  │  useBookingStore: bookings, filters, pagination                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Services (src/services/)                                         │ │
│  │  firebase.ts — Firebase SDK init                                  │ │
│  │  authService.ts — Firebase Auth + API auth calls                  │ │
│  │  bookingService.ts, serviceCatalog.ts, userService.ts            │ │
│  │  notificationService.ts — FCM token registration                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Hooks (src/hooks/) — TanStack Query                             │ │
│  │  useBookings.ts (useQuery/useMutation), useServices.ts,          │ │
│  │  useUserRole.ts                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  TanStack Query (src/App.tsx — QueryClientProvider)              │ │
│  │  Caching, loading/error states, automatic refetching            │ │
│  │  useQuery → GET requests (services, bookings, profile)          │ │
│  │  useMutation → POST/PATCH/DELETE (create booking, submit review) │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**Key Design Decisions:**
- **TypeScript** throughout for type safety
- **Zustand** over Redux for lightweight global state (auth tokens, booking filters, guest mode)
- **TanStack Query** for server state — caching, auto-refetch, loading/error states for API calls
- **Axios** with request/response interceptors for JWT attachment and error normalization
- **React Navigation** with role-based routing (user vs admin tab navigators) and guest gating
- **Guest mode** — unauthenticated users can browse the app; `AppNavigator` gates on `isAuthenticated || isGuest`
- Component-driven UI with a shared common component library

---

### 2. Backend Layer (Node.js + Express)

```
┌──────────────────────────────────────────────────────────────────────┐
│                       Express.js Server                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Entry Points                                                     │ │
│  │  server.js — starts HTTP server                                   │ │
│  │  app.js — Express app setup, middleware, routes                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Middleware Pipeline (src/middleware/)                             │ │
│  │                                                                   │ │
│  │  Request → Morgan(log) → CORS → FirebaseVerify → JWT → Validator │ │
│  │                              ↓ (if protected)                     │ │
│  │                    authMiddleware → adminMiddleware               │ │
│  │                              ↓                                    │ │
│  │                    Controller → Service → Model                   │ │
│  │                              ↓                                    │ │
│  │                    Response ← Error Handler                       │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Module Structure (controllers → routes)                          │ │
│  │                                                                   │ │
│  │  Module        │ Controller               │ Routes                │ │
│  │  ──────────────┼──────────────────────────┼────────────────────── │ │
│  │  Auth          │ authController.js        │ /auth/*               │ │
│  │  User          │ userController.js        │ /users/*              │ │
│  │  Service       │ serviceController.js     │ /services/*           │ │
│  │  Category      │ (in serviceController)   │ /categories/*         │ │
│  │  Cart          │ (in userController)      │ /cart/*               │ │
│  │  Booking       │ bookingController.js     │ /bookings/*           │ │
│  │  Payment       │ paymentController.js     │ /payments/*           │ │
│  │  Review        │ reviewController.js      │ /reviews/*            │ │
│  │  Complaint     │ complaintController.js   │ /complaints/*         │ │
│  │  Notification  │ notificationController.js│ /notifications/*      │ │
│  │  Query         │ (contact us)             │ /queries/*            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  Configuration (src/config/)                                      │ │
│  │  db.js — Mongoose connection                                      │ │
│  │  firebase.js — Firebase Admin SDK init                            │ │
│  │  cloudinary.js — Cloudinary SDK config                            │ │
│  │  razorpay.js — Razorpay SDK init                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**API Conventions:**
- All routes prefixed with `/api/v1`
- Consistent JSON response shape: `{ success: boolean, data?: {}, message?: string, code?: string }`
- Protected routes require `Authorization: Bearer <JWT>`
- Validation errors return 422 with field-level details
- Business logic lives in controllers (thin), services handle computation, models define schemas

---

### 3. Database Layer (MongoDB + Mongoose)

The database uses four architectural patterns from `docs/context/db-table.md`:

#### Pattern 1: Embedded Sub-documents (One-to-Few)

Used for data that is tightly bound to a parent and limited in size.

```
User document
├── addresses: [                          ← embedded array
│   { label, line1, line2, city, state,
│     pincode, country, lat, lng }        ← addressSchema
│ ]
├── cart_items: [                         ← embedded array
│   { service_id, quantity, added_at }    ← cartItemSchema
│ ]
```

#### Pattern 2: Extended Reference (Snapshot)

Used in Bookings to preserve historical accuracy when referenced data may change.

```
Booking document
├── service_snapshot: {                   ← snapshot at booking time
│   service_id: ObjectId,
│   name: "Deep Cleaning",
│   price: 1499.00
│ }
├── address_snapshot: {                   ← snapshot at booking time
│   line1, line2, city, state,
│   pincode, country, lat, lng
│ }
```

#### Pattern 3: Separate Collections (One-to-Many)

Used when child data can grow unbounded or needs independent querying.

```
Service (avg_rating, review_count cached)
    ↑
Reviews ──── one review per booking, indexed by service_id

Booking
    ↑
Payment ───── separate audit trail for reconciliation
```

#### Pattern 4: Self-Referencing Hierarchy

Used for category tree support.

```
Category
├── _id: ObjectId
├── parent_id: ObjectId | null   ← self-reference for sub-categories
├── name: "Cleaning"
│
├── Category
│   ├── parent_id: <Cleaning _id>
│   ├── name: "Deep Cleaning"
```

#### Collection Indexes Summary

| Collection | Indexes |
|------------|---------|
| User | `{ email: 1 }` unique, `{ phone: 1 }` |
| Category | `{ name: 1 }` unique |
| Service | `{ category_id: 1 }`, `{ tags: 1 }` multikey, `{ name: 'text', description: 'text' }` full-text |
| Booking | `{ user_id: 1 }`, `{ 'service_snapshot.service_id': 1 }`, `{ booking_date: 1 }`, `{ status: 1 }` |
| Payment | `{ booking_id: 1 }`, `{ transaction_id: 1 }` |
| Notification | `{ user_id: 1, is_read: 1, created_at: -1 }` compound |
| Complaint | `{ booking_id: 1 }`, `{ user_id: 1 }` |
| Review | `{ service_id: 1 }` |
| Query | `{ email: 1 }` |

---

## Authentication & Authorization Architecture

The system uses a **two-token** strategy: Firebase ID tokens for initial verification, then application-level JWTs for ongoing sessions.

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────────┐
│ React Native │     │ Firebase Auth    │     │ Express Backend   │
│    App       │     │     SDK          │     │                   │
└──────┬───────┘     └────────┬─────────┘     └────────┬──────────┘
       │                      │                        │
       │ 1. Phone number      │                        │
       │─────────────────────>│                        │
       │                      │                        │
       │ 2. SMS OTP           │                        │
       │<─────────────────────│                        │
       │                      │                        │
       │ 3. Enter OTP         │                        │
       │ 4. Verify OTP        │                        │
       │─────────────────────>│                        │
       │                      │                        │
       │ 5. ID Token + UID    │                        │
       │<─────────────────────│                        │
       │                      │                        │
       │ 6. POST /auth/verify │                        │
       │    { idToken }       │                        │
       │──────────────────────────────────────────────>│
       │                      │                        │
       │                      │   7. Verify via        │
       │                      │   Firebase Admin SDK   │
       │                      │<───────────────────────│
       │                      │                        │
       │                      │   8. Valid / Invalid   │
       │                      │───────────────────────>│
       │                      │                        │
       │                      │   9. Create/fetch user │
       │                      │   Issue app JWT        │
       │                      │                        │
       │ 10. { user, JWT }    │                        │
       │<──────────────────────────────────────────────│
       │                      │                        │
       │ 11. Subsequent calls │                        │
       │     Authorization:   │                        │
       │     Bearer <JWT>     │                        │
       │──────────────────────────────────────────────>│
       │                      │                        │
       │                      │   12. Verify JWT       │
       │                      │   (authMiddleware)     │
       │                      │                        │
```

**Token Flow:**
1. Firebase ID token — short-lived, used only for initial verification
2. App JWT — issued by backend, sent on every subsequent request
3. Firebase SDK handles ID token refresh on-device automatically

**Session Persistence:**
- JWT stored securely on device (encrypted storage)
- Zustand `useAuthStore` hydrates from storage on app launch
- Backend validates JWT on each request; no server-side session store

---

## Data Flow: Key Business Processes

### Booking → Payment → Completion Flow

```
┌──────────┐   ┌────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Browse   │   │  Cart   │   │ Booking  │   │ Payment  │   │ Post-    │
│  Services │   │        │   │ Creation │   │          │   │ Completion│
└─────┬─────┘   └────┬───┘   └─────┬────┘   └────┬─────┘   └─────┬────┘
      │              │             │             │               │
      │─────────────>│             │             │               │
      │  Add to Cart │             │             │               │
      │              │────────────>│             │               │
      │              │  Checkout   │             │               │
      │              │  (snapshot  │             │               │
      │              │   service   │             │               │
      │              │   + address)│             │               │
      │              │  status:    │             │               │
      │              │  pending    │             │               │
      │              │             │────────────>│               │
      │              │             │  Initiate   │               │
      │              │             │  Payment    │               │
      │              │             │             │               │
      │              │             │  ┌─────────────────────┐    │
      │              │             │  │ Successful → status │    │
      │              │             │  │ confirmed           │    │
      │              │             │  ├─────────────────────┤    │
      │              │             │  │ Failed → retry or   │    │
      │              │             │  │ cancel              │    │
      │              │             │  └─────────────────────┘    │
      │              │             │             │               │
      │              │             │<────────────│               │
      │              │             │  confirmed  │               │
      │              │             │             │               │
      │              │             │             │  ┌───────────────────┐
      │              │             │             │  │ Review → rating   │
      │              │             │             │  ├───────────────────┤
      │              │             │             │  │ Complaint → open  │
      │              │             │             │  │ → in_progress →   │
      │              │             │             │  │ resolved → closed │
      │              │             │             │  └───────────────────┘
```

### Notification Trigger Flow

```
Event occurs (booking confirmed, payment failed, complaint updated, etc.)
       │
       ▼
Create Notification document in MongoDB
  { user_id, type, title, message, reference_id, is_read: false }
       │
       ▼
Send push via Firebase Cloud Messaging (FCM)
  → Device receives notification
  → App updates notification list (unread-first sort)
       │
       ▼
User reads notification
  → PATCH /notifications/:id/read  →  is_read: true
```

---

## Integration Architecture

### Firebase (Auth + Notifications)

| Component | SDK | Purpose |
|-----------|-----|---------|
| Mobile App | Firebase Auth SDK | Phone OTP sign-in, ID token management, token refresh |
| Mobile App | FCM SDK | Device token registration, push notification receipt |
| Backend | Firebase Admin SDK + `firebase-admin` | ID token verification, FCM message dispatch |

### Razorpay (Payments)

```
Mobile App                    Backend                     Razorpay
    │                           │                           │
    │  POST /payments/          │                           │
    │  create-order             │                           │
    │  { booking_id }          │                           │
    │──────────────────────────>│                           │
    │                           │  razorpay.orders.create() │
    │                           │──────────────────────────>│
    │                           │  { order_id, amount }    │
    │                           │<──────────────────────────│
    │  { order_id }            │                           │
    │<──────────────────────────│                           │
    │                           │                           │
    │  Launch Razorpay Checkout │                           │
    │  (order_id)              │                           │
    │──────────────────────────────────────────────────────>│
    │                           │                           │
    │  User completes payment  │                           │
    │                           │                           │
    │  POST /payments/verify    │                           │
    │  { razorpay_signature }  │                           │
    │──────────────────────────>│                           │
    │                           │  HMAC signature verify   │
    │                           │  Update Payment + Booking │
    │  { success }             │                           │
    │<──────────────────────────│                           │
    │                           │                           │
    │                           │  Webhook (async events)  │
    │                           │<──────────────────────────│
    │                           │  Handle refunds/failures │
```

**Security:** Payment status is never trusted from the client. HMAC signature validation on both `POST /payments/verify` and the Razorpay webhook ensures integrity.

### Cloudinary (Image Storage)

```
Mobile App                    Backend                     Cloudinary
    │                           │                           │
    │  POST /users/me/          │                           │
    │  upload-image             │                           │
    │  (multipart/form-data)    │                           │
    │──────────────────────────>│                           │
    │                           │  Multer receives file    │
    │                           │  cloudinary.uploader.    │
    │                           │  upload()                │
    │                           │──────────────────────────>│
    │                           │  { secure_url,           │
    │                           │    public_id }           │
    │                           │<──────────────────────────│
    │                           │                           │
    │  { img_url }             │                           │
    │<──────────────────────────│                           │
```

---

## Security Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                      Security Layers                                  │
│                                                                       │
│  Layer 1: Transport                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ HTTPS (TLS) — all API traffic encrypted                         │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Layer 2: Authentication                                              │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Firebase Admin SDK — server-side ID token verification          │  │
│  │ JWT middleware — Bearer token check on every protected route    │  │
│  │ Rate limiting on /auth/verify to prevent OTP abuse              │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Layer 3: Authorization                                               │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Role-based access control (adminMiddleware)                     │  │
│  │ Roles: customer, provider, admin                                │  │
│  │ Provider/admin gates on: service mutation, booking status       │  │
│  │ Admin only: complaint resolution, query management              │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Layer 4: Input Validation                                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Express Validator — request body/param validation at route layer│  │
│  │ Returns 422 with field-level errors on failure                  │  │
│  │ Request sanitization to prevent injection                       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Layer 5: Payment Security                                            │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ HMAC SHA-256 signature verification on payment confirm          │  │
│  │ Razorpay webhook signature validation                           │  │
│  │ Payment status never accepted from client                       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Layer 6: Error Handling                                              │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │ Centralized error handler — consistent JSON response            │  │
│  │ No stack traces leaked in production                            │  │
│  │ Explicit codes: BOOKING_NOT_FOUND, VALIDATION_ERROR, etc.       │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
                          ┌─────────────────────────┐
                          │     DNS / Load Balancer  │
                          │    (e.g., Cloudflare)    │
                          └────────────┬────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │   Express.js Server      │
                          │   (Production Host)      │
                          │   • Node.js runtime      │
                          │   • PM2 or Docker        │
                          │   • Environment: .env    │
                          └────────────┬────────────┘
                                       │
             ┌─────────────────────────┼─────────────────────────┐
             │                         │                         │
             ▼                         ▼                         ▼
   ┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
   │   MongoDB Atlas  │     │  Firebase         │     │  Razorpay        │
   │   (Production)   │     │  (Auth + FCM)     │     │  (Payments)      │
   └─────────────────┘     └──────────────────┘     └──────────────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  Cloudinary      │
                                                  │  (Image Storage) │
                                                  └──────────────────┘

Mobile App Stores (Google Play / App Store)
  ┌─────────────────┐     ┌──────────────────┐
  │  Android APK/AAB │     │  iOS IPA         │
  │  (google-services)│     │  (GoogleService- │
  └─────────────────┘     │   Info.plist)     │
                          └──────────────────┘
```

**Environment-specific Configurations:**
- Development: local MongoDB, Firebase test project, Razorpay test keys
- Production: MongoDB Atlas, Firebase production project, Razorpay live keys
- `.env` file contains all environment-specific values; never committed to version control

---

## Module Dependency Graph

```
                    ┌─────────────┐
                    │    Auth     │
                    └──────┬──────┘
                           │ depends on
                           ▼
                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────────┐
       │ Services │ │  Cart    │ │ Notifications │
       └────┬─────┘ └────┬─────┘ └──────────────┘
            │            │
            └──────┬─────┘
                   ▼
            ┌──────────┐
            │ Bookings │
            └────┬─────┘
                 │
         ┌───────┴───────┐
         ▼               ▼
   ┌──────────┐    ┌───────────┐
   │ Payments │    │ Complaints│
   └──────────┘    └───────────┘
         │               │
         ▼               ▼
   ┌──────────┐    ┌───────────┐
   │ Reviews  │    │ Queries   │
   └──────────┘    └───────────┘
```

**Dependency Rules:**
- Auth must be implemented first (all other modules depend on authenticated users)
- User profile depends on Auth (created during auth flow)
- Services and Cart are independent of each other but both feed into Bookings
- Payments depend on Bookings (payment is tied to a booking)
- Reviews and Complaints both depend on completed Bookings
- Notifications is a cross-cutting module triggered by Booking, Payment, and Complaint events
- Queries (Contact Us) is standalone, depends only on User (optional for guests)
- Admin panel is a UI overlay on all existing modules, no new backend logic

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Mobile Framework | React Native + TypeScript | Cross-platform iOS/Android app |
| State Management | Zustand | Client global state (auth, app-level) |
| Server State | TanStack Query (React Query) | API data caching, auto-refetch, loading/error states |
| Navigation | React Navigation | Stack + Bottom Tab navigation |
| HTTP Client | Axios | API communication with JWT interceptor |
| Backend Runtime | Node.js | JavaScript runtime |
| API Framework | Express.js | REST API gateway |
| Database | MongoDB | Document storage |
| ODM | Mongoose | Schema modeling, validation, indexing |
| Auth (Mobile) | Firebase Auth SDK | Phone OTP sign-in |
| Auth (Server) | Firebase Admin SDK + JWT | Token verification + app session tokens |
| Payments | Razorpay SDK + Webhooks | Payment processing |
| Media Storage | Cloudinary SDK | Image upload and delivery |
| Push Notifications | Firebase Cloud Messaging | Real-time notifications |
| File Upload | Multer | Multipart form handling |
| Validation | Express Validator | Request body/param validation |
| Logging | Morgan | HTTP request logging |
| Environment | dotenv | Configuration management |

---

## Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Embedded addresses & cart in User | One-to-few pattern; always read together with user; avoids joins |
| Extended reference snapshots in Booking | Preserves historical accuracy if service price/address changes later |
| Separate Payment collection | Financial audit trail needs independent querying and reconciliation |
| Separate Review collection | Prevents unbounded array growth on Service (16MB doc limit) |
| Firebase OTP + custom JWT | Firebase handles SMS infrastructure; custom JWT gives us role control and reduced Firebase costs on API calls |
| Zustand over Redux | Minimal boilerplate for a focused set of global state (auth tokens, booking filters) |
| TanStack Query for server state | Separates server cache from client state; automatic refetching, deduplication, and loading/error state management |
| Axios interceptors for JWT | Centralized token attachment and 401 handling without per-request code |
| Role-based navigation | Separate tab navigators for user and admin; cleaner code separation |
| Centralized error handler | Consistent API contract for the mobile client to parse errors |
| Cart as embedded array | Simple, bounded data; no need for a separate cart collection unless multi-device sync required later |

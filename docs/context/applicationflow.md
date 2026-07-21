# Application Flows

## Booking Creation Flow

```
Browse Services -> Add to Cart -> Create Booking -> Booking Status: Pending
```

## Payment Flow

```
Initiate Payment
  -> Successful -> Booking Status: Confirmed
  -> Failed -> Retry Payment (loops back to Initiate Payment)
           -> Booking Cancelled (if abandoned)
```

## Booking Status Lifecycle

```
Pending -> Confirmed -> In Progress -> Completed
Pending -> Cancelled
Confirmed -> Cancelled
```

## Post-Completion Flow

```
Booking Completed
  -> Review Submitted (rating + comment) [end]
  -> Complaint Filed -> Open -> In Progress -> Resolved -> Closed
```

## Notification Triggers

| Event                              | Notification Type |
|------------------------------------|-------------------|
| Booking status changes to Confirmed | booking           |
| Payment status changes to Failed    | payment           |
| Complaint status changes            | complaint         |
| Promotional campaign sent           | promotion         |

## Query / Contact-Us Flow

```
Query Submitted (status: open) -> Support Responds -> Linked to user_id (optional) -> Status: Closed
```

## Create User Flow (Phone OTP via Firebase Auth)

```
User opens app -> Enters phone number on login screen
  -> App calls Firebase Auth (signInWithPhoneNumber)
  -> Firebase sends OTP via SMS to that phone number

User enters OTP in app
  -> App verifies OTP with Firebase
       -> Invalid / expired OTP -> Show error, allow resend [end]
       -> Valid OTP -> Firebase returns ID token (JWT) + Firebase UID

App sends Firebase ID token to backend (e.g. POST /auth/verify)
  -> Backend verifies ID token using Firebase Admin SDK
       -> Invalid/expired token -> Reject request [end]
       -> Valid token -> extract phone_number + firebase_uid

  -> Backend looks up user in DB by firebase_uid
       -> User exists -> fetch user, update last_login_at -> continue
       -> User does not exist -> create new user record
            (phone, firebase_uid, role: customer, is_active: true,
             profile_complete: false, created_at: now, updated_at: now)

  -> If new user -> Trigger Notification (type: system, "Welcome to the platform")
  -> Backend returns user profile + auth status to app

  -> If profile_complete: false
       -> App prompts for first_name, last_name, email (optional), address
       -> User submits -> Update user record -> profile_complete: true

  -> User logged in -> lands on home/dashboard

ON EVERY SUBSEQUENT REQUEST
App attaches Firebase ID token in Authorization header
  -> Backend verifies token via Firebase Admin SDK on each call
  -> Firebase SDK on-device handles token refresh automatically
```

```
Firebase OTP Authentication
  -> Backend verifies Firebase UID
  -> Generate JWT
  -> React Native stores JWT
  -> All API requests use JWT
```

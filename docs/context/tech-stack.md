# Project Tech Stack

This document outlines the standard technology stack utilized for the ServiceProviderApp project.

## Frontend
- **Framework:** React Native (TypeScript)
- **State Management:** Zustand
- **Server State & Data Fetching:** TanStack Query (React Query)
- **HTTP Client:** Axios (with JWT interceptor)
- **Navigation:** React Navigation (Stack + Bottom Tab)
- **Storage:** @react-native-async-storage/async-storage (Zustand persistence)

## Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Validation:** Express Validator
- **Logging:** Morgan
- **File Upload:** Multer
- **Environment Config:** dotenv

## Database
- **Engine:** MongoDB
- **ODM:** Mongoose

## Authentication
- **Service:** Firebase Auth (Phone OTP)
- **Server-side:** Firebase Admin SDK + JWT tokens

## Notifications
- **Service:** Firebase Cloud Messaging (FCM)

## Payments
- **Gateway:** Razorpay (SDK + Webhooks)

## Image Storage
- **Service:** Cloudinary

## Testing
- **Framework:** Jest
- **Backend:** mongodb-memory-server (in-memory MongoDB), supertest (HTTP assertions)
- **Frontend:** @react-native/jest-preset

## Version Control
- **Platform:** GitHub

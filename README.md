# ServiceProviderApp

A cross-platform mobile application for booking home services (cleaning, plumbing, electrical, beauty, appliance repair, painting). Built with **React Native** (TypeScript) frontend and **Express.js** (Node.js) backend, using MongoDB, Firebase Auth, Razorpay payments, and Cloudinary media storage.

## Architecture

```
React Native App (TypeScript)
  ├── Navigation (React Navigation — Stack + Bottom Tabs)
  ├── State (Zustand — auth, booking stores)
  ├── Server State (TanStack Query — API caching)
  └── Services (Axios HTTP client with JWT interceptor)
        │
        ▼
Express.js API Gateway (Node.js)
  ├── Middleware (Morgan, CORS, JWT auth, RBAC, validation)
  ├── Controllers → Models (Mongoose) → MongoDB
  └── Integrations: Firebase Admin, Razorpay, Cloudinary, FCM
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native + TypeScript |
| State Management | Zustand |
| Server State | TanStack Query (React Query) |
| Navigation | React Navigation |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | Firebase Auth (Phone OTP) + JWT |
| Payments | Razorpay |
| Image Storage | Cloudinary |
| Push Notifications | Firebase Cloud Messaging |
| Testing | Jest, mongodb-memory-server, supertest |

## Project Structure

```
ServiceProviderApp/
├── src/                          # React Native frontend
│   ├── screens/                  # 16 screens (auth, user, admin)
│   ├── navigation/               # AppNavigator, UserTabNavigator, AdminTabNavigator
│   ├── services/                 # API client, auth, booking, service, user, notification, admin
│   ├── store/                    # Zustand stores (useAuthStore, useBookingStore)
│   ├── components/               # Reusable UI (common/, domain, modals, admin)
│   ├── hooks/                    # TanStack Query hooks (6 hook files)
│   ├── types/                    # TypeScript interfaces
│   ├── utils/                    # Constants, formatters, validators
│   ├── data/                     # Mock data (services, bookings, user)
│   └── config/                   # Environment config
│
├── backend/                      # Express.js API server
│   ├── config/                   # db, firebase, razorpay, cloudinary
│   ├── controllers/              # 10 controllers (auth, user, service, booking, payment, etc.)
│   ├── middleware/                # authMiddleware, adminMiddleware, errorMiddleware
│   ├── models/                   # 9 Mongoose models (User, Category, Service, Booking, etc.)
│   ├── routes/                   # 10 route files mounted at /api/v1/*
│   ├── utils/                    # seed, serialize helpers
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Entry point
│   └── __tests__/                # 16 test files (114 tests)
│
├── __tests__/                    # Frontend tests (14 test files, 74 tests)
├── __mocks__/                    # Jest mocks (AsyncStorage)
├── docs/                         # Project documentation
│   ├── context/                  # Architecture, tech stack, conventions, theme, etc.
│   └── plan/                     # Implementation plan
│
├── jest.config.js                # Frontend Jest config
├── package.json
├── tsconfig.json
└── App.tsx                       # App entry point
```

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native CLI environment ([Setup Guide](https://reactnative.dev/docs/set-up-your-environment))
- MongoDB (local or Atlas)
- Firebase project (Auth + Cloud Messaging)
- Razorpay account (test keys)
- Cloudinary account

### Frontend Setup

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS (install pods first)
cd ios && pod install && cd ..
npm run ios
```

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables below)
cp .env.example .env

# Start development server
npm run dev
```

### Running Tests

```bash
# Frontend tests (from root)
npm test

# Backend tests (from backend/)
cd backend
npm test
```

## Environment Variables

### Backend (`backend/.env`)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/serviceprovider
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
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

### Frontend (`.env`)

```
API_BASE_URL=http://localhost:3000/api/v1
```

## API Overview

All routes prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <JWT>`.

| Module | Endpoints | Description |
|--------|-----------|-------------|
| Auth | `POST /auth/verify`, `/auth/complete-profile`, `/auth/logout` | Firebase OTP → JWT |
| Users | `GET/PATCH /users/me`, address CRUD, image upload | Profile management |
| Services | `GET/POST/PATCH/DELETE /services`, `GET /categories` | Service catalog |
| Bookings | `GET/POST /bookings`, `PATCH /:id/cancel`, `PATCH /:id/status` | Booking lifecycle |
| Payments | `POST /payments/create-order`, `/verify`, `/webhook` | Razorpay integration |
| Reviews | `POST /reviews`, `GET /services/:id/reviews` | Ratings & reviews |
| Complaints | `GET/POST /complaints`, `PATCH /:id/status` | Support tickets |
| Notifications | `GET /notifications`, `PATCH /:id/read`, `/read-all` | Push + in-app |
| Queries | `POST /queries`, `GET /queries`, `PATCH /:id/close` | Contact us |
| Admin | `GET /admin/stats`, user management, booking/service admin | Dashboard |

## Testing

- **Backend:** 16 test suites, 114 tests using Jest + mongodb-memory-server (in-memory MongoDB)
- **Frontend:** 14 test suites, 74 tests using Jest + @react-native/jest-preset
- Tests cover controllers, middleware, utilities, services, hooks, stores, and integration flows

```bash
# Run all tests
cd backend && npm test    # Backend: 114 tests
npm test                  # Frontend: 74 tests
```

## Documentation

- [Architecture](docs/context/architecture.md) — System design, layer architecture, data flows
- [Backend](docs/context/backend.md) — API endpoints, data model, auth flow
- [Frontend](docs/context/frontend.md) — UI specification, screen layouts, component inventory
- [Tech Stack](docs/context/tech-stack.md) — Technology choices
- [Conventions](docs/context/conventions.md) — Coding, naming, API, and Git conventions
- [Theme](docs/context/theme.md) — Design tokens, colors, typography, spacing
- [DB Schema](docs/context/db-table.md) — MongoDB collections and indexes
- [Application Flows](docs/context/applicationflow.md) — Business process flows
- [Implementation Plan](docs/plan/implementationplan.md) — Phased development plan

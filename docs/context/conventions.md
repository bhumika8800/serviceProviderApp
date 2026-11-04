# Conventions

## 1. Naming Conventions

### File & Folder Naming

| Asset | Convention | Example |
|-------|-----------|---------|
| React/TSX component files | PascalCase | `LoginScreen.tsx`, `ServiceCard.tsx` |
| Non-component TS/JS files | camelCase | `authService.ts`, `formatters.ts` |
| Folders | lowercase, hyphenated for multi-word | `screens/auth/`, `components/common/` |
| Style files | match component name | `Button.styles.ts` (if extracted) |
| Test files | match source file + `.test` | `authService.test.ts` |

### Code Naming

| Asset | Convention | Example |
|-------|-----------|---------|
| React components | PascalCase | `function BookingItem()`, `class AdminDashboard` |
| Functions & methods | camelCase | `getUserProfile()`, `handleSubmit()` |
| Variables | camelCase | `const isLoading = true` |
| Constants (app-wide) | UPPER_SNAKE_CASE | `API_BASE_URL`, `OTP_RESEND_TIMEOUT` |
| TypeScript types/interfaces | PascalCase | `interface Booking`, `type UserRole` |
| Enums | PascalCase (name), UPPER_SNAKE_CASE (values) | `enum BookingStatus { PENDING, CONFIRMED }` |
| MongoDB model names | Singular, PascalCase | `User`, `Booking`, `Service` |
| API route params | camelCase | `:serviceId`, `:bookingId` |
| Database fields | snake_case | `first_name`, `is_active`, `created_at` |

---

## 2. Project Structure Conventions

### Frontend (`src/`)

```
src/
├── screens/           # One file per screen, grouped by domain
│   ├── auth/          # Auth-related screens
│   ├── user/          # Customer screens
│   └── admin/         # Admin screens
├── navigation/        # Navigation config files
├── services/          # Firebase, API client, integrations
├── store/             # Zustand stores, one per domain
├── components/        # Reusable components
│   ├── common/        # Generic UI kit (Button, Input, etc.)
│   └── *.tsx          # Domain-specific components (ServiceCard, etc.)
├── hooks/             # Custom React hooks
├── types/             # Shared TypeScript type definitions
└── utils/             # Helper functions, constants, validators
```

- Screen files contain only UI + minimal logic; delegate data fetching to hooks or services
- Components in `common/` are fully generic and prop-driven
- Domain components (e.g., `ServiceCard`) may import from `common/` but not from screens
- Store files follow the pattern `use<Domain>Store.ts`

### Backend (`backend/`)

```
backend/
├── config/            # Integration configs (db, firebase, cloudinary, razorpay)
├── controllers/       # Request handling, one per domain
├── middleware/        # Express middleware (auth, admin, upload, error)
├── models/           # Mongoose schemas, one per collection
├── routes/           # Express route definitions, one per domain
├── utils/            # Helper functions
└── uploads/          # Temporary file storage for Multer
```

- Controllers are thin: parse request, call service/model, send response
- Business logic lives in controllers or extracted services
- One route file per domain, mounted in `app.js`
- Middleware is stateless and reusable across routes

---

## 3. API Conventions

### Endpoint Patterns

```
Base URL: /api/v1

GET    /resource           # List (with query params for filtering/pagination)
GET    /resource/:id       # Detail
POST   /resource           # Create
PATCH  /resource/:id       # Partial update
DELETE /resource/:id       # Soft delete (set is_active: false)
```

### Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**List with pagination:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Human-readable message",
  "code": "BOOKING_NOT_FOUND"
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 422 | Request body/param validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Role does not have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Duplicate email/phone |
| `RATE_LIMITED` | 429 | Too many requests |
| `PAYMENT_SIGNATURE_MISMATCH` | 400 | Razorpay HMAC verification failed |
| `INTERNAL_ERROR` | 500 | Unhandled server error |

---

## 4. TypeScript Conventions

### Strict Mode

- `strict: true` in `tsconfig.json`
- Avoid `any` — use `unknown` + type guards when type is uncertain
- Prefer `interface` over `type` for object shapes (extendable, mergeable)
- Use `type` for unions, tuples, mapped types

### Example Patterns

```typescript
// Interface for data models
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
}

// Type for unions
export type UserRole = 'customer' | 'provider' | 'admin';

// Enum for status constants
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}
```

---

## 5. React Native Component Conventions

### Component Structure

```typescript
// Imports (grouped: React → Libraries → Project → Styles)
import React from 'react';
import { View, Text } from 'react-native';
import { useServices } from '../../hooks/useServices';
import { ServiceCard } from '../ServiceCard';
import { Button } from '../common/Button';

// Types
interface Props {
  categoryId: string;
  onSelect: (serviceId: string) => void;
}

// Component
export function ServiceList({ categoryId, onSelect }: Props) {
  const { services, isLoading } = useServices(categoryId);
  // ...
}
```

### Rules
- One component per file
- Export the component as a named export (no `export default`)
- Props interface defined above the component
- Use functional components with hooks (no class components)
- Style definitions at bottom of file or in separate `.styles.ts` file
- Avoid inline styles for reusable components

---

## 6. State Management Conventions (Zustand)

```typescript
// Store naming: use<Domain>Store.ts
// Example: useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

- Use `persist` middleware for tokens and user session
- Keep stores focused: one concern per store
- Actions (functions) co-located with state in the same store

---

## 7. TanStack Query Conventions

### Query Key Structure

Use a consistent array-based key pattern:

```typescript
// Pattern: ['domain', ...params]
['services']
['services', serviceId]
['bookings']
['bookings', { status: 'active' }]
['users', 'me']
['notifications']
['reviews', serviceId]
```

### Query Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| `staleTime` | 5 minutes | Services data changes infrequently |
| `gcTime` | 30 minutes | Keep cache for navigation back/forth |
| `retry` | 2 | Retry failed requests twice before showing error |
| `refetchOnWindowFocus` | false | Mobile app, no window focus concept |

### File Organization

```typescript
// hooks/useServices.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceApi } from '../services/serviceCatalog';

export function useServices(categoryId?: string) {
  return useQuery({
    queryKey: ['services', categoryId],
    queryFn: () => serviceApi.list(categoryId),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: () => serviceApi.getById(id),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: serviceApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
}
```

### Rules

- One hook file per domain: `useServices.ts`, `useBookings.ts`, `useUserRole.ts`
- Each file exports individual `useQuery` and `useMutation` hooks
- Colocate query keys with the hooks that use them
- Use `invalidateQueries` on mutation success to refetch stale data
- Use `enabled` option for dependent queries (e.g., wait for auth before fetching profile)
- Keep API functions in `src/services/` (pure functions), call them from hooks

---

## 8. Git Conventions

### Branch Naming

```
feature/<short-description>    # New feature
fix/<short-description>        # Bug fix
chore/<short-description>      # Maintenance, refactoring, dependencies
docs/<short-description>       # Documentation
```

### Commit Messages

```
type(scope): description

Types: feat, fix, chore, docs, refactor, test
Scope: auth, booking, payment, api, ui, etc.
```

Examples:
```
feat(auth): add Firebase OTP verification flow
fix(booking): handle empty service list on MyBookings screen
chore(deps): upgrade react-native to 0.76
```

---

## 8. Database Conventions (Mongoose)

### Schema Rules

- Use `timestamps: true` to auto-manage `created_at` and `updated_at`
- Use `Decimal128` for monetary values (avoid float rounding)
- Use `String` for phone numbers (preserve leading zeros, country codes)
- Soft delete via `is_active: boolean` — never hard-delete records
- Index all foreign key fields (`user_id`, `booking_id`, `service_id`)
- Snapshot pattern: store copies of mutable data at time of transaction (e.g., `service_snapshot`, `address_snapshot` in Booking)
- Embedded schema for one-to-few relationships (addresses, cart items in User)

### Field Ordering Convention

```typescript
{
  // 1. References
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // 2. Core data fields
  title: { type: String, required: true },
  description: { type: String },

  // 3. Status/enum fields
  status: { type: String, enum: ['open', 'closed'], default: 'open' },

  // 4. Boolean flags
  is_active: { type: Boolean, default: true },

  // 5. Timestamps (auto via timestamps: true)
}
```

---

## 9. Security Conventions

- Never trust client-asserted UID — verify via Firebase Admin SDK server-side
- All protected routes require `Authorization: Bearer <JWT>` header
- Payment status must be verified via HMAC signature (Razorpay), never accepted from client
- Rate limit auth endpoints to prevent OTP/spam abuse
- Validate all request bodies with Express Validator at route layer
- Sanitize inputs to prevent NoSQL injection
- No password storage — auth is entirely OTP/Firebase-based
- Environment variables never committed to version control
- CORS restricted to production frontend origin

---

## 10. Integration Conventions

### Firebase
- Frontend: Firebase Auth SDK for phone OTP + FCM for push notifications
- Backend: Firebase Admin SDK for token verification + message dispatch
- Firebase config files (`google-services.json`, `GoogleService-Info.plist`) excluded from git

### Razorpay
- Test mode for development, live keys for production
- Webhook secret configured in Razorpay dashboard, verified on every webhook call
- Orders created server-side; checkout launched client-side with `order_id`

### Cloudinary
- Upload via backend (Multer → Cloudinary SDK) to keep API keys server-side
- Returned `secure_url` stored in database
- Profile images overwritten on re-upload (same `public_id` pattern per user)

---

## 11. Testing Conventions

### Test File Location
- **Backend tests:** `backend/__tests__/` — mirrors controller/model structure
- **Frontend tests:** `__tests__/` at project root — mirrors src/ structure (hooks/, services/, store/, utils/)
- **Naming:** `<module>.test.js` — co-located by domain within `__tests__/`

### Backend Testing
- **Framework:** Jest with `testEnvironment: "node"`
- **Database:** mongodb-memory-server (in-memory MongoDB, no external DB needed)
- **Setup:** `backend/__tests__/setup.js` — MongoMemoryServer lifecycle, mock factories
- **Pattern:** Each controller test gets its own in-memory MongoDB instance
- **Coverage:** Jest `--coverage` flag, output to `backend/coverage/`

### Frontend Testing
- **Framework:** Jest with `@react-native/jest-preset`
- **Module mapping:** AsyncStorage mapped to `__mocks__/@react-native-async-storage/async-storage.js`
- **Exclusions:** `testPathIgnorePatterns: ['/node_modules/', '/backend/']`
- **Pattern:** Simple export/behavior tests for hooks, services, stores, and utils

### Test Structure
```javascript
// Backend controller test pattern
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Controller', () => {
  test('should do X', async () => {
    // Arrange, Act, Assert
  });
});
```

### Running Tests
```bash
# Backend (from backend/)
npm test                    # Run all tests
npm test -- --coverage      # With coverage

# Frontend (from root)
npm test                    # Run all frontend tests
```

### Coverage Targets
- Backend: All controllers, middleware, and utils covered
- Frontend: All hooks, services, stores, and utils covered
- Integration tests for critical business flows (booking lifecycle, admin workflow)

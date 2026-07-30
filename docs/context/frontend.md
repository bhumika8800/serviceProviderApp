# Frontend Folder Structure

```
ServiceProviderApp/
│
├── src/                              # All app source code
│
│   ├── screens/                      # All screen components
│   │
│   │   ├── auth/                     # Login & OTP flow
│   │   │   ├── LoginScreen.tsx
│   │   │   └── OtpScreen.tsx
│   │   │
│   │   ├── user/                     # Customer-facing screens
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── BookingScreen.tsx
│   │   │   ├── MyBookingsScreen.tsx
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── ServiceDetailScreen.tsx
│   │   │
│   │   └── admin/                    # Company admin screens
│   │       ├── AdminDashboardScreen.tsx
│   │       ├── AdminBookingsScreen.tsx
│   │       ├── AdminClientsScreen.tsx
│   │       ├── AdminServicesScreen.tsx
│   │       └── ClientDetailScreen.tsx
│   │
│   ├── navigation/                   # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── UserTabNavigator.tsx
│   │   ├── AdminTabNavigator.tsx
│   │   └── types.ts
│   │
│   ├── services/                     # Firebase service layer
│   │   ├── firebase.ts
│   │   ├── authService.ts
│   │   ├── bookingService.ts
│   │   ├── serviceCatalog.ts
│   │   ├── userService.ts
│   │   └── notificationService.ts
│   │
│   ├── store/                        # Zustand global state
│   │   ├── useAuthStore.ts
│   │   └── useBookingStore.ts
│   │
│   ├── components/                   # Reusable UI components
│   │   │
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── StatusBadge.tsx
│   │   │
│   │   ├── ServiceCard.tsx
│   │   ├── BookingItem.tsx
│   │   └── ClientCard.tsx
│   │
│   ├── hooks/                        # Custom React hooks + TanStack Query hooks
│   │   ├── useBookings.ts
│   │   ├── useServices.ts
│   │   └── useUserRole.ts
│   │
│   ├── types/                        # TypeScript interfaces
│   │   └── index.ts
│   │
│   └── utils/                        # Helper functions
│       ├── constants.ts
│       ├── formatters.ts
│       └── validators.ts
│
├── android/                          # Android native project
│   ├── app/
│   │   └── google-services.json
│   ├── build.gradle
│   └── app/build.gradle
│
├── ios/                              # iOS native project
│   └── GoogleService-Info.plist
│
├── App.tsx                           # Application entry point (QueryClientProvider + navigation)
├── index.js                          # React Native registration
├── package.json                      # NPM dependencies
├── .env                              # Environment variables
├── .gitignore
└── tsconfig.json                     # TypeScript configuration
```

# Frontend UI Specification

## 1. Splash Screen
**Components**
- Company Logo (centered)
- Login / Get Started Button

## 2. Authentication

### Login Screen
**Components**
- Phone Number Input Field
- Generate OTP Button
- OTP Input Field
- Verify OTP Button
- Sign in with Google Button
- Sign in as Guest Button

**Validation**
- Phone number format validation
- OTP verification status
- Loading state during OTP generation/verification

### Guest Access
- Users can skip authentication via "Sign in as Guest" CTA on the Login Screen
- Guest mode sets `isGuest: true` in `useAuthStore`, bypassing the auth gate in `AppNavigator`
- Guest users can browse the app (Home, Services, Service Detail) but cannot book services
- Guests are prompted to log in when attempting booking or profile actions
- Logging in as a registered user clears guest state (`isGuest: false`)

## 3. Global Navigation

### Auth Gating
- The app does not force authentication. Unauthenticated and guest users can access the main app.
- `AppNavigator` gates auth screens vs main app using `isAuthenticated || isGuest`.
- Logged-in users have full access. Guest users have limited browsing access.

### Top Navigation Bar
- **Left Section:** Brand Logo
- **Right Section:** Cart Icon, Notifications Icon

### Bottom Navigation Bar
**Tabs**
- Home (For You)
- Services
- Bookings
- Profile

## 4. Home (For You)
**Sections**
- Featured Services
  - Service cards
  - Promotional banners
  - Popular services
- How It Works
  - Step-by-step service booking process
    1. Select Service
    2. Choose Date & Time
    3. Confirm Booking
    4. Service Completion
- Why Choose Us
  - Key benefits
  - Trust indicators
  - Customer satisfaction highlights
- Need Help?
  - Contact Support
  - FAQ
  - Customer Care Information

## 5. Services
- **Primary Services** — Display major service categories such as:
  - Home Cleaning
  - Plumbing
  - Electrical
  - Beauty & Wellness
  - Appliance Repair
  - Painting

### All Services
- Search Bar
- Category Filters
- Service Grid/List/Card

### Service Details Page
When a service is selected:
- **Display:** Service Name, Description, Pricing, Service Duration, Ratings & Reviews, Available Time Slots
- **Actions:** Add to Cart, Book Now

### Sub-Services
Example: Cleaning Service
- Basic Cleaning
- Deep Cleaning
- Kitchen Cleaning

Each sub-service should display:
- Price
- Estimated Duration
- Book Button

## 6. Bookings

### Active Bookings
- **Display:** Service Name, Booking ID, Date & Time, Status
- **Statuses:** Scheduled, In Progress, Completed, Cancelled

### Booking History
- Completed Services
- Cancelled Services
- Repeat Booking Option

### Quick Action
- Book a Service Button (Floating Action Button Recommended)

## 7. Profile

### User Information
- **Display:** Profile Picture, Full Name, Phone Number, Address
- **Actions:** Edit Profile, Manage Addresses

### Support
- **Options:** Help Centre, Raise Complaint, Contact Support, FAQs

### Past Services
- **Section:** Recent Service Cards, View All Button
- Each card should display: Service Name, Date, Amount Paid, Rating Option

### Account Settings
- **Options:** Personal Information, Notification Inbox, Saved Addresses, Privacy & Security, Terms & Conditions, Logout

## Cart
- Selected Services
- Price Summary
- Checkout

## Search
- Global Search Across Services

## Loading & Empty States
- Skeleton Loaders
- No Bookings Found
- No Services Available

## Error Handling
- Network Error Screens
- OTP Failure Messages
- Booking Failure Messages

## Theme
- **Primary Colors:** Royal Blue (#2563EB), Yellow (#FACC15)
- **Design Style:** Modern, Clean, Mobile-first, Card-based UI, Rounded corners, Soft shadows

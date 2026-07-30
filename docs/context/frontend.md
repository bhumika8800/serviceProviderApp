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
│   │   │   ├── HomeScreen.tsx        # ✅ Full — featured services, steps, benefits, help
│   │   │   ├── ServicesScreen.tsx    # ✅ Full — search, category filters, 2-col card grid, mock data
│   │   │   ├── ServiceDetailScreen.tsx # ⬜ Placeholder
│   │   │   ├── BookingScreen.tsx     # ⬜ Placeholder
│   │   │   ├── MyBookingsScreen.tsx  # ✅ Full — Active/History tabs, cancel, FAB, mock data
│   │   │   └── ProfileScreen.tsx     # ⬜ Placeholder
│   │   │
│   │   └── admin/                    # Company admin screens
│   │       ├── AdminDashboardScreen.tsx
│   │       ├── AdminBookingsScreen.tsx
│   │       ├── AdminClientsScreen.tsx
│   │       ├── AdminServicesScreen.tsx
│   │       └── ClientDetailScreen.tsx
│   │
│   ├── data/                         # Mock data (offline/dev mode)
│   │   ├── mockServices.ts           # 18 services across 6 categories with Unsplash images
│   │   └── mockBookings.ts           # 6 bookings across all statuses
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
│   │   ├── ServiceCard.tsx           # ✅ Updated — Image support, optional style prop
│   │   └── BookingItem.tsx           # ✅ Built — service icon, status badge, date, cancel
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
- **Screen:** `src/screens/user/ServicesScreen.tsx` — ✅ **Implemented** with mock data (`src/data/mockServices.ts`)
- **Primary Services** — 6 categories with 18 services total:
  - Home Cleaning (3 services: Basic, Deep, Kitchen Deep)
  - Plumbing (3 services: Tap Repair, Drain Cleaning, Water Heater)
  - Electrical (3 services: Switch/Socket, Fan, Wiring)
  - Beauty & Wellness (3 services: Facial, Haircut, Manicure)
  - Appliance Repair (3 services: AC, Washing Machine, Refrigerator)
  - Painting (3 services: Interior, Exterior, Texture/Wallpaper)

### All Services
- **Search Bar** — filters client-side by name, description, and tags with clear button
- **Category Filters** — horizontal scrollable pill chips, tap to filter by category, "All" to reset
- **Service Grid** — 2-column card layout using `ServiceCard` with `default` variant
- **Service Images** — each service shows a category-relevant Unsplash photo (e.g., cleaning tools for cleaning services)
- **Loading State** — skeleton cards matching the card layout
- **Empty State** — contextual message for "no results" vs "no services", with clear search action

### Service Details Page
When a service is selected (navigates to `ServiceDetail`):
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
- **Screen:** `src/screens/user/MyBookingsScreen.tsx` — ✅ **Implemented** with mock data (`src/data/mockBookings.ts`)
- **Component:** `src/components/BookingItem.tsx` — ✅ **Built** reusable card

### Layout
- **Header** — "My Bookings" title
- **Tab Switcher** — "Active" / "History" pill toggle with selected state styling
- **FlatList** — vertical list of `BookingItem` cards filtered by active tab

### Active Bookings
- **Display:** Service icon, Service Name, StatusBadge (color-coded), Booking ID, Date & Time, Amount
- **Statuses:** Pending (warning), Confirmed (primary), In Progress (warning), Completed (success), Cancelled (error)
- **Cancel Action** — confirmation alert → optimistically marks booking as cancelled (for pending/confirmed only)

### Booking History
- Completed and cancelled bookings listed chronologically
- Each card shows the same detail as active, without cancel option

### Empty States
- **Active tab:** "No active bookings" + "Book a service to get started" message
- **History tab:** "No booking history" + contextual message

### Quick Action
- **Floating Action Button** (+) — bottom-right, navigates to Services tab for quick booking

### States
- **Loading** — 3 skeleton cards with icon + text placeholders
- **Error** — cancel failure shown via Alert dialog

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
- **Skeleton Loaders** — card-shaped placeholders (used in Home, Services, Bookings)
- **No Services Available** — empty state on Services screen with search/filter guidance
- **No Bookings Found** — tab-aware empty states on My Bookings screen (active vs history)

## Error Handling
- Network Error Screens
- OTP Failure Messages
- Booking Failure Messages

## Theme
- **Primary Colors:** Royal Blue (#2563EB), Yellow (#FACC15)
- **Design Style:** Modern, Clean, Mobile-first, Card-based UI, Rounded corners, Soft shadows

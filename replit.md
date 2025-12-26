# PopSpot - Local Gig Marketplace

## Overview
PopSpot is a mobile-first marketplace app for local side-hustles and gigs. Think Uber meets Craigslist - users can discover, post, and connect with local service providers for everything from homemade food to dog walking to custom tattoos.

## Tech Stack
- **Frontend**: React Native with Expo (compatible with iOS, Android, and Web)
- **Backend**: Express.js with TypeScript
- **State Management**: React Context API for auth and gig data
- **Navigation**: React Navigation 7 with bottom tabs
- **UI Components**: Custom themed components with iOS 26-inspired design

## Project Structure
```
client/
├── App.tsx              # Main app entry with providers
├── context/
│   ├── AuthContext.tsx  # Demo authentication state
│   └── GigContext.tsx   # Gigs data and CRUD operations
├── screens/
│   ├── LoginScreen.tsx      # Demo login entry point
│   ├── FeedScreen.tsx       # Browse gigs list
│   ├── MapScreen.tsx        # Leaflet map with gig pins
│   ├── DashboardScreen.tsx  # Seller controls & online toggle
│   ├── PostGigScreen.tsx    # Create new gig form
│   └── GigDetailScreen.tsx  # Full gig details modal
├── navigation/
│   ├── RootStackNavigator.tsx  # Auth flow + modals
│   └── MainTabNavigator.tsx    # Feed, Map, Dashboard tabs
└── components/              # Reusable UI components

server/
├── index.ts          # Express server
└── routes.ts         # API routes

assets/images/gigs/   # Stock images for demo gigs
```

## Core Features
1. **Demo Login**: Instant authentication with a single button
2. **Feed Tab**: Scrollable list of gig cards with photos, prices, and seller info
3. **Map Tab**: Interactive Leaflet map showing gig locations in Brooklyn, NY
4. **Dashboard Tab**: Seller mode with "Go Online" toggle and active gigs list
5. **Post Gig**: Form to create new gigs with image picker and category selection
6. **Gig Details**: Full-screen modal with contact seller CTA

## Design System
- **Primary Color**: Coral (#FF5A5F) - CTAs and accents
- **Secondary Color**: Teal (#008489) - Links and highlights
- **Online Status**: Green (#00A699)
- **Typography**: System fonts with clear hierarchy
- **Border Radius**: Rounded corners (8-16px)

## Running the App
- The Expo app runs on port 8081
- Express backend runs on port 5000
- Scan QR code with Expo Go to test on mobile devices
- Web version available at localhost:8081

## Recent Changes
- Initial MVP build with all core features
- Demo authentication flow
- Gig posting with local state
- Map integration with Leaflet WebView
- Proper permission handling for image picker

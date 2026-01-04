# PopSpot - Local Gig Marketplace

## Overview
PopSpot is a mobile-first marketplace app for local side-hustles and gigs. Think Uber meets Craigslist - users can discover, post, and connect with local service providers for everything from homemade food to dog walking to custom tattoos.

## Tech Stack
- **Frontend**: React Native with Expo (compatible with iOS, Android, and Web)
- **Backend**: Express.js with TypeScript
- **State Management**: React Context API for auth and gig data
- **Navigation**: React Navigation 7 with bottom tabs
- **UI Components**: Custom themed components with iOS 26-inspired design
- **AI Integration**: OpenAI via Replit AI Integrations

## Project Structure
```
client/
├── App.tsx              # Main app entry with providers
├── context/
│   ├── AuthContext.tsx  # Authentication with demo mode & auth placeholders
│   └── GigContext.tsx   # Gigs data and CRUD operations
├── screens/
│   ├── WelcomeScreen.tsx     # Auth options: Google, Apple, Phone, Email, Demo
│   ├── VoiceAssistantScreen.tsx  # AI Assistant with moonlit ocean UI
│   ├── FeedScreen.tsx        # Browse gigs list (15+ items)
│   ├── MapScreen.tsx         # Leaflet map with gig pins
│   ├── DashboardScreen.tsx   # Seller controls & online toggle
│   ├── PostGigScreen.tsx     # Create new gig form (modal)
│   ├── NotesScreen.tsx       # Community notes (12+ posts)
│   └── GigDetailScreen.tsx   # Full gig details modal
├── navigation/
│   ├── RootStackNavigator.tsx  # Auth flow + modals
│   └── MainTabNavigator.tsx    # Feed, Map, AI, Notes, Dashboard tabs
└── components/              # Reusable UI components

server/
├── index.ts          # Express server
├── routes.ts         # API routes
└── voice-assistant.ts # OpenAI integration for AI chat

assets/images/
├── gigs/             # Stock images for demo gigs
└── ai-background.png # Moonlit ocean/galaxy background
```

## Core Features
1. **Welcome Screen**: Authentication options with Google, Apple, Phone (SMS), Email/Password, and Demo Mode
2. **AI Voice Assistant**: Minimal UI with moonlit ocean background, glassmorphism response cards, glowing microphone (Web Speech API on web)
3. **Feed Tab**: Scrollable list of 15+ gig cards with photos, prices, and seller info
4. **Map Tab**: Interactive Leaflet map showing gig locations in Brooklyn, NY
5. **Notes Tab**: Community notes with 12+ posts
6. **Dashboard Tab**: Seller mode with "Go Online" toggle and active gigs list
7. **Post Gig**: Modal form to create new gigs with image picker and category selection
8. **Gig Details**: Full-screen modal with contact seller CTA

## Design System
- **Primary Color**: Coral (#FF5A5F) - CTAs and accents
- **Secondary Color**: Teal (#008489) - Links and highlights
- **Online Status**: Green (#00A699)
- **Typography**: System fonts with clear hierarchy
- **Border Radius**: Rounded corners (8-16px)

## Authentication
The app supports multiple auth methods (ready for Supabase integration):
- Google Sign In
- Apple Sign In (iOS only)
- Phone Number with SMS verification
- Email/Password
- Demo Mode (instant access for testing)

To enable full authentication, add Supabase credentials:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Permissions
Configured in app.json:
- **iOS**: NSMicrophoneUsageDescription for voice assistant
- **Android**: RECORD_AUDIO permission

## Running the App
- The Expo app runs on port 8081
- Express backend runs on port 5000
- Scan QR code with Expo Go to test on mobile devices
- Web version available at localhost:8081

## Recent Changes (Jan 4, 2026)
- Added AI Voice Assistant with OpenAI integration
- Redesigned AI Assistant screen with moonlit ocean/galaxy background
- Implemented glassmorphism UI with glowing microphone button
- Created Welcome screen with all auth options in vertical list
- Added microphone permissions for iOS and Android
- Replaced center '+' tab button with microphone icon for AI Assistant
- Expanded Feed to 15 gigs and Notes to 12 posts
- Form fields reset on navigation using useFocusEffect

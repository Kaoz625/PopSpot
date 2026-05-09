# Replit Agent Task: PopSpot

## Goal
Build PopSpot from its current pre-backend Expo prototype into a working NYC event discovery MVP — pivoting from any Firebase plans to Supabase, adding a map view of events, and implementing user auth — focused entirely on NYC.

## Tasks
1. **Supabase setup**: create `supabase/schema.sql` with tables: `events` (id, title, description, date, time, venue_name, address, borough, lat, lng, category, image_url, rsvp_url, created_at), `profiles` (id, username, avatar_url, borough), `saved_events` (user_id, event_id); add Row Level Security policies; seed with 10 realistic NYC events across 5 boroughs
2. **Auth**: implement Supabase Auth with email/password sign-up and sign-in; create an AuthContext provider in `src/context/AuthContext.tsx`; protect the Saved Events screen behind auth; show login prompt for unauthenticated users trying to save an event
3. **Map screen** (primary tab): integrate `react-native-maps` (Expo compatible — use `expo install react-native-maps`); center map on NYC (40.7128, -74.0060); render each event as a custom map marker with a color-coded pin by category (Music=red, Food=orange, Art=purple, Sports=green, Community=blue); tapping a marker opens a bottom sheet with event name, date, venue, and "View Details" / "Save" buttons
4. **Events list screen**: FlatList of upcoming events sorted by date; filter bar at top with category chips (All, Music, Food, Art, Sports, Community) and borough selector (All, Manhattan, Brooklyn, Queens, Bronx, Staten Island); each card shows event image, title, date/time, venue name, and distance from current location (use `expo-location` — already in package.json)
5. **Event detail screen**: full-screen view with hero image, title, date/time, venue with address, category badge, description, RSVP button (opens rsvp_url in browser), and a Save/Unsave toggle (writes to `saved_events` table if authenticated)
6. **Saved Events screen**: FlatList of events the user has saved; requires auth (redirect to login if not signed in); pull from `saved_events` joined with `events`
7. **Search**: add a search bar on the Events list screen that filters by event title or venue name using Supabase `ilike` query
8. **Bottom tab navigator**: 4 tabs — Map (MapPin icon), Events (Calendar icon), Saved (Bookmark icon), Profile (User icon); use React Navigation bottom tabs
9. **Supabase client**: create `src/lib/supabase.ts` reading `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from environment (use `app.config.js` or `.env` with `expo-constants`); never hardcode keys
10. **Remove any Firebase references**: search for firebase, firestore, firebase-admin in package.json and all source files; remove them; update README to document Supabase setup

## Tech Stack
- React Native + Expo (~54.0.33, existing)
- TypeScript (existing)
- Supabase (@supabase/supabase-js) for auth + database
- react-native-maps for map view
- expo-location for user location
- React Navigation bottom tabs (existing)

## Deploy Target
Expo Go for development; EAS Build (eas.json present) for production APK/IPA. Backend: Supabase cloud (free tier). Never Vercel or Firebase.

## Done When
- [ ] `supabase/schema.sql` exists with all 3 tables + RLS policies + 10 seed events
- [ ] Auth works: user can sign up, sign in, and sign out
- [ ] Map screen shows NYC map with colored event markers; tapping opens bottom sheet
- [ ] Events list has category and borough filters that query Supabase correctly
- [ ] Event detail screen renders all fields and RSVP button opens URL
- [ ] Saved Events requires auth and shows user's saved events from Supabase
- [ ] Search filters events by title/venue via Supabase ilike
- [ ] No Firebase dependencies remain in package.json or source files
- [ ] `src/lib/supabase.ts` reads keys from environment variables

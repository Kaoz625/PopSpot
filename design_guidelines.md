# PopSpot Design Guidelines

## Authentication Architecture
- **Demo Auth Only**: No real backend authentication
- Login screen with single "Demo Login" button that instantly authenticates user
- No SSO, email/password, or signup flow needed
- After demo login, user gains access to both buyer and seller features
- Include a minimal profile/settings screen with:
  - User avatar (generate 2 preset avatars: one casual buyer, one service provider)
  - Display name field (pre-filled with "Demo User")
  - "Logout" button (returns to demo login screen)

## Navigation Architecture
**Root Navigation**: Tab Bar (4 tabs)
1. **Feed Tab**: Browse available gigs
2. **Map Tab**: Geographic view of gigs
3. **Post Tab** (Floating Action Button): Create new gig posting
4. **Dashboard Tab**: Seller controls and profile

## Screen Specifications

### 1. Demo Login Screen
- **Purpose**: Gateway to app (non-authenticated state)
- **Layout**:
  - Full-screen with centered content
  - App logo/wordmark at top third
  - Single "Demo Login" button (primary CTA)
  - Safe area insets: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Components**: Logo asset, primary button
- **No navigation header**

### 2. Feed Tab
- **Purpose**: Discover and browse local gigs
- **Layout**:
  - Transparent navigation header with "PopSpot" title
  - Search bar in header (search by gig type/keywords)
  - Scrollable vertical list of gig cards
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Gig card (photo, title, price, location distance, seller avatar)
  - Each card is tappable → opens gig detail screen (modal)
  - Pull-to-refresh gesture
- **Card Layout**: Full-width cards with 4:3 aspect ratio photo, title below, price badge overlay

### 3. Map Tab
- **Purpose**: Geographic discovery of nearby gigs
- **Layout**:
  - Transparent header with location indicator (defaults to "Brooklyn, NY")
  - Full-screen map (Leaflet/WebView) with custom pins
  - Safe area insets: top: headerHeight + Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Map view with custom pin markers
  - Tappable pins → show mini card preview at bottom
  - Mini card tappable → opens full gig detail (modal)

### 4. Post Tab (Modal Form)
- **Purpose**: Create and publish new gig listing
- **Layout**:
  - Standard modal navigation header with "Cancel" (left) and "Post" (right)
  - Scrollable form content
  - Safe area insets: top: Spacing.xl, bottom: insets.bottom + Spacing.xl
- **Form Fields** (vertical stack):
  - Photo upload (tap to select image placeholder)
  - Gig title (text input)
  - Description (multi-line text area)
  - Price (number input with $ prefix)
  - Category picker (dropdown)
  - Location (defaults to Brooklyn, NY)
- **Behavior**: "Post" button adds gig to feed using local state

### 5. Dashboard Tab
- **Purpose**: Seller controls and account management
- **Layout**:
  - Standard header with "Dashboard" title
  - Scrollable content
  - Safe area insets: top: Spacing.xl, bottom: tabBarHeight + Spacing.xl
- **Components**:
  - Large "Go Online" toggle switch (hero element, centered)
  - Status indicator text ("You're Online" / "You're Offline")
  - "My Active Gigs" section (list of user's posted gigs)
  - Settings button in header → opens settings screen

### 6. Gig Detail Screen (Modal)
- **Purpose**: View full gig information and contact seller
- **Layout**:
  - Modal presentation with custom close button (X, top-right)
  - Scrollable content
  - Hero image at top (full-width)
  - Fixed bottom bar with "Contact Seller" CTA button
- **Components**: Image, title, price, description, seller info, floating CTA

## Design System

### Color Palette
- **Primary**: Vibrant coral/orange (#FF5A5F) — CTA buttons, active states
- **Secondary**: Deep teal (#008489) — accents, seller mode indicators
- **Neutrals**:
  - Background: Off-white (#F7F7F7)
  - Card background: White (#FFFFFF)
  - Text primary: Charcoal (#222222)
  - Text secondary: Gray (#717171)
- **Status Colors**:
  - Online: Green (#00A699)
  - Offline: Gray (#767676)

### Typography
- **Headings**: System Bold, 24-28pt
- **Subheadings**: System Semibold, 18pt
- **Body**: System Regular, 16pt
- **Captions**: System Regular, 14pt, secondary color

### Spacing Scale
- xs: 4px, sm: 8px, md: 12px, lg: 16px, xl: 24px, xxl: 32px

### Interactive Feedback
- All buttons: Scale down to 0.96 on press
- Cards: Subtle opacity reduction (0.8) on press
- Toggle switch: Smooth spring animation on state change
- Floating Post button: Drop shadow (offset: {width: 0, height: 2}, opacity: 0.10, radius: 2)

### Critical Assets
Generate these assets:
1. **PopSpot wordmark logo** (horizontal, modern sans-serif)
2. **Demo gig photos** (3 samples):
   - Fresh lasagna (food photography style)
   - Dog walking (outdoor, friendly dog)
   - Tattoo session (artistic workspace)
3. **Map pin icon** (custom marker, coral color, location pin shape)
4. **User avatars** (2 presets):
   - Casual buyer avatar (friendly, approachable)
   - Service provider avatar (professional, trustworthy)

### Layout Patterns
- **Gig Cards**: 16:9 image, rounded corners (12px), white background, subtle border (1px, #E0E0E0)
- **Forms**: Full-width inputs with 44pt touch targets, rounded (8px)
- **Floating Post Button**: 56x56pt circle, coral background, white "+" icon, positioned bottom-right with 16pt margin
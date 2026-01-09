# iOS Development Setup Guide

## Overview

This guide walks you through setting up your PopSpot iOS app with your Apple Developer account for development, testing, and App Store distribution.

## Prerequisites

- ✅ Xcode 15+ installed
- ✅ Apple Developer account (paid)
- ✅ CocoaPods installed
- ✅ PopSpot project downloaded locally

---

## Step 1: Install CocoaPods Dependencies

Navigate to your iOS project and install dependencies:

```bash
cd /Users/markanthony/Downloads/PopSpot/ios
pod install
```

If you don't have CocoaPods:

```bash
sudo gem install cocoapods
cd ios
pod install
```

**⚠️ Important:** Always open `.xcworkspace` after running `pod install`, not `.xcodeproj`.

---

## Step 2: Run pod install (Creates .xcworkspace)

First, install CocoaPods dependencies. This creates the `.xcworkspace` file:

```bash
cd /Users/markanthony/Downloads/PopSpot/ios
pod install
```

**⚠️ Note:** The `.xcworkspace` file is created by `pod install`. If you don't see it, run the command above.

## Step 3: Open Xcode Project

**Always use the workspace file:**

```bash
open /Users/markanthony/Downloads/PopSpot/ios/PopSpot.xcworkspace
```

Do NOT open `PopSpot.xcodeproj`.

---

## Step 3: Configure Apple Developer Team Signing

### In Xcode:

1. **Select your project** in the left navigator (top item)
2. **Select "PopSpot" target** (not the project)
3. Click **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"** ✅
5. Under **"Team"**, select your **Apple Developer account** (it will show your email/organization name)

Xcode will automatically:

- Create provisioning profile
- Register your Bundle ID (`com.popspot.app`)
- Configure code signing

---

## Step 4: Verify Bundle Identifier

Ensure your bundle identifier matches:

**In Xcode (Signing & Capabilities):**

- **Bundle Identifier:** `com.popspot.app`

**In app.json (for Expo builds):**

```json
"ios": {
  "bundleIdentifier": "com.popspot.app"
}
```

These should match exactly.

---

## Step 5: Build and Run on Simulator

1. Select a simulator in Xcode toolbar (iPhone 15 Pro, iOS 17+)
2. Press **⌘R** or click the Play button
3. Wait for build to complete
4. App should launch in simulator

---

## Step 6: Build and Run on Physical Device

### Enable Developer Mode on Your iPhone

1. Open Settings > Privacy & Security
2. Scroll down to **"Developer Mode"**
3. Enable it (requires restart)
4. Enter your device passcode

### Connect Your iPhone

1. Connect iPhone to Mac via USB
2. Trust the computer on your iPhone (popup will appear)
3. In Xcode, select your iPhone from the device menu

### Build and Install

1. Press **⌘R** or Play button
2. First build will take longer (signing the app)
3. App will install on your iPhone
4. You may need to trust your developer certificate:
   - Settings > General > VPN & Device Management
   - Tap your Apple Developer email
   - Tap "Trust"

---

## Step 7: Optional: Add Capabilities

If you need additional features, add them in **Signing & Capabilities**:

**Common capabilities:**

- **Push Notifications** - For notifications
- **Background Modes** - For location/audio in background
- **In-App Purchase** - For paid features
- **Maps** - For map features

Add them by clicking **"+ Capability"** button.

---

## Step 8: Export for App Store (When Ready)

### Option A: Use EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production
```

### Option B: Archive in Xcode

1. Select **"Any iOS Device (arm64)"** from device menu
2. Go to **Product > Archive**
3. Wait for archive to complete
4. Archive organizer will open
5. Click **"Distribute App"**
6. Choose distribution method:
   - **App Store** - For public release
   - **TestFlight** - For beta testing
   - **Ad Hoc** - For internal testing

---

## Troubleshooting

### Issue: "Signing for PopSpot requires a development team"

**Solution:**

1. Open Signing & Capabilities
2. Select your Apple Developer team
3. Xcode will auto-configure

### Issue: "The sandbox is not in sync with Podfile.lock"

**Solution:**

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
```

### Issue: "Failed to register bundle identifier"

**Solution:**

1. Go to https://developer.apple.com/account
2. Navigate to Identifiers > App IDs
3. Manually register `com.popspot.app`
4. Go back to Xcode and try again

### Issue: Build fails with code signing errors

**Solution:**

1. In Xcode Preferences > Accounts, sign out and sign back in
2. Clean build folder: Product > Clean Build Folder (⇧⌘K)
3. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
4. Try building again

### Issue: App won't install on physical device

**Solution:**

1. Enable Developer Mode on iPhone (Step 6)
2. Trust the computer on iPhone
3. Trust your developer certificate in Settings > VPN & Device Management
4. Try unplugging and reconnecting iPhone

---

## Bundle Identifier Notes

Your bundle identifier (`com.popspot.app`) should be registered in Apple Developer portal:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Verify `com.popspot.app` exists
3. If not, create it manually:
   - Click "Identifiers" > "App IDs" > "+"
   - Enter `com.popspot.app`
   - Enable required capabilities
   - Save

---

## TestFlight Setup (Beta Testing)

Once you have a build ready:

1. Archive in Xcode (or use EAS Build)
2. Upload to App Store Connect
3. Go to https://appstoreconnect.apple.com
4. Navigate to **TestFlight > My Apps > PopSpot**
5. Add testers (internal or external)
6. Create a test group
7. Add testers to group
8. Send TestFlight link to testers

---

## App Store Release Checklist

Before releasing to App Store:

- [ ] All features tested on physical devices
- [ ] App Store screenshots prepared (various iPhone sizes)
- [ ] App description written
- [ ] Keywords and category selected
- [ ] Age rating calculated
- [ ] Privacy policy URL ready
- [ ] Support email configured
- [ ] App icon and splash screen tested
- [ ] Deep linking configured (if needed)
- [ ] Push notifications tested (if enabled)
- [ ] Tested on latest iOS version
- [ ] Performance optimized (no crashes)

---

## Additional Resources

- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Expo iOS Deployment](https://docs.expo.dev/workflow/ios-setup/)
- [App Store Connect Guide](https://help.apple.com/app-store-connect/)

---

## Quick Reference

**Common Commands:**

```bash
# Install CocoaPods dependencies
cd ios && pod install

# Open Xcode workspace
open ios/PopSpot.xcworkspace

# Clean Xcode build
⇧⌘K

# Run build
⌘R

# Archive for distribution
Product > Archive

# Build with EAS (alternative)
eas build --platform ios
```

---

## Need Help?

If you encounter issues:

1. Check Xcode console for error messages
2. Verify your Apple Developer account is active
3. Ensure Bundle ID matches in both Xcode and app.json
4. Check that Xcode version is 15+
5. Try cleaning and rebuilding

---

**Good luck with your iOS development!** 🚀

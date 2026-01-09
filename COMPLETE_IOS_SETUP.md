# Complete iOS Setup Guide - Step by Step

## Prerequisites

- ✅ Xcode 15+ installed
- ✅ Apple Developer account (paid)
- ✅ Node.js installed
- ✅ CocoaPods installed

---

## Step 1: Download Latest Code

1. Go to: https://github.com/Kaoz625/PopSpot
2. Click **"Code"** → **"Download ZIP"**
3. Extract to: `/Users/markanthony/Downloads/`
4. **Note:** Downloaded folder might be named `PopSpot-main` instead of `PopSpot`

---

## Step 2: Install Node.js Dependencies (REQUIRED!)

**This step is REQUIRED before running pod install!**

```bash
# Navigate to project root
cd /Users/markanthony/Downloads/PopSpot-main

# Install all npm packages
npm install
```

**What this does:**

- Downloads all Node.js packages from npm
- Creates `node_modules/` folder
- Installs expo, react-native, and all dependencies
- Takes 2-5 minutes on first run

**Verify it completed:**

```bash
ls node_modules/expo/package.json
```

You should see the package.json file exists.

**If this fails:**

- Check you have Node.js installed: `node --version`
- Check you have npm installed: `npm --version`
- Clear npm cache: `npm cache clean --force`

---

## Step 3: Install CocoaPods Dependencies

**Now that npm install is complete, you can run pod install:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main/ios
pod install
```

**What this does:**

- Downloads CocoaPods dependencies
- Creates `Pods/` folder
- Creates `PopSpot.xcworkspace` file (THIS IS KEY!)
- Configures Xcode project with dependencies

**What you'll see:**

```
Analyzing dependencies
Downloading dependencies
Installing Pods
Generating Pods project
Pod installation complete!
```

**Verify it completed:**

```bash
ls PopSpot.xcworkspace
```

This file should now exist!

---

## Step 4: Open Xcode

**IMPORTANT: Always open .xcworkspace, never .xcodeproj!**

```bash
cd /Users/markanthony/Downloads/PopSpot-main
open ios/PopSpot.xcworkspace
```

**Why .xcworkspace?**

- CocoaPods creates the workspace file
- It links your project with all dependencies
- Using .xcodeproj will cause build errors

---

## Step 5: Configure Apple Developer Team

### In Xcode:

1. **Select your project** in left navigator (top item: PopSpot)
2. **Select "PopSpot" target** (second item)
3. Click **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"** ✅
5. Under **"Team"**, select your **Apple Developer account**
6. Wait for Xcode to:
   - Register bundle identifier (`com.popspot.app`)
   - Create provisioning profile
   - Configure code signing

### Bundle Identifier

Should be: `com.popspot.app`

If different, update to match.

---

## Step 6: Build and Run

### On Simulator:

1. Select simulator in Xcode toolbar (iPhone 15 Pro, iOS 17+)
2. Press **⌘R** or click Play button
3. Wait for build to complete
4. App will launch in simulator

### On Physical Device:

#### A. Enable Developer Mode on iPhone

1. Open **Settings** > **Privacy & Security**
2. Scroll to **"Developer Mode"**
3. Toggle it **ON**
4. Confirm (requires restart)
5. Enter your device passcode

#### B. Connect iPhone

1. Connect iPhone to Mac via USB cable
2. **Trust this computer** popup on iPhone - tap **"Trust"**
3. In Xcode, select your iPhone from device menu (top toolbar)

#### C. Build and Install

1. Press **⌘R** or Play button
2. First build takes longer (signing app)
3. App installs on iPhone
4. **Trust your developer certificate:**
   - Go to **Settings** > **General** > **VPN & Device Management**
   - Find your Apple Developer email
   - Tap it
   - Tap **"Trust"**

---

## Troubleshooting

### Error: "Cannot find module 'expo/package.json'"

**Cause:** You ran `pod install` before `npm install`

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main
npm install
cd ios
pod install
```

---

### Error: "No `Podfile' found in the project directory"

**Cause:** You're in wrong directory

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main/ios
pwd  # Should show .../PopSpot-main/ios
ls  # Should show Podfile
pod install
```

---

### Error: "The sandbox is not in sync with Podfile.lock"

**Cause:** CocoaPods cache out of sync

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main/ios
rm -rf Pods Podfile.lock
pod install
```

---

### Error: "Signing for PopSpot requires a development team"

**Cause:** No team selected in Xcode

**Solution:**

1. Open Signing & Capabilities tab
2. Select your Apple Developer team
3. Xcode will auto-configure

---

### Error: Build fails with "Command PhaseScriptExecution failed"

**Cause:** CocoaPods not properly linked

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main/ios
pod install
```

Then clean Xcode build:

- Press **⇧⌘K** (Product > Clean Build Folder)
- Build again

---

### Error: "No .xcworkspace file"

**Cause:** pod install didn't complete or didn't run

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main/ios
pod install
```

Then verify:

```bash
ls PopSpot.xcworkspace
```

---

### Error: "Module not found: Can't resolve 'react-native'"

**Cause:** node_modules not installed or corrupted

**Solution:**

```bash
cd /Users/markanthony/Downloads/PopSpot-main
rm -rf node_modules package-lock.json
npm install
```

---

## Quick Reference Commands

```bash
# Complete setup (run in order!)
cd /Users/markanthony/Downloads/PopSpot-main

# 1. Install npm dependencies
npm install

# 2. Install CocoaPods
cd ios && pod install && cd ..

# 3. Open Xcode workspace
open ios/PopSpot.xcworkspace

# 4. Clean Xcode build (if needed)
# In Xcode: Product > Clean Build Folder (⇧⌘K)

# 5. Build and run
# In Xcode: Press ⌘R
```

---

## Folder Name Note

**Downloaded folder might be named:**

- `PopSpot-main` (GitHub default ZIP name)
- `PopSpot` (if you renamed it)

Both are fine! Just use whatever you extracted.

---

## Summary

**Critical Order:**

1. ✅ Download ZIP
2. ✅ Extract to Downloads
3. ✅ **npm install** (MUST BE FIRST!)
4. ✅ **pod install** (after npm install)
5. ✅ Open .xcworkspace (not .xcodeproj)
6. ✅ Select Apple Developer team
7. ✅ Build and run

**Never skip npm install! The Podfile requires Node.js packages to be installed first.**

---

## Support

If you still have issues:

1. Check Node.js version: `node --version` (should be 18+)
2. Check npm version: `npm --version`
3. Check CocoaPods version: `pod --version`
4. Clear all caches and start over

---

**Follow these steps in order and you'll be building in Xcode!** 🚀

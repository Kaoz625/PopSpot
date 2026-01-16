# Firebase Setup Guide for PopSpot

## What's been set up:

### 1. **Firebase Project**: `popspot-352ab` (PopSpot)
   - Already created and linked
   - Firebase Console: https://console.firebase.google.com/project/popspot-352ab

### 2. **Firebase Data Connect**
   - Postgres database provisioned
   - Schema and queries generated
   - No-cost trial available (requires Blaze billing plan)

### 3. **Cloud Functions**
   - Backend API wrapper created (`functions/index.js`)
   - Ready to deploy with: `firebase deploy --only functions`

### 4. **Firebase App Distribution** (for sharing builds)
   - Set up to distribute APK/IPA files to testers

---

## Next Steps:

### Step 1: Build your apps locally or with EAS

**For iOS:**
```bash
eas build --platform ios --profile preview
```

**For Android:**
Wait until Feb 1 for free builds to reset, or upgrade EAS plan.

### Step 2: Upload builds to Firebase App Distribution

```bash
# Upload iOS build
firebase app:distribute ios/PopSpot.ipa \
  --app com.popspot.app \
  --testers-file testers.txt \
  --release-notes "Version 1.0.0 - Initial release"

# Upload Android build
firebase app:distribute android/app/build/outputs/apk/release/app-release.apk \
  --app com.popspot.app \
  --testers-file testers.txt \
  --release-notes "Version 1.0.0 - Initial release"
```

### Step 3: Add testers

Create `testers.txt`:
```
friend1@gmail.com
friend2@gmail.com
family1@gmail.com
```

### Step 4: Deploy Cloud Functions

```bash
firebase deploy --only functions
```

Your API will be available at:
```
https://us-central1-popspot-352ab.cloudfunctions.net/api
```

---

## Important: Database Connection

Your Express backend in Cloud Functions needs to connect to PostgreSQL. Options:

### Option A: Use Firebase Data Connect (Recommended)
- Already provisioned Postgres instance
- Upgrade to Blaze plan and deploy
- Run: `firebase deploy --only dataconnect`

### Option B: Use Cloud SQL
- More control, managed Postgres
- Requires Blaze plan
- Update `functions/index.js` with connection string

### Option C: Keep external PostgreSQL
- Current setup with DATABASE_URL
- Add env variables in Firebase Console

---

## Commands Reference

```bash
# Local testing
firebase emulators:start --only functions

# Deploy everything
firebase deploy

# Deploy only functions
firebase deploy --only functions

# View logs
firebase functions:log

# List testers
firebase app:list-testers --app com.popspot.app
```

---

## Billing

- **Firebase Data Connect**: Free trial, then pay-as-you-go
- **Cloud Functions**: Free tier: 2 million requests/month
- **App Distribution**: Free with Firebase project

To upgrade to Blaze plan:
https://console.firebase.google.com/project/popspot-352ab/usage/details

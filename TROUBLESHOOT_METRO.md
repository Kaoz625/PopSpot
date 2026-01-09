# Metro Start Script

## What This Script Does

This script ensures Metro bundler (React Native's JavaScript bundler) is running BEFORE you build your app in Xcode.

## Why This Is Needed

When you build in Xcode without Metro running:

- App tries to load JavaScript bundle
- Bundle URL is null (`unsanitizedScriptURLString = (null)`)
- **App is stuck on splash screen** - can't progress past loading

This is exactly the error you're seeing!

## How to Use

### Before Building in Xcode:

1. **Open a new Terminal** (don't close the one where you might be building)
2. **Navigate to project:**
   ```bash
   cd /Users/markanthony/Downloads/PopSpot-main
   ```
3. **Start Metro:**
   ```bash
   npx expo start --clear
   ```
4. **Wait for Metro to start** (you should see "Ready on..." or "Metro waiting on...")
5. **Build and run in Xcode** (press ⌘R)

**Keep this terminal OPEN** while you build in Xcode!

## How to Verify Metro is Running

Open another terminal and check:

```bash
# Check if Metro is running
lsof -i :8081

# Or try to get status
curl http://localhost:8081/status
```

**Signs Metro is running:**

- Terminal shows "Metro starting"
- You see "Ready on..."
- No `unsanitizedScriptURLString` error in Xcode console

## Common Issues & Solutions

### Issue: "Metro already running in use" or process conflicts

**Error:** `error: input port 8081 is already in use`

**Solution:**

```bash
# Kill all existing Metro processes
pkill -f "npx expo"
pkill -f "node.*metro"
pkill -9 node

# Or kill all node processes
killall -9 node

# Wait a moment
sleep 2

# Then start fresh
npx expo start --clear
```

### Issue: Metro still not starting

**Solution:** Clear Metro cache:

```bash
cd /Users/markanthony/Downloads/PopSpot-main

# Clear Expo cache
rm -rf node_modules/.cache
rm -rf .expo

# Start fresh
npx expo start --clear
```

### Issue: Build in Xcode without running Metro

**Solution:** ALWAYS run this script before Xcode:

```bash
# Terminal 1 (keep open for Metro)
npx expo start --clear &

# Terminal 2 (build in Xcode)
# Press ⌘R to build
```

---

## Alternative: Use Pre-Built Bundle (Recommended for Production)

If you prefer not to run Metro, create a pre-built bundle:

```bash
cd /Users/markanthony/Downloads/PopSpot-main

# Create pre-built bundle for iOS
npx expo export:ios

# Then build in Xcode
# App will load from pre-built bundle (no Metro needed)
```

**Advantage:**

- No Metro needed
- Faster builds
- More reliable for production

**Disadvantage:**

- Must run `npx expo export:ios` after every code change
- More complex workflow

---

## Quick Reference

| Situation             | Solution                                                                       |
| --------------------- | ------------------------------------------------------------------------------ |
| Before Xcode build    | Run `npx expo start --clear` in terminal, wait for "Metro ready"               |
| Metro already running | Kill all processes: `pkill -f npx expo`, then `npx expo start --clear`         |
| Metro won't start     | Clear cache: `rm -rf node_modules/.cache .expo`, then `npx expo start --clear` |
| Production build      | Use `npx expo export:ios` (no Metro needed for builds)                         |

---

## Troubleshooting Steps

1. **Check Metro status:**

   ```bash
   curl http://localhost:8081/status
   ```

   Should return JSON with running status

2. **View Xcode console:**
   - Open Debug Area (⌘⌘D)
   - Look for actual RED errors (not yellow warnings)
   - Search for: "Fatal error", "JavaScript error"

3. **Check bundle file:**

   ```bash
   cd /Users/markanthony/Downloads/PopSpot-main/ios
   ls -la Expo.bundlejs
   ```

4. **Verify app entry point:**
   - Make sure `App.tsx` or `index.js` is correct
   - Check `app.json` for proper configuration

---

## Need Help?

If issues persist after following these steps:

1. Run `npx expo start --clear` and share the output
2. Try clearing caches: `rm -rf node_modules/.cache .expo`
3. Check Xcode scheme is correct (should be "PopSpot")
4. Verify iOS deployment target is set correctly
5. Try with a clean Xcode build: Product > Clean Build Folder (⇧⌘K)

---

## Important Reminder

**ALWAYS run `npx expo start --clear` before building in Xcode!**

This is required for React Native apps, or the JavaScript bundle won't be available and you'll get the splash screen error.

---

## Why Compiler Warnings Won't Cause Issues

The compiler warnings you're seeing:

- "keyWindow is deprecated" - Normal React Native compatibility
- "missing nullability" - Expected in React Native code
- "implicit conversion" - Minor type issues
- Deprecated iOS APIs - Normal backward compatibility

**These are NORMAL and EXPECTED in React Native development.** They will not prevent your app from:

- ✅ Building
- ✅ Running
- ✅ Loading
- ✅ Showing screens
- ✅ Working normally

**Ignore them and focus on actual issues if they occur.**

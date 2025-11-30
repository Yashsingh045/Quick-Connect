# URGENT FIX: Native Module Not Found

## The Error
`[Invariant Violation: View config not found for component 'RCTZegoView']`

This means the Zego native modules are not linked. You MUST rebuild the native app.

## Quick Fix (Choose your platform)

### For Android:
```bash
cd mobile
# Stop the current Metro bundler (Ctrl+C)
npx expo run:android
```

### For iOS:
```bash
cd mobile
# Stop the current Metro bundler (Ctrl+C)
npx expo run:ios
```

## What This Does
- Rebuilds the native Android/iOS app with all native modules properly linked
- This is REQUIRED for Zego SDK to work (it uses native code)

## After Rebuild
1. The app will automatically start
2. Log in again
3. Try joining a meeting - it should work now!

## If Rebuild Fails
1. Clean build folders:
   - Android: `cd android && ./gradlew clean && cd ..`
   - iOS: `cd ios && pod deintegrate && pod install && cd ..`
2. Then rebuild again

## IMPORTANT
- You CANNOT use `expo start` alone - you MUST use `expo run:android` or `expo run:ios`
- The native modules require a full rebuild, not just a Metro restart


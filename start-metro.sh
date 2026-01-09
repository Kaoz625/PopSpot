#!/bin/bash

# Start Metro bundler before Xcode build
# Run this script before building in Xcode to ensure Metro is running

cd "$(dirname "$0")"
npx expo start --clear &

METRO_PID=$!
echo "Metro starting (PID: $METRO_PID)"

# Keep this terminal open while building in Xcode
# StayMate

Lifestyle-first roommate matching for students and working professionals. The repository contains an Expo Router mobile app and an Express/MongoDB API.

## Local setup

1. Install Node 22+, then run `npm install` at the repository root.
2. Copy `mobile/.env.example` to `mobile/.env` and `server/.env.example` to `server/.env`.
3. Start the API with `npm run dev:server`.
4. Start Expo with `npm run dev:mobile`, then scan the QR code in Expo Go.

Without a configured API the mobile app opens in demo mode with seeded profiles. Firebase clients are used for email/Google authentication; the API verifies Firebase ID tokens and returns a short-lived app JWT. Cloudinary signed uploads and MongoDB Atlas are activated by environment variables.

Release and physical-device checks are documented in `docs/RELEASE_CHECKLIST.md`. Cloud services are never supplied with fake credentials: copy the environment examples and use values from your own Firebase, Atlas, Cloudinary, Expo and Render projects.

## Deployment

- Render: set the root directory to `server`, build command `npm install && npm run build`, start command `npm start`, and add the server environment variables.
- EAS: update `mobile/app.json` bundle/package IDs, configure secrets, then run `cd mobile && eas build --platform android --profile preview`.

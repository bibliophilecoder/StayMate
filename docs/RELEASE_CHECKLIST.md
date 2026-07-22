# StayMate release gate

## Cloud configuration

- Create Firebase iOS, Android and web apps. Enable Email/Password and Google providers.
- Add the Android SHA-1/SHA-256 fingerprints from EAS to Firebase before testing Google sign-in.
- Create a restricted MongoDB Atlas database user and allow only Render egress where the selected Render plan permits it.
- Create a Cloudinary upload folder and keep the API secret only in Render.
- Deploy `render.yaml`, then set `EXPO_PUBLIC_API_URL` to the resulting HTTPS URL plus `/api`.
- Run `eas init` in `mobile` to populate the EAS project ID used by push-token registration.

## Physical-device matrix

- Android 10, 12 and current: email auth, Google auth, image permission denial/approval, upload, swipe, mutual match, foreground/background message and push notification.
- iOS 16 and current: the same flows, including notification permission denial and later enablement in Settings.
- Test poor network, offline startup, expired JWT, revoked Firebase user, large photo, empty discovery queue and duplicate rapid taps.
- Use two real accounts on two physical devices to verify mutual matching, Socket.IO delivery, background Expo push and read ordering.

## Security and privacy

- Rotate all test secrets before launch; require a 32+ byte random JWT secret.
- Restrict Firebase authorized domains and Cloudinary transformations.
- Enable Atlas backups, alerts and least-privilege access.
- Operator confirmed: Riya Palod, Bhopal, Madhya Pradesh, India. Add a public support/privacy email and publicly hosted policy URL before release.
- Confirm account deletion in Firebase, Users, Matches, Messages and Bookmarks.
- Run `npm audit`, review every production dependency finding and never use `npm audit fix --force` without regression testing.

## Build

```bash
cd mobile
eas build --platform android --profile preview
eas build --platform android --profile production
```

The preview profile produces an internally distributed APK. Production normally produces an Android App Bundle for Play Store submission.

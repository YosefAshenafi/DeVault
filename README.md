# DeVault

Developer content vault and knowledge notebook built with **Expo** (React Native) and **Clerk**. Resources are stored **locally** on the device (SQLite); Clerk handles **sign-in** and account identity.

## Prerequisites

- **Node.js** 18+ (see [Expo requirements](https://docs.expo.dev/get-started/installation/))
- **npm** (bundled with Node)
- For device testing: **Expo Go** on a phone, or **Xcode** (iOS) / **Android Studio** (Android) for simulators or dev builds

## Quick start

1. **Clone and install**

   ```bash
   git clone <your-repo-url>
   cd DeVault
   npm install
   ```

2. **Environment**

   Copy the example env file and add your Clerk publishable key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```bash
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

3. **Clerk dashboard**

   - Create an application at [Clerk](https://dashboard.clerk.com).
   - Under **Native applications** (or your app’s redirect URLs), add:

     `devault://oauth-callback`

   - Enable **Google** (or other OAuth providers) if you use “Continue with Google”.

4. **Run the app**

   ```bash
   npm start
   ```

   Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with **Expo Go**.

   Other scripts:

   ```bash
   npm run ios      # Expo → iOS
   npm run android  # Expo → Android
   npm run web      # Expo web (optional)
   ```

## Troubleshooting

- **`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` missing** — The app shows a setup screen until `.env` is configured. Restart the dev server after changing env vars.
- **Clerk key in release APK** — Use `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` (Clerk publishable key). For local release APKs, run `npm run android:apk:release` so prebuild embeds it into native config.
- **EAS cloud build env vars** — `.env` is local and gitignored; for cloud builds add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in your Expo project Environment Variables.
- **npm peer dependency errors with Clerk** — This repo uses `legacy-peer-deps` via `.npmrc`. If you remove it, try `npm install --legacy-peer-deps`.
- **OAuth redirect** — If Google sign-in fails after the browser step, confirm `devault://oauth-callback` is allowed in Clerk and that `scheme` in `app.config.ts` stays `devault`.
- **Health check** — `npx expo-doctor` should pass. If you see duplicate native modules, run `npm dedupe` and reinstall if needed.

## Android release APK (local)

Use this when you want repeatable testing builds without EAS cloud:

```bash
npm run android:apk:release
```

This runs prebuild and Gradle release assembly, and outputs:

`android/app/build/outputs/apk/release/app-release.apk`

Helpful related scripts:

```bash
npm run android:prebuild    # refresh android/ from app config
npm run android:apk:gradle  # build release APK from existing android/ project
```

## Git / GitHub

- **Ignored by default:** `.env`, `Plan.md`, `.tmp/`, and common IDE junk (see `.gitignore`).
- If `Plan.md` was committed before it was ignored, stop tracking it with:  
  `git rm --cached Plan.md`

## Project layout (high level)

| Path | Purpose |
|------|---------|
| `app/navigation/` | Stacks, linking |
| `app/screens/` | UI screens |
| `app/components/` | Reusable UI |
| `app/data/` | SQLite + export/import |
| `app/hooks/`, `app/context/` | Data and theme hooks |
| `app/theme/` | Colors, spacing, theme provider |
| `app/share/`, `app/utils/` | Share scaffold, metadata fetch |
| `app.config.ts` | Expo config (scheme, Android share intent scaffold) |

## Data and privacy

- Vault **resources** live in local SQLite, keyed by Clerk `userId`.
- **Export / import** is available in **Settings** (JSON backup).
- Do not commit `.env` or real API keys (see `.gitignore`).

## License

Private / your choice — set `LICENSE` when you publish the repo.

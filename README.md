# SunoBolo: Multilingual AI Chat App

A modern, minimalist React Native app to make AI accessible to everyone in India. Supports multiple languages, text/voice input (future), and a sleek UI inspired by Anthropic.

## Project Structure

```
SunoBolo/
├── assets/           # Images, Lottie files, etc.
├── components/       # Reusable UI components
├── navigation/       # Navigation setup (Stack/Drawer)
├── screens/          # App screens (Splash, Onboarding, Chat, etc.)
├── utils/            # Utility functions (AsyncStorage helpers, etc.)
├── App.js            # Entry point
├── package.json      # Dependencies
├── .env              # Environment variables (Supabase, etc.)
├── CHANGELOG.md      # Project change log
```

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run on Android:
   ```sh
   npx react-native run-android
   ```
3. Run on iOS:
   ```sh
   npx react-native run-ios
   ```

## Key Libraries
- `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/drawer`
- `@react-native-async-storage/async-storage`
- `lottie-react-native`

## Notes
- Voice input and backend AI integration are planned for future updates.
- This build uses mocked AI responses for chat.

## Troubleshooting
- If you encounter issues, try clearing cache: `npx react-native start --reset-cache`
- For iOS, run `cd ios && pod install` after installing dependencies.

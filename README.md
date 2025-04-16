# SunoBoloExpo: Multilingual AI Chat App (Expo)

This is the Expo version of SunoBolo, a modern, minimalist AI chat app for India supporting multiple languages and a sleek UI.

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the Expo server:
   ```sh
   npx expo start
   ```
3. Scan the QR code with the Expo Go app (Android/iOS) or run in your browser.

## Project Structure
- `components/` - Reusable UI components
- `navigation/` - Navigation setup (Stack/Drawer)
- `screens/` - App screens (Splash, Onboarding, Chat, etc.)
- `utils/` - Context providers and helpers

## Key Libraries
- `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/drawer`
- `@react-native-async-storage/async-storage`
- `expo`

## Notes
- Voice input and backend AI integration are planned for future updates.
- This build uses mocked AI responses for chat.

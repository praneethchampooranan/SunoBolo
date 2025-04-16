# Changelog

All notable changes to the SunoBolo project will be documented in this file.

## [0.1.0] - 2025-04-15
### Added
- Fresh React Native project initialized (v0.73.11, Node 18.x).
- Modular folder structure: assets, components, navigation, screens, utils.
- Stack and Drawer navigation (React Navigation).
- Theme and Language context providers using AsyncStorage.
- .env file for Supabase credentials.
- MCP configuration for GitHub only (due to tool limits).
- All core screens: Splash, Onboarding, Language Selection, Chat, Settings.
- CustomButton reusable component.
- README and CHANGELOG added.

### Fixed
- Cleaned up all nested/duplicate project folders and resolved dependency conflicts.

### Decisions
- Only one MCP server (GitHub) will be active at a time due to environment limits. Supabase MCP will be swapped in when needed for database integration.

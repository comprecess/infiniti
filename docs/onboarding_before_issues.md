# Onboarding Page - BEFORE Fix (Issue #011)

## Screenshot: /home/ubuntu/screenshots/console_infiniti_str_2026-06-06_10-17-21_6610.webp

## Issues Identified:

1. **White main content container** - The entire onboarding wizard sits inside a white (#FFFFFF) container that contrasts sharply with the dark sidebar and header
2. **White wizard card** - The step tabs area has white background
3. **White form section** - The form fields area ("Company Information") has white background
4. **White step indicator cards** - Each step tab (1-5) uses white/light background
5. **Light input backgrounds** - Form inputs appear to have light gray backgrounds instead of dark theme inputs
6. **White progress bar container** - The "0% Complete" area has white background
7. **Buttons with white background** - "Save" button uses white/light styling

## Root Cause:
The OnboardingPage.module.scss changes were deployed but the component still uses Chakra UI's `Box`, `Card`, `CardBody` etc. which have their own white backgrounds from the Chakra theme. The SCSS module classes are not being applied to override these Chakra defaults.

## Fix Required:
1. Override Chakra component backgrounds directly in the SCSS module
2. OR replace Chakra layout components with native HTML + SCSS classes
3. Ensure all containers use $brand-900 or $brand-800 backgrounds
4. Ensure form inputs use dark theme styling
5. Ensure step indicators use dark backgrounds

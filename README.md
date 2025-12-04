# The Anchor PWA

A privacy-first digital sanctuary designed to de-escalate anxiety and build resilience through clinically proven tools.

## Features

- **Privacy-First**: No data tracking, fully offline-capable
- **Mobile-First Design**: Optimized for mobile with desktop device simulation
- **Dark Mode**: Beautiful dark theme with animated background blobs
- **Bilingual Support**: English (EN) and Ukrainian (UA)
- **Offline Access**: Works completely offline after initial load

## Quick Start

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (LTS version recommended).

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Look for the URL in the terminal (usually `http://localhost:5173`)
   - Open that URL in your browser

### What to Expect

- **First Visit**: You'll see the landing page with hero section, features, and expert profile
- **After Clicking "Enter Anchor"**: Main app shell with 5 navigation tabs
- **First Time in App**: Onboarding overlay explaining the app features

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

This will start a local server to preview the production build.

---

## Deployment

See `LAUNCH_PLAN.md` for detailed deployment instructions.

**Quick Deploy to Vercel:**
1. Push code to GitHub
2. Import repository in Vercel
3. Build settings: `npm run build`, Output: `dist`
4. Deploy!

---

## ⚠️ Before Launch

**Required:** Create PWA icons (`icon-192.png` and `icon-512.png` in `/public/` folder)
- See `ICON_CREATION_GUIDE.md` for instructions

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React (Icons)

## Project Structure

```
src/
  components/
    AppShell.jsx    # Main app skeleton with navigation and state
  App.jsx           # Root component
  main.jsx          # Entry point
  index.css         # Global styles
```


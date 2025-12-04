# How to View The Anchor App on Localhost

## Prerequisites

First, make sure you have Node.js installed on your system. You can check by running:
```bash
node --version
npm --version
```

If you don't have Node.js installed, download it from: https://nodejs.org/

## Installation Steps

1. **Open Terminal** in the project directory (`/Users/lesmagyar/Desktop/Anchor`)

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including React, Vite, Tailwind CSS, and lucide-react icons.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **View the App**
   - The terminal will show a URL, typically: `http://localhost:5173`
   - Open this URL in your web browser
   - The app will automatically reload when you make changes to the code

## What You Should See

1. **Landing Page** (first visit):
   - Navigation bar with theme/language toggles
   - Hero section with breathing animation
   - Features grid
   - Expert section with Viktoriia's profile
   - Footer

2. **After Clicking "Enter Anchor"**:
   - Main app shell with device simulation (on desktop)
   - Onboarding overlay (first time)
   - Five navigation tabs: Breathe, SOS, Journal, History, Connect

## Troubleshooting

If you encounter issues:

- **Port already in use**: The dev server will try to use port 5173. If it's taken, Vite will suggest another port (like 5174)
- **Module errors**: Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
- **Build errors**: Check the terminal output for specific error messages

## Build for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `dist` folder, ready to deploy.



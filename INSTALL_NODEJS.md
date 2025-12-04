# How to Install Node.js (Quick Guide)

## Option 1: Download from Website (Easiest - Recommended)

1. **Open your web browser** and go to:
   ```
   https://nodejs.org/
   ```

2. **Download the LTS version** (the green button on the left - it says "LTS" and will be something like "v20.x.x")

3. **Open the downloaded file** (it will be a `.pkg` file in your Downloads folder)

4. **Follow the installation wizard:**
   - Click "Continue" through the prompts
   - You may need to enter your Mac password
   - Click "Install" and wait for it to finish

5. **Verify installation:**
   - Open Terminal (Cmd + Space, type "Terminal")
   - Type: `node --version`
   - You should see something like `v20.x.x`

6. **You're done!** Now you can run:
   ```bash
   cd /Users/lesmagyar/Desktop/Anchor
   npm install
   npm run dev
   ```

## Option 2: Using Homebrew (If you have it)

If you already have Homebrew installed:
```bash
brew install node
```

## Troubleshooting

- **Can't find Terminal?** Press `Cmd + Space`, type "Terminal", press Enter
- **Installation asks for password?** This is normal - enter your Mac login password
- **After installing, still says "command not found"?** Close and reopen Terminal, then try again

---

**Once Node.js is installed, come back here and run:**
```bash
npm install
npm run dev
```



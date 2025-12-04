# 📦 GitHub Setup Guide - Step by Step

This guide will walk you through setting up GitHub and pushing your Anchor code.

---

## Why GitHub?

GitHub is needed for:
- ✅ Storing your code online
- ✅ Deploying to hosting platforms (Vercel, Netlify, etc.)
- ✅ Version control (tracking changes)
- ✅ Backup of your code

**Don't worry - it's easier than it sounds!**

---

## Step 1: Create GitHub Account

1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Enter your email
4. Choose a username
5. Create a password
6. Verify your email
7. ✅ Done!

---

## Step 2: Create Repository

1. After logging in, click the **"+"** icon in top right
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** `anchor-pwa` (or your choice)
   - **Description:** "Privacy-first PWA for anxiety relief"
   - **Visibility:** 
     - ✅ Choose **Private** if you want it hidden
     - ✅ Choose **Public** if you don't mind it being visible (still free)
   - **Important:** Do NOT check "Add a README file" (we have one)
   - **Do NOT** add .gitignore or license (we have .gitignore)
4. Click **"Create repository"**

---

## Step 3: Install Git (If Not Already Installed)

**Check if Git is installed:**

Open Terminal and type:
```bash
git --version
```

**If you see a version number:** ✅ You're good!
**If you see an error:** Git needs to be installed

### Install Git on Mac:

**Option 1: Using Homebrew (Recommended)**
```bash
brew install git
```

**Option 2: Download from Website**
1. Go to [git-scm.com/download/mac](https://git-scm.com/download/mac)
2. Download and install
3. Restart Terminal

**I'll verify Git is installed before we proceed!**

---

## Step 4: Push Code to GitHub

**I'll guide you through each command. Here's what we'll do:**

### A. Initialize Git (if not already done)

```bash
cd /Users/lesmagyar/Desktop/Anchor
git init
```

### B. Create .gitignore (if missing)

Make sure we're not uploading unnecessary files:

```bash
# Check if .gitignore exists
ls -la | grep gitignore
```

### C. Add All Files

```bash
git add .
```

### D. Create First Commit

```bash
git commit -m "Initial commit - Anchor PWA ready for deployment"
```

### E. Connect to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/anchor-pwa.git
```

**(Replace YOUR-USERNAME with your GitHub username)**

### F. Push to GitHub

```bash
git push -u origin main
```

**You'll be asked for your GitHub username and password/token.**

---

## Step 5: Authentication

GitHub requires a **Personal Access Token** instead of password.

**I'll guide you to create one:**

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token"
3. Name it: "Anchor Deployment"
4. Select scopes: Check "repo" (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

## Troubleshooting

### "Command not found: git"
→ Git isn't installed. I'll help install it.

### "Permission denied"
→ Check your GitHub username/token

### "Repository not found"
→ Double-check repository name and that it exists on GitHub

---

## What Happens Next?

After code is on GitHub:
1. ✅ Your code is backed up online
2. ✅ You can deploy to hosting platforms
3. ✅ You can access it from anywhere
4. ✅ Easy to update and deploy

---

## Ready to Start?

**Just say:**
- **"Help me set up GitHub"** → I'll guide you step-by-step
- **"Git is installed"** → We'll proceed with pushing code
- **"I already have GitHub"** → We'll skip to repository creation

**I'll walk you through every single step! Don't worry about making mistakes - I'm here to help!** 😊


# Testing Guide - Phase 1 Features

## Quick Access

**Your app should be running at:** `http://localhost:5173`

Open this URL in your browser to start testing!

---

## 🧪 Test Plan

### 1. Test Service Worker & PWA (Offline Support)

**Step-by-step:**

1. **Open Browser DevTools:**
   - Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Safari: Enable Developer menu first, then `Cmd+Option+C`

2. **Check Service Worker Registration:**
   - Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
   - Click **Service Workers** in the left sidebar
   - You should see: "Service Worker registered" or a service worker listed

3. **Test Offline Mode:**
   - In DevTools, go to **Network** tab
   - Check the dropdown that says "Online" → Change it to **"Offline"**
   - Refresh the page (or navigate around)
   - ✅ The app should still work! All pages should load from cache

4. **Test PWA Install:**
   - Look for install icon in browser address bar
   - Or go to DevTools → Application → Manifest
   - Should show PWA manifest details

---

### 2. Test JSON Backup/Restore

**Step-by-step:**

1. **Create Some Test Data:**
   - Navigate to **Journal** tab (Refine)
   - Fill out a journal entry:
     - Trigger: "Had a stressful meeting"
     - Thought: "I'm not good enough"
     - Rational: "Meetings can be stressful, that's normal"
     - Select some tags (Work, Health)
     - Set mood slider to 6
     - Click **Save Entry**
   - Create 2-3 more entries with different moods/tags

2. **Test Backup:**
   - Go to **History** tab (Insight)
   - Scroll down to find the buttons section
   - Click **"Backup to File"**
   - ✅ A JSON file should download (check Downloads folder)
   - Open the file - it should contain all your entries in JSON format

3. **Test Restore:**
   - **Option A**: Clear entries first
     - Click **"Clear History"** → Click again to confirm
     - Entries should disappear
   - **Option B**: Test restore with existing entries
   - Click **"Restore from File"**
   - Select the JSON file you just downloaded
   - ✅ All entries should be restored!

---

### 3. Test Screen Reader Optimization

**Step-by-step:**

1. **Enable Screen Reader:**
   - **Mac (VoiceOver):**
     - Press `Cmd+F5` to enable VoiceOver
     - Or go to System Settings → Accessibility → VoiceOver
   - **Windows (Narrator):**
     - Press `Win+Ctrl+Enter`
   - **Chrome (Screen Reader Extension):**
     - Install "Screen Reader" extension if needed

2. **Test Breathing Component:**
   - Navigate to **Breathe** tab
   - Start a breathing session
   - ✅ Screen reader should announce:
     - "Inhale... 4 seconds"
     - "Hold... 7 seconds"
     - "Exhale... 8 seconds"
   - Navigate through the interface - should have proper labels

3. **Verify Aria Labels:**
   - In DevTools → Elements tab
   - Search for `aria-live` or `role="status"`
   - Should find announcements in Breathing component

---

### 4. Test Reduced Motion Mode

**Step-by-step:**

1. **Enable Reduced Motion (Mac):**
   - System Settings → Accessibility → Display
   - Turn ON **"Reduce Motion"**

2. **Enable Reduced Motion (Windows):**
   - Settings → Ease of Access → Display
   - Turn ON **"Show animations in Windows"** (OFF)

3. **Refresh the App:**
   - Go to `http://localhost:5173`
   - Refresh the page

4. **Check Animations:**
   - ✅ **Breathing tab**: Circle should still change size/color, but no pulsing
   - ✅ **Landing page**: Blobs and breathing animation should be static
   - ✅ **SOS tab**: Gradient orb should not pulse
   - ✅ **AppShell**: Dark mode blobs should not animate
   - All functionality should work, just no animations!

5. **Test Disabling:**
   - Turn OFF reduced motion in system settings
   - Refresh app
   - ✅ Animations should return

---

## 🎯 Quick Test Checklist

- [ ] Service Worker shows as registered in DevTools
- [ ] App works when network is set to "Offline"
- [ ] Can download backup JSON file
- [ ] Can restore entries from JSON file
- [ ] Screen reader announces breathing phases
- [ ] Animations stop when reduced motion is enabled
- [ ] All features work normally with reduced motion

---

## 🐛 Troubleshooting

**Service Worker not showing:**
- Check browser console for errors
- Make sure you're on `http://localhost:5173` (not `file://`)
- Try hard refresh: `Cmd+Shift+R` (Mac) / `Ctrl+Shift+R` (Windows)

**Backup/Restore not working:**
- Check browser console for errors
- Make sure you have journal entries saved first
- Verify JSON file structure is correct

**Screen Reader not announcing:**
- Make sure VoiceOver/Narrator is actually enabled
- Check that you started a breathing session
- Look in browser console for any errors

**Reduced Motion not working:**
- Make sure system setting is actually enabled
- Hard refresh the page after changing setting
- Check browser console - should log motion preference

---

## 📱 Bonus: Test on Mobile

If you want to test the mobile experience:

1. **Find your local IP:**
   - Mac: System Settings → Network → find your IP (like 192.168.x.x)
   - Windows: Open Command Prompt → type `ipconfig` → find IPv4 Address

2. **Start dev server with network access:**
   - Stop current server (Ctrl+C)
   - Run: `npm run dev -- --host`
   - Note the network URL (like `http://192.168.x.x:5173`)

3. **Access from phone:**
   - Make sure phone is on same WiFi network
   - Open browser on phone
   - Go to the network URL
   - Test the mobile experience!

---

Happy Testing! 🚀



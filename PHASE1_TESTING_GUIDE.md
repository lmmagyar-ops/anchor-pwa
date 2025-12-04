# Phase 1 Testing Guide 🧪

## Quick Access

**Your app should be running at:** `http://localhost:5173`

If the server isn't running, restart it with: `npm run dev`

---

## 🧪 Test Checklist

### 1. Toast Notification System

#### Test: Journal Save Success Toast
1. Navigate to **Refine** tab (Journal)
2. Fill out a journal entry:
   - Trigger: "Had a stressful day"
   - Thought: "I can't handle this"
   - Rational: "I've handled stressful days before"
   - Select a tag (e.g., "Work")
   - Set mood to 7
3. Click **"Save Entry"**
4. ✅ **Expected:** 
   - Success animation appears (full-screen overlay with checkmark)
   - Success toast appears in top-right corner (green, says "Entry saved successfully!")
   - Animation auto-dismisses after 2 seconds
   - Toast auto-dismisses after 5 seconds
   - Form clears

#### Test: Backup Success Toast
1. Navigate to **Insight** tab (History)
2. Make sure you have at least one journal entry
3. Scroll down to find **"Backup to File"** button
4. Click **"Backup to File"**
5. ✅ **Expected:**
   - File downloads (check Downloads folder)
   - Success toast appears: "Backup downloaded successfully!"
   - Toast is green (success variant)
   - Toast auto-dismisses after 5 seconds

#### Test: Restore Success Toast
1. In History tab, click **"Restore from File"**
2. Select the JSON backup file you just downloaded
3. ✅ **Expected:**
   - If valid file: Success toast "Entries restored successfully!" (green)
   - Entries appear in history
   - Toast auto-dismisses

#### Test: Restore Error Toast
1. In History tab, click **"Restore from File"**
2. Try selecting an invalid file (or cancel)
3. ✅ **Expected:**
   - If invalid file: Error toast appears (red)
   - Error message displays
   - Toast auto-dismisses after 5 seconds

#### Test: Multiple Toasts
1. Save a journal entry (shows success toast)
2. While that toast is visible, backup your data
3. ✅ **Expected:**
   - Second toast appears below first toast
   - Toasts stack vertically
   - Both auto-dismiss independently

#### Test: Manual Dismiss
1. Trigger any toast (e.g., save entry)
2. Click the **X button** on the toast
3. ✅ **Expected:**
   - Toast disappears immediately
   - No waiting for auto-dismiss

#### Test: Toast Animations
1. Watch closely when toasts appear
2. ✅ **Expected:**
   - Toasts slide in smoothly from the right
   - Smooth animation (not jarring)
   - If reduced motion enabled: minimal animation

---

### 2. Success Animation

#### Test: Journal Save Animation
1. Go to **Refine** tab
2. Fill out and save an entry
3. ✅ **Expected:**
   - Full-screen overlay appears with backdrop blur
   - Large checkmark icon animates (bounces once)
   - Message: "Entry saved!"
   - Auto-dismisses after 2 seconds
   - Smooth fade-out

#### Test: Animation Quality
1. Save multiple entries quickly
2. ✅ **Expected:**
   - Animation doesn't stack or conflict
   - Each animation completes before next shows
   - Smooth, polished feel

---

### 3. Loading Components (Visual Check)

#### Test: LoadingSpinner Component
1. The component exists and can be used
2. Check that it renders (visual inspection)
3. ✅ **Expected:**
   - Spinner is visible
   - Rotates smoothly (or static if reduced motion)
   - Three sizes available (sm, md, lg)

#### Test: Skeleton Component
1. Component exists and is ready
2. Check variants work
3. ✅ **Expected:**
   - Skeleton renders with pulse animation
   - Different variants (text, heading, circle)
   - Respects reduced motion

---

## 🐛 Known Issues to Watch For

### Potential Issues:
1. **Toast not appearing**: Check browser console for errors
2. **Animation not working**: Check if reduced motion is enabled
3. **Toasts stacking incorrectly**: Should stack vertically, not overlap
4. **Success animation blocking**: Should auto-dismiss, not block interaction

---

## ✅ Success Criteria

Phase 1 is successful if:
- ✅ All `alert()` calls replaced with toasts
- ✅ Toasts appear in correct position (top-right)
- ✅ Success animations work smoothly
- ✅ No browser alerts appear
- ✅ Animations respect reduced motion
- ✅ Everything is accessible (keyboard, screen reader)

---

## 📱 Test on Mobile (If Possible)

1. Open app on mobile device (same WiFi)
2. Test toast notifications on smaller screen
3. ✅ **Expected:**
   - Toasts fit on screen
   - Touch targets are large enough
   - Animations work smoothly

---

## 🎯 Quick Test Path

**Fastest way to test everything:**
1. Save a journal entry → See success animation + toast
2. Backup data → See success toast
3. Restore backup → See success/error toast
4. Try dismissing toast manually → Works instantly

**Total time: ~2 minutes**

---

## 🚨 If Something Doesn't Work

1. **Check browser console** (F12 → Console tab)
2. **Hard refresh** the page (Cmd+Shift+R / Ctrl+Shift+R)
3. **Check network tab** for failed requests
4. **Look for error messages** in console

Report any issues and I'll fix them!

---

**Ready to test?** Open `http://localhost:5173` and start with the journal save test! 🚀


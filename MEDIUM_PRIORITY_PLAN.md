# Medium Priority Features - Implementation Plan

## Overview

Moving on to Medium Priority features after successfully completing all High Priority items.

---

## Features to Implement (3)

### 1. Optimistic UI Updates
**Priority:** Medium  
**Effort:** Medium  
**Impact:** High

**Tasks:**
- Show journal entry immediately before save completes
- Smooth chart animations when new data arrives
- Instant feedback on all user actions
- Rollback on error (if save fails, remove optimistic update)
- Add loading states for async operations

**Files to Modify:**
- `src/components/Journal.jsx`
- `src/components/History.jsx`
- `src/components/AppShell.jsx`

---

### 2. Pull-to-Refresh
**Priority:** Medium  
**Effort:** Medium  
**Impact:** Medium

**Tasks:**
- Implement pull-to-refresh on History tab
- Refresh daily quote with pull-to-refresh
- Add visual feedback during pull
- Ensure it feels native and smooth

**Files to Modify:**
- `src/components/History.jsx`
- `src/components/AppShell.jsx`

**Files to Create:**
- `src/hooks/usePullToRefresh.js` (optional utility)

---

### 3. Improved Onboarding Flow
**Priority:** Medium  
**Effort:** Medium  
**Impact:** Medium

**Tasks:**
- Add skip option to onboarding
- Make onboarding interactive:
  - "Try tapping the circle" on breathing page
  - "Swipe to try next step" on SOS
- Add progress indicator ("Step 2 of 4")
- Make onboarding optional/skippable
- Add "Show tutorial again" option in settings

**Files to Modify:**
- `src/components/AppShell.jsx` (OnboardingOverlay)

---

## Implementation Order

1. **Optimistic UI Updates** (high impact, improves perceived performance)
2. **Pull-to-Refresh** (better mobile experience)
3. **Improved Onboarding** (better first-time user experience)

---

## Status

**Starting:** Optimistic UI Updates


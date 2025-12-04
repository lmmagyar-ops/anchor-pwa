# Low Priority Features - Implementation Plan

## Features to Build

1. ✅ High Contrast Mode (Accessibility)
2. ✅ Icon Consistency Audit
3. ✅ Customizable Themes (Color Options)
4. ✅ Streaks & Gamification

---

## Implementation Order

### Phase 1: High Contrast Mode (Quick Win)
**Why First:** Accessibility is important, relatively quick to implement

**Tasks:**
- Create high contrast theme variants
- Add toggle in settings/header
- Improve color contrast ratios (WCAG AAA)
- Test with screen readers

**Files to Create:**
- `src/utils/contrastMode.js`

**Files to Modify:**
- `src/components/AppShell.jsx` (add toggle)
- `tailwind.config.js` (add high contrast colors)
- `src/index.css` (add high contrast styles)

---

### Phase 2: Icon Consistency Audit
**Why Second:** Quick win, improves perceived quality

**Tasks:**
- Audit all icons across the app
- Standardize sizes (w-5, w-6, w-8)
- Standardize stroke widths
- Add subtle animations where appropriate
- Ensure consistent style

**Files to Modify:**
- All component files with icons
- Create icon size constants

---

### Phase 3: Customizable Themes
**Why Third:** Nice personalization, medium complexity

**Tasks:**
- Create theme selector component
- Add color options: Teal (default), Blue, Purple, Green
- Store theme preference in localStorage
- Apply theme across all components
- Update tailwind config for theme colors

**Files to Create:**
- `src/components/ThemeSelector.jsx`
- `src/utils/themes.js`

**Files to Modify:**
- `src/components/AppShell.jsx`
- `tailwind.config.js`

---

### Phase 4: Streaks & Gamification
**Why Last:** Most complex but highest engagement impact

**Tasks:**
- Track daily usage (breathing, journal, SOS, PMR)
- Create streak counter component
- Add achievement badges system
- Display streaks in History tab
- Add weekly summary messages
- Keep gamification subtle and encouraging

**Files to Create:**
- `src/components/StreakCounter.jsx`
- `src/components/AchievementBadge.jsx`
- `src/utils/streaks.js`
- `src/utils/achievements.js`

**Files to Modify:**
- `src/components/History.jsx`
- `src/components/AppShell.jsx`
- `src/components/Breathing.jsx`
- `src/components/Journal.jsx`
- `src/components/SOS.jsx`
- `src/components/PMR.jsx`

---

## Starting Implementation Now!



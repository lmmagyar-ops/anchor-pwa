# Landing Page Bug Audit

## Bugs Found:

### 1. ⚠️ CRITICAL: Headline Gradient Split Logic
**Issue:** The headline splits by `.slice(0, -3)` and `.slice(-3)` which assumes title has at least 4 words. If title structure changes, gradient won't work correctly.

**Location:** Line 153-159
**Risk:** Could cause layout issues or missing text if title structure changes

**Fix:** Make splitting more robust with fallback

---

### 2. ⚠️ POTENTIAL: Missing Content Fallback
**Issue:** If `content[lang]` is undefined or missing properties, buttons/content could disappear

**Location:** Multiple places accessing `c.enterBtn`, `c.trustBadge`, etc.
**Risk:** Language switching could cause brief disappearance

**Fix:** Add null checks and fallback values

---

### 3. ⚠️ POTENTIAL: Button Visibility Issues
**Issue:** Button might be hidden due to:
- Z-index conflicts
- Overflow hidden on parent
- Conditional rendering errors
- Missing CSS classes

**Location:** CTA Button section (lines 181-207)

**Fix:** Ensure button always renders with fallback content

---

### 4. ⚠️ POTENTIAL: Trust Badge Conditional
**Issue:** Trust badge only shows if `c.trustBadge` exists - if missing, layout shifts

**Location:** Line 169-179

---

### 5. ⚠️ POTENTIAL: Secondary CTA Conditional
**Issue:** Secondary button only shows conditionally - if content missing, only one button shows

**Location:** Line 195-206

---

## Recommended Fixes:

1. Add null safety checks for all content properties
2. Add fallback values for missing content
3. Fix headline gradient split to be more robust
4. Ensure buttons always render (even with fallback text)
5. Add error boundaries around content access
6. Add console warnings for missing content


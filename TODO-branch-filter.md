# Branch Filter Fix - COMPLETED ✅

**Changes Made:**
- Updated `src/hooks/useCourses.tsx` `useSubjects`:
  - Fixed: `.eq('semester_id', semesterId)` - single semester only
  - Fixed: Added `console.log(subject.name, subject.branches)` debug logs
  - Fixed: Simplified client-side branch filtering logic
  - Removed: Multi-semester fetch/merge causing cross-branch visibility

**Status:** Deployed and tested - COMA subjects hidden in AIML/SE, SE hidden in COMA, etc.

**Test Commands:**
```
# View TODO progress
cat TODO.md

# Run dev server (if not running)
bun dev
```


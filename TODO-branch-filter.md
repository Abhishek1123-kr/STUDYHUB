# Branch Filtering for Subjects

## Status: In Progress

### Step 1: [DONE] DB Migration ✅
- Created supabase/migrations/20241201120000_add_branches_to_subjects.sql
- Run `supabase migration up` or Supabase dashboard SQL

### Step 2: [DONE] Update Type ✅
- src/types/database.ts: Added `branches: string[];` to Subject

### Step 3: [DONE] Update Hook ✅
- src/hooks/useCourses.tsx: Added branch filter in useSubjects queryFn
- Admin skips filter, users see branch + ALL subjects
- Console logs for debug

### Step 4: [TEST] 
- Admin: All subjects load
- User AIML: Common + AIML subjects
- Check console logs



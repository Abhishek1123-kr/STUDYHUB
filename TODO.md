 Courses Not Loading for Admin - Fix Plan

## Status: In Progress

### Step 1: [DONE] Add debugging to useCourses hook
- Edit src/hooks/useCourses.tsx: Log query response/error. ✅

### Step 2: [DONE] No code change needed - session propagates automatically. Logging added for verification.

### Step 3: [USER] Fix Supabase RLS Policy
- **Run this SQL in Supabase SQL Editor:**
```sql
CREATE POLICY "Authenticated read all courses" ON courses
FOR SELECT TO authenticated
USING (true);
```
- Or admin-only:
```sql
CREATE POLICY "Admins read courses" ON courses
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
```
✅

### Step 4: [DONE] Test:
1. Apply RLS policy.
2. Login admin → /courses
3. Console log: 📚 Courses query - data count: >0
4. Cards populate. Command: `bun run dev` ✅

### Step 5: [DONE] Update TODO on completion.


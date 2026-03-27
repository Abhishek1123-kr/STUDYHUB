-- Add branches column to subjects table
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS branches text[] DEFAULT ARRAY['ALL']::text[];

-- Update existing subjects to have ALL branches access
UPDATE public.subjects SET branches = ARRAY['ALL']::text[] WHERE branches IS NULL;

-- Comment: Branches: 'ALL' for common, array['AIML'] for specific, array['AIML','AIDS'] for multiple.

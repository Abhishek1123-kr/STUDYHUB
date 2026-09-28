-- ==========================================
-- STUDYHUB COMPLETE SUPABASE DATABASE SETUP
-- ==========================================

-- 1. Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  color TEXT DEFAULT '#1e40af',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Create semesters table
CREATE TABLE public.semesters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  number INTEGER NOT NULL CHECK (number >= 1 AND number <= 8),
  name TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(course_id, number)
);

-- 4. Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  semester_id UUID REFERENCES public.semesters(id) ON DELETE CASCADE NOT NULL,
  description TEXT,
  credits INTEGER DEFAULT 3,
  icon TEXT DEFAULT 'Book',
  order_index INTEGER DEFAULT 0,
  branches text[] DEFAULT ARRAY['ALL']::text[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Create material_type enum
CREATE TYPE public.material_type AS ENUM ('assignment', 'ppt', 'notes', 'lab_manual', 'syllabus', 'other');

-- 6. Create materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  material_type public.material_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Create user_roles table for admin access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 8. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 9. Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 10. RLS Policies for courses
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 11. RLS Policies for semesters
CREATE POLICY "Anyone can view semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Admins can insert semesters" ON public.semesters FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update semesters" ON public.semesters FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete semesters" ON public.semesters FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 12. RLS Policies for subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Admins can insert subjects" ON public.subjects FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subjects" ON public.subjects FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subjects" ON public.subjects FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 13. RLS Policies for materials
CREATE POLICY "Anyone can view materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Admins can insert materials" ON public.materials FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update materials" ON public.materials FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete materials" ON public.materials FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 14. RLS Policies for user_roles (with recursion fix)
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 15. Create storage bucket for materials
INSERT INTO storage.buckets (id, name, public) VALUES ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- 16. Storage policies for materials bucket
CREATE POLICY "Anyone can view materials files" ON storage.objects FOR SELECT USING (bucket_id = 'materials');
CREATE POLICY "Admins can upload materials" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update materials" ON storage.objects FOR UPDATE USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete materials" ON storage.objects FOR DELETE USING (bucket_id = 'materials' AND public.has_role(auth.uid(), 'admin'));

-- 17. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 18. Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_semesters_updated_at BEFORE UPDATE ON public.semesters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 19. Seed initial courses
INSERT INTO public.courses (name, code, description, icon, color, order_index) VALUES
('CSE Core', 'CSE', 'Computer Science & Engineering Core Program', 'Cpu', '#1e40af', 1),
('CSE AIML', 'AIML', 'Artificial Intelligence & Machine Learning', 'Brain', '#7c3aed', 2),
('CSE AIDS', 'AIDS', 'Artificial Intelligence & Data Science', 'Database', '#059669', 3),
('CSE Cyber Security', 'CYBER', 'Cyber Security Specialization', 'Shield', '#dc2626', 4),
('CSE BDA', 'BDA', 'Big Data Analytics', 'BarChart3', '#ea580c', 5),
('CSE BC', 'BC', 'Blockchain Technology', 'Link', '#0891b2', 6),
('CSE CC', 'CC', 'Cloud Computing', 'Cloud', '#6366f1', 7)
ON CONFLICT (code) DO NOTHING;

-- 20. Seed semesters for CSE Core (semesters 1 to 8)
INSERT INTO public.semesters (number, name, course_id, is_active)
SELECT s.num, 'Semester ' || s.num, c.id, CASE WHEN s.num = 4 THEN true ELSE false END
FROM (SELECT generate_series(1, 8) AS num) s
CROSS JOIN public.courses c WHERE c.code = 'CSE'
ON CONFLICT (course_id, number) DO NOTHING;

-- 21. Seed subjects for CSE Semester 4
INSERT INTO public.subjects (name, code, semester_id, description, credits, icon, order_index, branches)
SELECT 
  sub.name,
  sub.code,
  sem.id,
  sub.description,
  sub.credits,
  sub.icon,
  sub.order_index,
  ARRAY['ALL']::text[]
FROM (
  VALUES 
    ('Operating Systems', 'OS401', 'Study of OS concepts, processes, memory management', 4, 'Settings', 1),
    ('Computer Networks', 'CN402', 'Network protocols, architecture, and security', 4, 'Network', 2),
    ('Python Programming', 'PY403', 'Advanced Python programming concepts', 3, 'Code', 3),
    ('Competitive Coding', 'CC404', 'Data structures and algorithms for competitions', 3, 'Trophy', 4),
    ('Mathematics', 'MA405', 'Engineering Mathematics IV', 4, 'Calculator', 5),
    ('Professional Grooming', 'PG406', 'Soft skills and professional development', 2, 'Users', 6),
    ('Computer Organization & Architecture', 'COMA407', 'Computer architecture and organization', 4, 'Cpu', 7)
) AS sub(name, code, description, credits, icon, order_index)
CROSS JOIN public.semesters sem
JOIN public.courses c ON sem.course_id = c.id
WHERE c.code = 'CSE' AND sem.number = 4;

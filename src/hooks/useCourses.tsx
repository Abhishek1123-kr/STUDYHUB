import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Course, Semester, Subject, Material, MaterialType } from '@/types/database';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('order_index');
      
      console.log('📚 Courses query - data count:', data?.length || 0, 'error:', error?.message || 'none');
      if (error) throw error;
      return data as Course[];

    },
  });
}

export function useCourse(courseId: string | undefined) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
    enabled: !!courseId,
  });
}

export function useSemesters(courseId: string | undefined) {
  return useQuery({
    queryKey: ['semesters', courseId],
    queryFn: async () => {
      if (!courseId) return [];
      const { data, error } = await supabase
        .from('semesters')
        .select('*')
        .eq('course_id', courseId)
        .order('number');
      
      if (error) throw error;
      return data as Semester[];
    },
    enabled: !!courseId,
  });
}

export function useSemester(semesterId: string | undefined) {
  return useQuery({
    queryKey: ['semester', semesterId],
    queryFn: async () => {
      if (!semesterId) return null;
      const { data, error } = await supabase
        .from('semesters')
        .select('*, courses(*)')
        .eq('id', semesterId)
        .single();
      
      if (error) throw error;
      return data as Semester & { courses: Course };
    },
    enabled: !!semesterId,
  });
}

export function useSubjects(semesterId: string | undefined) {
  return useQuery({
    queryKey: ['subjects', semesterId],
    queryFn: async () => {
      console.log('📚 Subjects query for semester:', semesterId);
      if (!semesterId) return [];
      
      // Get current user session for branch and admin status
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      const branch = (user?.user_metadata as any)?.branch as string | undefined;
      
      let isAdmin = false;
      if (user) {
        const { data: adminData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        isAdmin = !!adminData;
      }
      console.log('📚 User auth:', { branch, isAdmin });
      
      // 1. Fetch current semester details
      const { data: currentSemData, error: semError } = await supabase
        .from('semesters')
        .select('*, courses(*)')
        .eq('id', semesterId)
        .single();
        
      if (semError) throw semError;

      const currentSem = currentSemData as Semester & { courses: Course };
      const isCore = currentSem.courses.code === 'CSE';
      let semesterIds = [semesterId];

      // 2. If it's a branch, find the CSE Core equivalent semester
      if (!isCore) {
        const { data: coreCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('code', 'CSE')
          .single();

        if (coreCourse) {
          const { data: coreSem } = await supabase
            .from('semesters')
            .select('id')
            .eq('course_id', coreCourse.id)
            .eq('number', currentSem.number)
            .single();

          if (coreSem) semesterIds.push(coreSem.id);
        }
      }

      // 3. Fetch subjects for both Core and Branch
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .in('semester_id', semesterIds)
        .order('order_index');
        
      if (error) throw error;

      // 4. Merge & deduplicate by subject code, prioritizing branch subjects over core
      const sortedData = data.sort((a, b) => {
        if (a.semester_id === semesterId && b.semester_id !== semesterId) return 1;
        if (a.semester_id !== semesterId && b.semester_id === semesterId) return -1;
        return (a.order_index || 0) - (b.order_index || 0);
      });

      const uniqueSubjects = Array.from(
        new Map(sortedData.map((item) => [item.code, item])).values()
      ) as Subject[];
      
      // 5. Branch filtering (skip for admin or no branch)
      let filteredSubjects = uniqueSubjects;
      if (branch && !isAdmin) {
        filteredSubjects = uniqueSubjects.filter((subject: Subject) => 
          subject.branches && (subject.branches.includes('ALL') || subject.branches.includes(branch))
        );
        console.log('📚 Branch filtered subjects:', filteredSubjects.length, '/ original', uniqueSubjects.length, 'for branch:', branch);
      } else {
        console.log('📚 No branch filter (admin/guest):', uniqueSubjects.length);
      }
      
      return filteredSubjects;
    },
    enabled: !!semesterId,
  });
}

export function useSubject(subjectId: string | undefined) {
  return useQuery({
    queryKey: ['subject', subjectId],
    queryFn: async () => {
      if (!subjectId) return null;
      const { data, error } = await supabase
        .from('subjects')
        .select('*, semesters(*, courses(*))')
        .eq('id', subjectId)
        .single();
      
      if (error) throw error;
      return data as Subject & { semesters: Semester & { courses: Course } };
    },
    enabled: !!subjectId,
  });
}

export function useMaterials(subjectId: string | undefined, materialType?: MaterialType) {
  return useQuery({
    queryKey: ['materials', subjectId, materialType],
    queryFn: async () => {
      if (!subjectId) return [];
      
      let query = supabase
        .from('materials')
        .select('*')
        .eq('subject_id', subjectId)
        .order('created_at', { ascending: false });
      
      if (materialType) {
        query = query.eq('material_type', materialType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Material[];
    },
    enabled: !!subjectId,
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteSemester() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (semesterId: string) => {
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', semesterId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['semesters'] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subjectId: string) => {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (materialId: string) => {
      const { error } = await supabase
        .from('materials')
        .delete()
        .eq('id', materialId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}

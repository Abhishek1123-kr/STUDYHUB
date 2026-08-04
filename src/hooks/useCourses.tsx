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

      // Get current user details safely
      const { data: { user } } = await supabase.auth.getUser();
      const branch = (user?.user_metadata as any)?.branch as string | undefined;

      // 1. Get current semester
      const { data: currentSemData, error: semError } = await supabase
        .from('semesters')
        .select('*, courses(*)')
        .eq('id', semesterId)
        .single();

      if (semError) throw semError;

      const currentSem = currentSemData as Semester & { courses: Course };
      const isCore = currentSem.courses.code === 'CSE';

      let semesterIds = [semesterId];

      // 2. Add core semester if not core
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

      // 3. Fetch all subjects (core + branch)
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .in('semester_id', semesterIds)
        .order('order_index');

      if (error) throw error;

      // ✅ 4. FIXED MERGE LOGIC (IMPORTANT)
      const branchSubjects = data.filter(s => s.semester_id === semesterId);
      const coreSubjects = data.filter(s => s.semester_id !== semesterId);

      const subjectMap = new Map();

      // Priority: branch subjects
      branchSubjects.forEach(sub => {
        subjectMap.set(sub.code, sub);
      });

      // Add core only if not present
      coreSubjects.forEach(sub => {
        if (!subjectMap.has(sub.code)) {
          subjectMap.set(sub.code, sub);
        }
      });

      const uniqueSubjects = Array.from(subjectMap.values());

      // ✅ 5. FINAL FILTER (IMPORTANT)
      let filteredSubjects = uniqueSubjects;

      if (branch) {
        filteredSubjects = uniqueSubjects.filter((subject: Subject) =>
          subject.branches &&
          (subject.branches.includes('ALL') || subject.branches.includes(branch))
        );
      }

      console.log('📚 Final subjects:', filteredSubjects);

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

export function useIncrementDownload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      // 1. Try to increment via security definer RPC (recommended)
      const { error: rpcError } = await supabase
        .rpc('increment_download_count', { material_id: materialId });

      if (rpcError) {
        console.warn('RPC function increment_download_count not found or failed, falling back to direct update:', rpcError.message);

        // 2. Fallback: Direct database update
        const { data: material, error: fetchError } = await supabase
          .from('materials')
          .select('download_count')
          .eq('id', materialId)
          .single();

        if (fetchError) throw fetchError;

        const currentCount = material?.download_count || 0;

        const { error: updateError } = await supabase
          .from('materials')
          .update({ download_count: currentCount + 1 })
          .eq('id', materialId);

        if (updateError) {
          throw new Error(`Direct update failed: ${updateError.message}`);
        }
      }
    },
    onSuccess: () => {
      // Invalidate queries to fetch updated count from backend
      queryClient.invalidateQueries({ queryKey: ['materials'] });
    },
  });
}
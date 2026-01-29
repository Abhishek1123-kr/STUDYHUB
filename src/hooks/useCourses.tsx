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
      if (!semesterId) return [];
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('semester_id', semesterId)
        .order('order_index');
      
      if (error) throw error;
      return data as Subject[];
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

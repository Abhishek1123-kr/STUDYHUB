export type MaterialType = 'assignment' | 'ppt' | 'notes' | 'lab_manual' | 'syllabus' | 'other';

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string | null;
  icon: string;
  color: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Semester {
  id: string;
  number: number;
  name: string;
  course_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  semester_id: string;
  description: string | null;
  credits: number;
  icon: string;
  order_index: number;
  created_at: string;
  updated_at: string;
  branches: string[];
}

export interface Material {
  id: string;
  title: string;
  description: string | null;
  subject_id: string;
  material_type: MaterialType;
  file_url: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  uploaded_by: string | null;
  download_count: number;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export const materialTypeLabels: Record<MaterialType, string> = {
  assignment: 'Assignments',
  ppt: 'PPTs',
  notes: 'Notes',
  lab_manual: 'Lab Manuals',
  syllabus: 'Syllabus',
  other: 'Other Resources',
};

export const materialTypeIcons: Record<MaterialType, string> = {
  assignment: 'FileText',
  ppt: 'Presentation',
  notes: 'BookOpen',
  lab_manual: 'FlaskConical',
  syllabus: 'ClipboardList',
  other: 'Files',
};

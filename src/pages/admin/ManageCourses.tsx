import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCourses, useDeleteCourse } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ManageCourses = () => {
  const { data: courses, isLoading, isError, error, refetch } = useCourses();
  const deleteCourse = useDeleteCourse();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    color: '#1e40af',
  });

  const handleEditClick = (course: any) => {
    setEditingCourseId(course.id);
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description || '',
      color: course.color || '#1e40af',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCourseId(null);
    setFormData({ name: '', code: '', description: '', color: '#1e40af' });
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingCourseId) {
        const { error } = await supabase
          .from('courses')
          .update({
            name: formData.name,
            code: formData.code,
            description: formData.description,
            color: formData.color,
          })
          .eq('id', editingCourseId);
          
        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            name: formData.name,
            code: formData.code,
            description: formData.description,
            color: formData.color,
          });

        if (error) throw error;
        toast.success('Course created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"? This will also delete all associated semesters, subjects, and materials.`)) {
      return;
    }

    try {
      await deleteCourse.mutateAsync(courseId);
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Manage Courses' },
          ]}
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Manage Courses</h1>
            <p className="text-muted-foreground">
              Add, edit, or delete courses.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={() => resetForm()}>
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCourseId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., CSE Core"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g., CSE"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the course"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Theme Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10 w-full"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingCourseId ? 'Update Course' : 'Create Course'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-destructive/10 rounded-lg p-6">
            <p className="text-destructive font-medium mb-4">
              Failed to load courses: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Retry Loading Courses
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {courses?.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: course.color }}
                      >
                        {course.code.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{course.name}</h3>
                        <p className="text-sm text-muted-foreground">{course.code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleEditClick(course)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleDelete(course.id, course.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageCourses;

import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCourses, useSemesters, useSubjects, useMaterials, useDeleteMaterial } from '@/hooks/useCourses';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { MaterialCard } from '@/components/materials/MaterialCard';
import { materialTypeLabels, type MaterialType } from '@/types/database';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const ManageMaterials = () => {
  const [orderIndex, setOrderIndex] = useState<number>(1);

  const { data: courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');

  const { data: semesters } = useSemesters(selectedCourseId);
  const { data: subjects } = useSubjects(selectedSemesterId);
  const { data: materials, isLoading, isError, error, refetch } = useMaterials(selectedSubjectId);
  const deleteMaterial = useDeleteMaterial();
  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    material_type: 'notes' as MaterialType,
  });

  /**
   * Resilient upload function with dynamic timeout, session refresh, and retry logic.
   * Prevents infinite loading when browser tabs are throttled or network stalls.
   */
  const uploadFileWithRetry = async (
    filePath: string,
    fileToUpload: File,
    maxRetries = 3
  ) => {
    // Dynamic timeout: at least 45 seconds, plus 30s per 10MB
    const timeoutMs = Math.max(45000, Math.ceil(fileToUpload.size / (10 * 1024 * 1024)) * 30000);
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Ensure Auth session is active and not expired before upload attempt
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          await supabase.auth.refreshSession();
        }

        const uploadPromise = supabase.storage
          .from('materials')
          .upload(filePath, fileToUpload, { upsert: true });

        let timerId: ReturnType<typeof setTimeout>;
        const timeoutPromise = new Promise<{ data: null; error: Error }>((_, reject) => {
          timerId = setTimeout(() => {
            reject(new Error(`Upload request timed out on attempt ${attempt} of ${maxRetries}`));
          }, timeoutMs);
        });

        try {
          const result = await Promise.race([uploadPromise, timeoutPromise]);
          if (result.error) throw result.error;
          return result.data;
        } finally {
          clearTimeout(timerId!);
        }
      } catch (err: unknown) {
        lastError = err;
        console.warn(`Upload attempt ${attempt} failed:`, err);
        if (attempt < maxRetries) {
          toast.info(`Upload stalled or interrupted. Retrying (${attempt}/${maxRetries})...`);
          await new Promise((res) => setTimeout(res, attempt * 1500));
        }
      }
    }

    throw lastError || new Error('Upload failed after multiple attempts');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId || !file) {
      toast.error('Please select a subject and upload a file');
      return;
    }
    setIsSaving(true);

    try {
      // 1. Upload file to storage with resilience
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${selectedSubjectId}/${fileName}`;

      await uploadFileWithRetry(filePath, file);

      // 2. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('materials').getPublicUrl(filePath);

      // 3. Create material record in database
      const { error: insertError } = await supabase.from('materials').insert({
        title: formData.title,
        description: formData.description,
        material_type: formData.material_type,
        subject_id: selectedSubjectId,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        order_index: orderIndex,
      });

      if (insertError) throw insertError;

      toast.success('Material uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', material_type: 'notes' });
      setFile(null);
      setOrderIndex(1);
    } catch (error: unknown) {
      console.error('Upload process error:', error);
      const message = error instanceof Error ? error.message : 'Failed to upload material. Please try again.';
      toast.error(message);
    } finally {
      // Always guarantee loading state is cleared
      setIsSaving(false);
    }
  };

  const handleDelete = async (materialId: string, materialTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${materialTitle}"?`)) {
      return;
    }

    try {
      await deleteMaterial.mutateAsync(materialId);
      toast.success('Material deleted successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete material';
      toast.error(message);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <Breadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Manage Materials' },
          ]}
        />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Manage Materials</h1>
            <p className="text-muted-foreground">
              Upload and manage study materials for each subject.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={!selectedSubjectId}>
                <Plus className="h-4 w-4" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Upload New Material</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Unit 1 Notes"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex">Unit Order / Index</Label>
                    <Input
                      id="orderIndex"
                      type="number"
                      min={1}
                      value={orderIndex}
                      onChange={(e) => setOrderIndex(Number(e.target.value))}
                      placeholder="e.g. 1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Material Type</Label>
                    <Select
                      value={formData.material_type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, material_type: v as MaterialType })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(materialTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the material"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      id="file"
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                      required
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      {file ? (
                        <p className="text-sm font-medium">{file.name}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Click to upload a file</p>
                      )}
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isSaving ? 'Uploading Material...' : 'Upload Material'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="space-y-2">
            <Label>Select Course</Label>
            <Select
              value={selectedCourseId}
              onValueChange={(v) => {
                setSelectedCourseId(v);
                setSelectedSemesterId('');
                setSelectedSubjectId('');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Semester</Label>
            <Select
              value={selectedSemesterId}
              onValueChange={(v) => {
                setSelectedSemesterId(v);
                setSelectedSubjectId('');
              }}
              disabled={!selectedCourseId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters?.map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select Subject</Label>
            <Select
              value={selectedSubjectId}
              onValueChange={setSelectedSubjectId}
              disabled={!selectedSemesterId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Materials List */}
        {selectedSubjectId && (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-12 bg-destructive/10 rounded-lg p-6">
                <p className="text-destructive font-medium mb-4">
                  Failed to load materials: {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <Button onClick={() => refetch()} variant="outline">
                  Retry Loading Materials
                </Button>
              </div>
            ) : materials?.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No materials found. Upload your first material.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {materials?.map((material) => (
                  <div key={material.id} className="relative">
                    <MaterialCard material={material} />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-4 right-4 gap-1"
                      onClick={() => handleDelete(material.id, material.title)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!selectedSubjectId && (
          <div className="text-center py-12 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">Select a course, semester, and subject to view materials.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageMaterials;

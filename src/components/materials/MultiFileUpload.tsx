import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialType, materialTypeLabels } from '@/types/database';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  FileArchive,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  FolderUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileQueueItem {
  id: string;
  file: File;
  title: string;
  materialType: MaterialType;
  orderIndex: number;
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
  publicUrl?: string;
}

export interface MultiFileUploadProps {
  subjectId: string;
  bucketName?: string;
  defaultMaterialType?: MaterialType;
  maxConcurrentUploads?: number;
  maxFileSizeBytes?: number; // default: 50MB
  allowedExtensions?: string[];
  onUploadSuccess?: () => void;
  className?: string;
}

const DEFAULT_EXTENSIONS = [
  '.pdf',
  '.docx',
  '.doc',
  '.pptx',
  '.ppt',
  '.xlsx',
  '.xls',
  '.txt',
  '.zip',
  '.png',
  '.jpg',
  '.jpeg',
];

// Helper: Format bytes to human readable format (KB, MB)
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper: Pick appropriate icon for file extension
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return <FileText className="w-6 h-6 text-red-500" />;
    case 'docx':
    case 'doc':
    case 'txt':
      return <FileText className="w-6 h-6 text-blue-500" />;
    case 'pptx':
    case 'ppt':
      return <FileSpreadsheet className="w-6 h-6 text-amber-500" />;
    case 'xlsx':
    case 'xls':
      return <FileSpreadsheet className="w-6 h-6 text-emerald-500" />;
    case 'zip':
    case 'rar':
      return <FileArchive className="w-6 h-6 text-purple-500" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return <ImageIcon className="w-6 h-6 text-indigo-500" />;
    default:
      return <File className="w-6 h-6 text-slate-500" />;
  }
};

// Helper: Clean file name to create a clean initial title
const getInitialTitle = (fileName: string): string => {
  const lastDot = fileName.lastIndexOf('.');
  const nameWithoutExt = lastDot !== -1 ? fileName.substring(0, lastDot) : fileName;
  // Replace underscores and hyphens with spaces and capitalize
  return nameWithoutExt
    .replace(/[-_]+/g, ' ')
    .trim();
};

export const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  subjectId,
  bucketName = 'materials',
  defaultMaterialType = 'notes',
  maxConcurrentUploads = 3,
  maxFileSizeBytes = 50 * 1024 * 1024, // 50MB
  allowedExtensions = DEFAULT_EXTENSIONS,
  onUploadSuccess,
  className,
}) => {
  const [queue, setQueue] = useState<FileQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [bulkMaterialType, setBulkMaterialType] = useState<MaterialType>(defaultMaterialType);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate and add files to the upload queue
  const addFilesToQueue = (files: FileList | File[]) => {
    const newItems: FileQueueItem[] = [];
    const rejectedFiles: string[] = [];

    Array.from(files).forEach((file, index) => {
      // 1. Check file size
      if (file.size > maxFileSizeBytes) {
        rejectedFiles.push(`${file.name} (exceeds ${formatBytes(maxFileSizeBytes)})`);
        return;
      }

      // 2. Check extension
      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');
      if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
        rejectedFiles.push(`${file.name} (unsupported format)`);
        return;
      }

      // 3. Prevent duplicate files in current queue
      const isDuplicate = queue.some(
        (item) => item.file.name === file.name && item.file.size === file.size
      );
      if (isDuplicate) {
        return;
      }

      newItems.push({
        id: `${Date.now()}-${index}-${Math.random().toString(36).substring(5)}`,
        file,
        title: getInitialTitle(file.name),
        materialType: bulkMaterialType,
        orderIndex: queue.length + newItems.length + 1,
        progress: 0,
        status: 'idle',
      });
    });

    if (rejectedFiles.length > 0) {
      toast.warning(`Skipped ${rejectedFiles.length} file(s):\n${rejectedFiles.slice(0, 3).join(', ')}${rejectedFiles.length > 3 ? '...' : ''}`);
    }

    if (newItems.length > 0) {
      setQueue((prev) => [...prev, ...newItems]);
      toast.info(`Added ${newItems.length} file(s) to the queue.`);
    }
  };

  // Drag and drop event handlers
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        addFilesToQueue(e.dataTransfer.files);
      }
    },
    [queue, bulkMaterialType, maxFileSizeBytes]
  );

  // Manual file input selection handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      // Reset input value so same files can be re-selected if removed
      e.target.value = '';
    }
  };

  // Queue item manipulation
  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItemTitle = (id: string, newTitle: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const updateItemType = (id: string, newType: MaterialType) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, materialType: newType } : item))
    );
  };

  const updateBulkMaterialType = (newType: MaterialType) => {
    setBulkMaterialType(newType);
    // Also update any pending/idle items in queue
    setQueue((prev) =>
      prev.map((item) => (item.status === 'idle' ? { ...item, materialType: newType } : item))
    );
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((item) => item.status !== 'success'));
  };

  const clearAll = () => {
    if (isUploading) return;
    setQueue([]);
  };

  // Upload single item to Supabase Storage & Database
  const uploadSingleItem = async (item: FileQueueItem): Promise<{ success: boolean; error?: string }> => {
    const updateProgress = (pct: number) => {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, progress: pct, status: 'uploading' } : q))
      );
    };

    try {
      updateProgress(10);

      // Verify and refresh auth session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        await supabase.auth.refreshSession();
      }

      updateProgress(25);

      // Sanitize file path for Supabase Storage
      const fileExt = item.file.name.split('.').pop() || 'bin';
      const cleanBaseName = item.file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanBaseName}.${fileExt}`;
      const filePath = `${subjectId}/${uniqueFileName}`;

      updateProgress(45);

      // 1. Upload to Supabase Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, item.file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Storage upload failed');
      }

      updateProgress(75);

      // 2. Retrieve public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      updateProgress(85);

      // 3. Insert metadata into public.materials table
      const { error: insertError } = await supabase.from('materials').insert({
        title: item.title.trim() || item.file.name,
        description: `Uploaded via bulk upload (${item.file.name})`,
        subject_id: subjectId,
        material_type: item.materialType,
        file_url: publicUrl,
        file_name: item.file.name,
        file_size: item.file.size,
        file_type: item.file.type || `application/${fileExt}`,
        order_index: item.orderIndex,
      });

      if (insertError) {
        throw new Error(insertError.message || 'Failed to save database record');
      }

      updateProgress(100);

      // Mark success
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, status: 'success', progress: 100, publicUrl }
            : q
        )
      );

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown upload error';
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? { ...q, status: 'error', progress: 0, errorMessage: message }
            : q
        )
      );
      return { success: false, error: message };
    }
  };

  // Upload all pending items in parallel with controlled concurrency
  const handleUploadAll = async () => {
    if (!subjectId) {
      toast.error('Please select a subject first.');
      return;
    }

    const pendingItems = queue.filter((item) => item.status === 'idle' || item.status === 'error');
    if (pendingItems.length === 0) {
      toast.info('No pending files to upload.');
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    // Parallel queue worker with concurrency pool
    const pool = [...pendingItems];
    const executing: Promise<void>[] = [];

    const worker = async (item: FileQueueItem) => {
      const res = await uploadSingleItem(item);
      if (res.success) {
        successCount++;
      } else {
        failCount++;
      }
    };

    while (pool.length > 0 || executing.length > 0) {
      while (pool.length > 0 && executing.length < maxConcurrentUploads) {
        const item = pool.shift();
        if (item) {
          const p = worker(item).then(() => {
            const index = executing.indexOf(p);
            if (index > -1) executing.splice(index, 1);
          });
          executing.push(p);
        }
      }
      if (executing.length > 0) {
        await Promise.race(executing);
      }
    }

    setIsUploading(false);

    // Provide user feedback
    if (failCount === 0 && successCount > 0) {
      toast.success(`Successfully uploaded all ${successCount} file(s)!`);
      if (onUploadSuccess) onUploadSuccess();
    } else if (successCount > 0 && failCount > 0) {
      toast.warning(`Uploaded ${successCount} file(s), but ${failCount} file(s) failed.`);
      if (onUploadSuccess) onUploadSuccess();
    } else if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} file(s). Please review errors and retry.`);
    }
  };

  const pendingCount = queue.filter((i) => i.status === 'idle').length;
  const completedCount = queue.filter((i) => i.status === 'success').length;
  const totalBytes = queue.reduce((acc, i) => acc + i.file.size, 0);

  return (
    <div className={cn('space-y-6', className)}>
      {/* 1. Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer text-center group flex flex-col items-center justify-center gap-3',
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-muted-foreground/30 hover:border-primary/70 hover:bg-muted/30 bg-card',
          isUploading && 'pointer-events-none opacity-60'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={allowedExtensions.join(',')}
          onChange={handleFileInputChange}
          disabled={isUploading}
        />

        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div>
          <h4 className="font-semibold text-base sm:text-lg">
            Drag & drop files here, or <span className="text-primary underline">browse</span>
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Supports multiple PDFs, DOCX, PPTX, images, and archives up to {formatBytes(maxFileSizeBytes)} each
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1">
          {allowedExtensions.slice(0, 6).map((ext) => (
            <span
              key={ext}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border uppercase"
            >
              {ext.replace('.', '')}
            </span>
          ))}
          {allowedExtensions.length > 6 && (
            <span className="text-[11px] text-muted-foreground">
              +{allowedExtensions.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* 2. Global Batch Controls */}
      {queue.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/40 border">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                Queue ({queue.length} files • {formatBytes(totalBytes)})
              </span>
              {completedCount > 0 && (
                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                  {completedCount} Uploaded
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Configure titles and material categories before starting upload.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Bulk Material Type Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Default Type:</span>
              <Select
                value={bulkMaterialType}
                onValueChange={(val) => updateBulkMaterialType(val as MaterialType)}
                disabled={isUploading}
              >
                <SelectTrigger className="h-8 text-xs w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(materialTypeLabels).map(([type, label]) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={clearCompleted}
                disabled={isUploading}
              >
                Clear Done
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={clearAll}
              disabled={isUploading || queue.length === 0}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Clear All
            </Button>

            <Button
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5"
              onClick={handleUploadAll}
              disabled={isUploading || pendingCount === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <FolderUp className="w-3.5 h-3.5" />
                  Upload {pendingCount > 0 ? `${pendingCount} File(s)` : 'All'}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* 3. Selected Files Queue List */}
      {queue.length > 0 && (
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className={cn(
                'group relative flex flex-col gap-2 p-3 sm:p-4 rounded-xl border bg-card transition-all',
                item.status === 'success' && 'border-emerald-500/40 bg-emerald-500/5',
                item.status === 'error' && 'border-destructive/40 bg-destructive/5',
                item.status === 'uploading' && 'border-primary/40'
              )}
            >
              <div className="flex items-start justify-between gap-3">
                {/* File Icon & Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-muted/60 shrink-0">
                    {getFileIcon(item.file.name)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Title Input & Raw Filename */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Input
                        value={item.title}
                        onChange={(e) => updateItemTitle(item.id, e.target.value)}
                        disabled={item.status === 'uploading' || item.status === 'success'}
                        placeholder="Material title..."
                        className="h-8 text-xs sm:text-sm font-medium"
                      />
                      <span className="text-[11px] text-muted-foreground truncate shrink-0 max-w-[180px]">
                        ({item.file.name})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{formatBytes(item.file.size)}</span>
                      <span>•</span>
                      {/* Individual Material Type Selector */}
                      <Select
                        value={item.materialType}
                        onValueChange={(val) => updateItemType(item.id, val as MaterialType)}
                        disabled={item.status === 'uploading' || item.status === 'success'}
                      >
                        <SelectTrigger className="h-6 text-[11px] w-[110px] px-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(materialTypeLabels).map(([type, label]) => (
                            <SelectItem key={type} value={type} className="text-xs">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'idle' && (
                    <Badge variant="secondary" className="text-xs">
                      Ready
                    </Badge>
                  )}
                  {item.status === 'uploading' && (
                    <Badge variant="outline" className="text-xs text-primary border-primary/30 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {item.progress}%
                    </Badge>
                  )}
                  {item.status === 'success' && (
                    <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Done
                    </Badge>
                  )}
                  {item.status === 'error' && (
                    <Badge variant="destructive" className="text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Failed
                    </Badge>
                  )}

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    disabled={item.status === 'uploading'}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar (Visible while uploading or on error/complete) */}
              {(item.status === 'uploading' || item.status === 'success') && (
                <div className="w-full space-y-1 pt-1">
                  <Progress value={item.progress} className="h-1.5" />
                </div>
              )}

              {/* Error message display if failed */}
              {item.status === 'error' && item.errorMessage && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {item.errorMessage}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;

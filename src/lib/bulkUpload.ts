import { supabase } from '@/integrations/supabase/client';
import { MaterialType } from '@/types/database';

export interface BulkUploadItemInput {
  file: File;
  title: string;
  materialType: MaterialType;
  orderIndex?: number;
  description?: string;
}

export interface BulkUploadResult {
  fileName: string;
  title: string;
  publicUrl?: string;
  materialId?: string;
  success: boolean;
  error?: string;
}

export interface BulkUploadOptions {
  bucketName?: string;
  concurrency?: number;
  onItemProgress?: (fileName: string, progress: number) => void;
  onItemComplete?: (result: BulkUploadResult) => void;
}

/**
 * Uploads a single study material file to Supabase Storage and records metadata in the database.
 */
export async function uploadSingleMaterial(
  subjectId: string,
  item: BulkUploadItemInput,
  options: { bucketName?: string } = {}
): Promise<BulkUploadResult> {
  const { bucketName = 'materials' } = options;

  try {
    // 1. Ensure valid auth session
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      await supabase.auth.refreshSession();
    }

    // 2. Generate clean unique storage file path
    const fileExt = item.file.name.split('.').pop() || 'bin';
    const cleanBaseName = item.file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${cleanBaseName}.${fileExt}`;
    const filePath = `${subjectId}/${uniqueFileName}`;

    // 3. Upload file to Supabase storage bucket
    const { error: storageError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, item.file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (storageError) {
      throw new Error(`Storage upload failed: ${storageError.message}`);
    }

    // 4. Retrieve public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    // 5. Insert record into public.materials table
    const { data: insertedData, error: dbError } = await supabase
      .from('materials')
      .insert({
        title: item.title.trim() || item.file.name,
        description: item.description || `Uploaded via bulk upload (${item.file.name})`,
        subject_id: subjectId,
        material_type: item.materialType,
        file_url: publicUrl,
        file_name: item.file.name,
        file_size: item.file.size,
        file_type: item.file.type || `application/${fileExt}`,
        order_index: item.orderIndex ?? 1,
      })
      .select('id')
      .single();

    if (dbError) {
      throw new Error(`Database record creation failed: ${dbError.message}`);
    }

    return {
      fileName: item.file.name,
      title: item.title,
      publicUrl,
      materialId: insertedData?.id,
      success: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during upload';
    return {
      fileName: item.file.name,
      title: item.title,
      success: false,
      error: message,
    };
  }
}

/**
 * Uploads a list of files in parallel with controlled concurrency to prevent throttling.
 */
export async function uploadMaterialsInBulk(
  subjectId: string,
  items: BulkUploadItemInput[],
  options: BulkUploadOptions = {}
): Promise<BulkUploadResult[]> {
  const { concurrency = 3, bucketName = 'materials', onItemProgress, onItemComplete } = options;
  const results: BulkUploadResult[] = [];
  const queue = [...items];
  const activeWorkers: Promise<void>[] = [];

  const processItem = async (item: BulkUploadItemInput) => {
    onItemProgress?.(item.file.name, 10);
    const result = await uploadSingleMaterial(subjectId, item, { bucketName });
    onItemProgress?.(item.file.name, 100);
    results.push(result);
    onItemComplete?.(result);
  };

  while (queue.length > 0 || activeWorkers.length > 0) {
    while (queue.length > 0 && activeWorkers.length < concurrency) {
      const item = queue.shift();
      if (item) {
        const workerPromise = processItem(item).then(() => {
          const idx = activeWorkers.indexOf(workerPromise);
          if (idx !== -1) activeWorkers.splice(idx, 1);
        });
        activeWorkers.push(workerPromise);
      }
    }

    if (activeWorkers.length > 0) {
      await Promise.race(activeWorkers);
    }
  }

  return results;
}

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, FileSpreadsheet, Image } from 'lucide-react';
import type { Material } from '@/types/database';
import { materialTypeLabels } from '@/types/database';
import { useState, useEffect } from 'react';
import { useIncrementDownload } from '@/hooks/useCourses';

const fileTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'application/pdf': FileText,
  'application/vnd.ms-powerpoint': FileSpreadsheet,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': FileSpreadsheet,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'image/jpeg': Image,
  'image/png': Image,
};

interface MaterialCardProps {
  material: Material;
}

export function MaterialCard({ material }: MaterialCardProps) {
  const incrementDownload = useIncrementDownload();
  const [localDownloads, setLocalDownloads] = useState(material.download_count || 0);

  useEffect(() => {
    setLocalDownloads(material.download_count || 0);
  }, [material.download_count]);

  const IconComponent = material.file_type 
    ? (fileTypeIcons[material.file_type] || File)
    : File;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  const handleDownloadClick = () => {
    setLocalDownloads(prev => prev + 1);
    incrementDownload.mutate(material.id);
  };

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:border-primary/20 border-border/50 bg-card/65 backdrop-blur-md">
      <CardContent className="p-4.5">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-[10px] font-bold tracking-wider px-2 py-0">
                {getFileExtension(material.file_name)}
              </Badge>
              <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0">
                {materialTypeLabels[material.material_type]}
              </Badge>
            </div>
            
            <h4 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">
              {material.title}
            </h4>
            
            {material.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {material.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-medium">
              <span>{formatFileSize(material.file_size)}</span>
              <span>•</span>
              <span className="text-foreground/70">{localDownloads} {localDownloads === 1 ? 'download' : 'downloads'}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            className="shrink-0 transition-all hover:bg-primary hover:text-primary-foreground rounded-xl border-border/60 font-semibold"
            onClick={handleDownloadClick}
            asChild
          >
            <a href={material.file_url} download target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Download className="h-4 w-4 mr-1.5" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

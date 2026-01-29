import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText, File, FileSpreadsheet, Image } from 'lucide-react';
import type { Material } from '@/types/database';
import { materialTypeLabels } from '@/types/database';

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

  return (
    <Card className="group transition-all duration-300 hover:shadow-card-hover border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
            <IconComponent className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs">
                {getFileExtension(material.file_name)}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {materialTypeLabels[material.material_type]}
              </Badge>
            </div>
            
            <h4 className="font-medium text-sm mb-1 truncate group-hover:text-primary transition-colors">
              {material.title}
            </h4>
            
            {material.description && (
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                {material.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatFileSize(material.file_size)}</span>
              <span>•</span>
              <span>{material.download_count} downloads</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            variant="outline"
            className="shrink-0 transition-all hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <a href={material.file_url} download target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1" />
              Download
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

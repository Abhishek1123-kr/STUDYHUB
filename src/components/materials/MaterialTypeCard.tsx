import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Presentation, BookOpen, FlaskConical, ClipboardList, Files, ArrowRight } from 'lucide-react';
import type { MaterialType } from '@/types/database';
import { materialTypeLabels } from '@/types/database';

const iconMap: Record<MaterialType, React.ComponentType<{ className?: string }>> = {
  assignment: FileText,
  ppt: Presentation,
  notes: BookOpen,
  lab_manual: FlaskConical,
  syllabus: ClipboardList,
  other: Files,
};

const colorMap: Record<MaterialType, string> = {
  assignment: 'bg-blue-500/10 text-blue-600',
  ppt: 'bg-orange-500/10 text-orange-600',
  notes: 'bg-green-500/10 text-green-600',
  lab_manual: 'bg-purple-500/10 text-purple-600',
  syllabus: 'bg-red-500/10 text-red-600',
  other: 'bg-gray-500/10 text-gray-600',
};

interface MaterialTypeCardProps {
  type: MaterialType;
  count: number;
  to: string;
}

export function MaterialTypeCard({ type, count, to }: MaterialTypeCardProps) {
  const IconComponent = iconMap[type];
  const colorClasses = colorMap[type];

  return (
    <Link to={to}>
      <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${colorClasses}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            <Badge variant="secondary" className="font-medium">
              {count} {count === 1 ? 'file' : 'files'}
            </Badge>
          </div>
          
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {materialTypeLabels[type]}
          </h3>
          
          <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            <span>Browse</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

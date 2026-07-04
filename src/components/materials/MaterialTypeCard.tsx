import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Presentation, BookOpen, FlaskConical, ClipboardList, Files, ArrowRight } from 'lucide-react';
import type { MaterialType } from '@/types/database';
import { materialTypeLabels } from '@/types/database';
import { useState } from 'react';

const iconMap: Record<MaterialType, React.ComponentType<{ className?: string }>> = {
  assignment: FileText,
  ppt: Presentation,
  notes: BookOpen,
  lab_manual: FlaskConical,
  syllabus: ClipboardList,
  other: Files,
};

const colorMap: Record<MaterialType, { bg: string; text: string; glow: string; border: string }> = {
  assignment: { 
    bg: 'bg-blue-500/10 dark:bg-blue-500/15', 
    text: 'text-blue-600 dark:text-blue-400',
    glow: 'rgba(59, 130, 246, 0.12)',
    border: 'group-hover:border-blue-500/20'
  },
  ppt: { 
    bg: 'bg-orange-500/10 dark:bg-orange-500/15', 
    text: 'text-orange-600 dark:text-orange-400',
    glow: 'rgba(249, 115, 22, 0.12)',
    border: 'group-hover:border-orange-500/20'
  },
  notes: { 
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', 
    text: 'text-emerald-600 dark:text-emerald-400',
    glow: 'rgba(16, 185, 129, 0.12)',
    border: 'group-hover:border-emerald-500/20'
  },
  lab_manual: { 
    bg: 'bg-purple-500/10 dark:bg-purple-500/15', 
    text: 'text-purple-600 dark:text-purple-400',
    glow: 'rgba(168, 85, 247, 0.12)',
    border: 'group-hover:border-purple-500/20'
  },
  syllabus: { 
    bg: 'bg-rose-500/10 dark:bg-rose-500/15', 
    text: 'text-rose-600 dark:text-rose-400',
    glow: 'rgba(244, 63, 94, 0.12)',
    border: 'group-hover:border-rose-500/20'
  },
  other: { 
    bg: 'bg-slate-500/10 dark:bg-slate-500/15', 
    text: 'text-slate-600 dark:text-slate-400',
    glow: 'rgba(100, 116, 139, 0.12)',
    border: 'group-hover:border-slate-500/20'
  },
};

interface MaterialTypeCardProps {
  type: MaterialType;
  count: number;
  to: string;
}

export function MaterialTypeCard({ type, count, to }: MaterialTypeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[type];
  const colorClasses = colorMap[type];

  return (
    <Link to={to}>
      <Card 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group h-full transition-all duration-300 border-border/50 bg-card/65 backdrop-blur-md overflow-hidden ${colorClasses.border}`}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? `0 12px 30px -4px ${colorClasses.glow}` : 'none',
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
              isHovered ? 'scale-110 rotate-3' : ''
            } ${colorClasses.bg} ${colorClasses.text}`}>
              <IconComponent className="h-6 w-6" />
            </div>
            
            <Badge 
              variant="secondary" 
              className="font-semibold px-2.5 py-0.5 rounded-lg border border-border/40 text-xs bg-muted/40"
            >
              {count} {count === 1 ? 'file' : 'files'}
            </Badge>
          </div>
          
          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">
            {materialTypeLabels[type]}
          </h3>
          
          <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
            <span>Browse</span>
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

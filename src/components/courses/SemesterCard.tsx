import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import type { Semester } from '@/types/database';
import { useState } from 'react';

interface SemesterCardProps {
  semester: Semester;
  courseId: string;
}

export function SemesterCard({ semester, courseId }: SemesterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = semester.is_active;

  return (
    <Link
      to={isActive ? `/courses/${courseId}/semesters/${semester.id}` : '#'}
      className={!isActive ? 'cursor-not-allowed pointer-events-none' : ''}
    >
      <Card
        onMouseEnter={() => isActive && setIsHovered(true)}
        onMouseLeave={() => isActive && setIsHovered(false)}
        className={`group h-full transition-all duration-300 border-border/50 bg-card/65 backdrop-blur-md overflow-hidden ${isActive
            ? 'cursor-pointer hover:border-primary/20'
            : 'opacity-50 border-dashed border-2 bg-muted/10'
          }`}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? '0 12px 30px -4px rgba(99, 102, 241, 0.12), 0 4px 10px -2px rgba(99, 102, 241, 0.06)' : 'none',
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold transition-all duration-300 ${isActive
                ? 'bg-primary/10 text-primary scale-100 group-hover:scale-110'
                : 'bg-muted text-muted-foreground'
              }`}>
              {semester.number}
            </div>

            {!isActive ? (
              <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 border border-border/40 text-xs rounded-lg">
                <Lock className="h-3 w-3 text-muted-foreground" />
                <span>Coming Soon</span>
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 gap-1 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 font-medium text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Active</span>
              </Badge>
            )}
          </div>

          <h3 className={`font-display font-bold text-lg mb-2 transition-colors ${isActive ? 'group-hover:text-primary' : 'text-muted-foreground'
            }`}>
            {semester.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground/80 mb-5">
            <Calendar className="h-4 w-4 text-muted-foreground/60" />
            <span>Semester {semester.number}</span>
          </div>

          {isActive && (
            <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
              <span>View Subjects</span>
              <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

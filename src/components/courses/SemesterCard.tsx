import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowRight, Lock } from 'lucide-react';
import type { Semester } from '@/types/database';

interface SemesterCardProps {
  semester: Semester;
  courseId: string;
}

export function SemesterCard({ semester, courseId }: SemesterCardProps) {
  const isActive = semester.is_active;

  return (
    <Link 
      to={isActive ? `/courses/${courseId}/semesters/${semester.id}` : '#'}
      className={!isActive ? 'cursor-not-allowed' : ''}
    >
      <Card 
        className={`group h-full transition-all duration-300 border-border/50 overflow-hidden ${
          isActive 
            ? 'hover:shadow-card-hover hover:-translate-y-1' 
            : 'opacity-60 bg-muted/30'
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-bold transition-transform duration-300 ${
              isActive 
                ? 'bg-primary/10 text-primary group-hover:scale-110' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {semester.number}
            </div>
            {!isActive && (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" />
                Coming Soon
              </Badge>
            )}
            {isActive && (
              <Badge className="bg-secondary text-secondary-foreground">
                Active
              </Badge>
            )}
          </div>
          
          <h3 className={`font-display font-semibold text-lg mb-2 transition-colors ${
            isActive ? 'group-hover:text-primary' : ''
          }`}>
            {semester.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Semester {semester.number}</span>
          </div>
          
          {isActive && (
            <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
              <span>View Subjects</span>
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

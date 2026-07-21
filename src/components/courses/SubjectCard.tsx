import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Settings, Network, Code, Trophy, Calculator, Users, Cpu, Book } from 'lucide-react';
import type { Subject } from '@/types/database';
import { useState } from 'react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Network,
  Code,
  Trophy,
  Calculator,
  Users,
  Cpu,
  Book,
};

interface SubjectCardProps {
  subject: Subject;
  courseId: string;
  semesterId: string;
}

export function SubjectCard({ subject, courseId, semesterId }: SubjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[subject.icon] || Book;

  return (
    <Link to={`/courses/${courseId}/semesters/${semesterId}/subjects/${subject.id}`}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group h-full transition-all duration-300 border-border/50 bg-card/65 backdrop-blur-md hover:border-primary/20"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? '0 12px 30px -4px rgba(99, 102, 241, 0.12), 0 4px 10px -2px rgba(99, 102, 241, 0.06)' : 'none',
        }}
      >
        <CardHeader className="pb-3 pt-6">
          <div className="flex items-start justify-between">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${isHovered ? 'bg-primary/20 scale-110 rotate-3' : 'bg-primary/10'
                }`}
            >
              <IconComponent className="h-5 w-5 text-primary" />
            </div>

            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 rounded-lg border-primary/20 bg-primary/5 text-primary"
            >
              {subject.credits} Credits
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs font-mono font-medium rounded-md px-2 py-0">
              {subject.code}
            </Badge>
          </div>
          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {subject.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed h-10">
            {subject.description || 'Access study materials for this subject.'}
          </p>
          <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-1.5 transition-all">
            <span>View Materials</span>
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Settings, Network, Code, Trophy, Calculator, Users, Cpu, Book } from 'lucide-react';
import type { Subject } from '@/types/database';

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
  const IconComponent = iconMap[subject.icon] || Book;

  return (
    <Link to={`/courses/${courseId}/semesters/${semesterId}/subjects/${subject.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="outline" className="text-xs">
              {subject.credits} Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <Badge variant="secondary" className="text-xs mb-2">
              {subject.code}
            </Badge>
          </div>
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {subject.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {subject.description || 'Access study materials for this subject.'}
          </p>
          <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            <span>View Materials</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

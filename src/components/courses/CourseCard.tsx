import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cpu, Brain, Database, Shield, BarChart3, Link as LinkIcon, Cloud, BookOpen } from 'lucide-react';
import type { Course } from '@/types/database';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Brain,
  Database,
  Shield,
  BarChart3,
  Link: LinkIcon,
  Cloud,
  BookOpen,
};

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const IconComponent = iconMap[course.icon] || BookOpen;

  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="group h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 overflow-hidden">
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: course.color }}
        />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${course.color}15` }}
            >
              <IconComponent 
                className="h-6 w-6 transition-colors"
                style={{ color: course.color }}
              />
            </div>
            <Badge variant="secondary" className="text-xs font-medium">
              {course.code}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {course.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description || 'Explore comprehensive study materials for this course.'}
          </p>
          <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
            <span>View Semesters</span>
            <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

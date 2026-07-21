import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cpu, Brain, Database, Shield, BarChart3, Link as LinkIcon, Cloud, BookOpen } from 'lucide-react';
import type { Course } from '@/types/database';
import { useState } from 'react';

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

// Helper to convert hex to rgba for dynamic glow effects
const hexToRgba = (hex: string, alpha: number) => {
  try {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch (e) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
};

export function CourseCard({ course }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[course.icon] || BookOpen;

  const defaultColor = course.color || '#1e40af';
  const glowShadow = hexToRgba(defaultColor, 0.15);
  const subtleBackground = hexToRgba(defaultColor, 0.08);

  return (
    <Link to={`/courses/${course.id}`}>
      <Card
        className="group h-full transition-all duration-300 border-border/50 bg-card/65 backdrop-blur-md overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'none',
          boxShadow: isHovered ? `0 12px 30px -4px ${glowShadow}, 0 4px 10px -2px ${hexToRgba(defaultColor, 0.1)}` : 'none',
          borderColor: isHovered ? defaultColor : undefined,
        }}
      >
        {/* Dynamic color stripe at the top */}
        <div
          className="h-1.5 w-full transition-all duration-300"
          style={{
            backgroundColor: defaultColor,
            opacity: isHovered ? 1 : 0.8
          }}
        />

        <CardHeader className="pb-3 pt-6">
          <div className="flex items-start justify-between">
            {/* Dynamic shape enclosing icon with course theme color background */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
              style={{
                backgroundColor: isHovered ? hexToRgba(defaultColor, 0.15) : subtleBackground,
                transform: isHovered ? 'scale(1.1) rotate(2deg)' : 'none',
              }}
            >
              <IconComponent
                className="h-6 w-6 transition-colors"
                style={{ color: defaultColor }}
              />
            </div>

            <Badge
              variant="outline"
              className="text-xs font-semibold px-2.5 py-0.5 rounded-lg border-border/50 bg-muted/50"
              style={{
                borderColor: isHovered ? hexToRgba(defaultColor, 0.4) : undefined,
                color: isHovered ? defaultColor : undefined
              }}
            >
              {course.code}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {course.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-5 leading-relaxed h-10">
            {course.description || 'Explore comprehensive study materials for this course.'}
          </p>

          <div
            className="flex items-center text-sm font-semibold transition-all duration-300"
            style={{ color: defaultColor }}
          >
            <span>View Semesters</span>
            <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

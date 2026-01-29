import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from '@/components/courses/CourseCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeaturedCourses() {
  const { data: courses, isLoading } = useCourses();

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold mb-4">
            Explore Our Courses
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from a variety of Computer Science specializations. Each course contains 
            comprehensive materials organized by semester.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses?.map((course, index) => (
              <div 
                key={course.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

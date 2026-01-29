import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { CourseCard } from '@/components/courses/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';

const Courses = () => {
  const { data: courses, isLoading } = useCourses();

  return (
    <Layout>
      <div className="container py-8">
        <Breadcrumbs items={[{ label: 'Courses' }]} />
        
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">All Courses</h1>
          <p className="text-muted-foreground">
            Select a course to explore semesters and study materials.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses?.map((course, index) => (
              <div 
                key={course.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Courses;

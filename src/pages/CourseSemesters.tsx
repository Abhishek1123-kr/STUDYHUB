import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { SemesterCard } from '@/components/courses/SemesterCard';
import { useCourse, useSemesters } from '@/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';

const CourseSemesters = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading: courseLoading } = useCourse(courseId);
  const { data: semesters, isLoading: semestersLoading } = useSemesters(courseId);

  const isLoading = courseLoading || semestersLoading;

  return (
    <Layout>
      <div className="container py-8">
        {courseLoading ? (
          <Skeleton className="h-6 w-48 mb-6" />
        ) : (
          <Breadcrumbs 
            items={[
              { label: 'Courses', href: '/courses' },
              { label: course?.name || '' },
            ]} 
          />
        )}
        
        <div className="mb-8">
          {courseLoading ? (
            <>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold mb-2">{course?.name}</h1>
              <p className="text-muted-foreground">
                {course?.description || 'Select a semester to view subjects and materials.'}
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {semesters?.map((semester, index) => (
              <div 
                key={semester.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SemesterCard semester={semester} courseId={courseId!} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseSemesters;

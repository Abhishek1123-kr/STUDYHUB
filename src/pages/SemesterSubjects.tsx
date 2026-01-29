import { useParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { SubjectCard } from '@/components/courses/SubjectCard';
import { useSemester, useSubjects } from '@/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';

const SemesterSubjects = () => {
  const { courseId, semesterId } = useParams<{ courseId: string; semesterId: string }>();
  const { data: semester, isLoading: semesterLoading } = useSemester(semesterId);
  const { data: subjects, isLoading: subjectsLoading } = useSubjects(semesterId);

  const isLoading = semesterLoading || subjectsLoading;
  const course = semester?.courses;

  return (
    <Layout>
      <div className="container py-8">
        {semesterLoading ? (
          <Skeleton className="h-6 w-64 mb-6" />
        ) : (
          <Breadcrumbs 
            items={[
              { label: 'Courses', href: '/courses' },
              { label: course?.name || '', href: `/courses/${courseId}` },
              { label: semester?.name || '' },
            ]} 
          />
        )}
        
        <div className="mb-8">
          {semesterLoading ? (
            <>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl font-bold mb-2">
                {semester?.name} - {course?.name}
              </h1>
              <p className="text-muted-foreground">
                Select a subject to access study materials.
              </p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-52 w-full rounded-lg" />
            ))}
          </div>
        ) : subjects?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subjects available for this semester yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map((subject, index) => (
              <div 
                key={subject.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <SubjectCard 
                  subject={subject} 
                  courseId={courseId!} 
                  semesterId={semesterId!} 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SemesterSubjects;

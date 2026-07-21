import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { MaterialTypeCard } from '@/components/materials/MaterialTypeCard';
import { MaterialCard } from '@/components/materials/MaterialCard';
import { useSubject, useMaterials, useSemester } from '@/hooks/useCourses';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { MaterialType } from '@/types/database';
import { materialTypeLabels } from '@/types/database';

const materialTypes: MaterialType[] = [
  'assignment',
  'ppt',
  'notes',
  'lab_manual',
  'syllabus',
  'other',
];

const SubjectMaterials = () => {
  const { courseId, semesterId, subjectId } = useParams<{
    courseId: string;
    semesterId: string;
    subjectId: string;
  }>();

  const [searchParams] = useSearchParams();
  const selectedType = searchParams.get('type') as MaterialType | null;

  const { data: subject, isLoading: subjectLoading } = useSubject(subjectId);
  const { data: urlSemester, isLoading: semesterLoading } = useSemester(semesterId);
  const { data: materials, isLoading: materialsLoading } = useMaterials(
    subjectId,
    selectedType || undefined
  );
  const { data: allMaterials } = useMaterials(subjectId);

  const isLoading = subjectLoading || materialsLoading || semesterLoading;
  const semester = urlSemester || subject?.semesters;
  const course = urlSemester?.courses || semester?.courses;

  /* ===============================
     COUNT MATERIALS BY TYPE
     =============================== */
  const materialCounts =
    allMaterials?.reduce((acc, m) => {
      acc[m.material_type] = (acc[m.material_type] || 0) + 1;
      return acc;
    }, {} as Record<MaterialType, number>) || {};

  /* ===============================
     CHAPTER-WISE LOGIC (KEY PART)
     =============================== */

  // 1️⃣ Sort materials by chapter order
  const sortedMaterials = [...(materials ?? [])].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)
  );

  // 2️⃣ Group materials by chapter
  const groupedByChapter = sortedMaterials.reduce(
    (acc: Record<number, typeof sortedMaterials>, material) => {
      const chapter = material.order_index ?? 0;
      if (!acc[chapter]) acc[chapter] = [];
      acc[chapter].push(material);
      return acc;
    },
    {}
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* ===============================
            BREADCRUMBS
           =============================== */}
        {subjectLoading || semesterLoading ? (
          <Skeleton className="h-6 w-80 mb-6" />
        ) : (
          <Breadcrumbs
            items={[
              { label: 'Courses', href: '/courses' },
              { label: course?.name || '', href: `/courses/${courseId}` },
              {
                label: semester?.name || '',
                href: `/courses/${courseId}/semesters/${semesterId}`,
              },
              { label: subject?.name || '' },
            ]}
          />
        )}

        {/* ===============================
            SUBJECT HEADER
           =============================== */}
        <div className="mb-8">
          {subjectLoading ? (
            <>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold">
                  {subject?.name}
                </h1>
                <Badge variant="secondary">{subject?.code}</Badge>
              </div>
              <p className="text-muted-foreground">
                {subject?.description ||
                  'Access all study materials for this subject.'}
              </p>
            </>
          )}
        </div>

        {/* ===============================
            WHEN MATERIAL TYPE IS SELECTED
            → CHAPTER-WISE VIEW
           =============================== */}
        {selectedType ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <Link
                to={`/courses/${courseId}/semesters/${semesterId}/subjects/${subjectId}`}
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Categories
                </Button>
              </Link>
              <h2 className="font-display text-xl font-semibold">
                {materialTypeLabels[selectedType]}
              </h2>
            </div>

            {materialsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : Object.keys(groupedByChapter).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">
                  No {materialTypeLabels[selectedType].toLowerCase()} available
                  yet.
                </p>
              </div>
            ) : (
              Object.entries(groupedByChapter)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([chapter, chapterMaterials], index) => (
                  <div key={chapter} className="mb-10">
                    <h3 className="font-display text-lg font-semibold mb-4">
                      {/* Chapter{chapter} */}
                    </h3>

                    <div className="space-y-4">
                      {chapterMaterials.map((material, matIndex) => (
                        <div
                          key={material.id}
                          className="animate-fade-in"
                          style={{
                            animationDelay: `${index * 0.1 + matIndex * 0.05
                              }s`,
                          }}
                        >
                          <MaterialCard material={material} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          /* ===============================
             MATERIAL TYPE CATEGORY VIEW
             =============================== */
          <div>
            <h2 className="font-display text-xl font-semibold mb-6">
              Study Materials
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {materialTypes.map((type, index) => (
                  <div
                    key={type}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MaterialTypeCard
                      type={type}
                      count={materialCounts[type] || 0}
                      to={`/courses/${courseId}/semesters/${semesterId}/subjects/${subjectId}?type=${type}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubjectMaterials;

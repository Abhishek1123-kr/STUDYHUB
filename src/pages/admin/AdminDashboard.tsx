import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCourses } from '@/hooks/useCourses';
import { BookOpen, GraduationCap, FileText, Plus, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { data: courses } = useCourses();

  const stats = [
    {
      title: 'Total Courses',
      value: courses?.length || 0,
      icon: BookOpen,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Active Semesters',
      value: 8,
      icon: GraduationCap,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Materials',
      value: '—',
      icon: FileText,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage courses, semesters, subjects, and study materials.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manage Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or delete courses and their associated semesters.
              </p>
              <Link to="/admin/courses">
                <Button className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Courses
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Manage Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add subjects to semesters and organize course content.
              </p>
              <Link to="/admin/subjects">
                <Button className="w-full gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Subjects
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Upload study materials, assignments, notes, and more.
              </p>
              <Link to="/admin/materials">
                <Button className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Materials
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

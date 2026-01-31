import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import About from '@/pages/About';


// Pages
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseSemesters from "./pages/CourseSemesters";
import SemesterSubjects from "./pages/SemesterSubjects";
import SubjectMaterials from "./pages/SubjectMaterials";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ManageSubjects from "./pages/admin/ManageSubjects";
import ManageMaterials from "./pages/admin/ManageMaterials";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses/:courseId" element={<CourseSemesters />} />
            <Route path="/courses/:courseId/semesters/:semesterId" element={<SemesterSubjects />} />
            <Route path="/courses/:courseId/semesters/:semesterId/subjects/:subjectId" element={<SubjectMaterials />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute requireAdmin>
                <ManageCourses />
              </ProtectedRoute>
            } />
            <Route path="/admin/subjects" element={
              <ProtectedRoute requireAdmin>
                <ManageSubjects />
              </ProtectedRoute>
            } />
            <Route path="/admin/materials" element={
              <ProtectedRoute requireAdmin>
                <ManageMaterials />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

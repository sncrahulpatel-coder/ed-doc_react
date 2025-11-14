// src/routes/adminRoutes.tsx
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminSidebar from "../pages/Admin/AdminSidebar/AdminSidebar";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import { LogIn } from "lucide-react";
import AdminSchoolRegister from "../pages/Admin/AdminSchool/AdminSchoolRegister";
import AdminSchoolList from "../pages/Admin/AdminSchool/AdminSchoolList";
import AdminPlans from "../pages/Admin/AdminPlans/AdminPlans";

const adminRoutes = (
  <>
    <Route path="/admin/login" element={<LogIn />} />

    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute requiredRole="admin">
          <div className="d-flex">
            <AdminSidebar >
              <AdminDashboard />
            </AdminSidebar>

          </div>
        </ProtectedRoute>
      }
    />

     <Route
      path="/admin/school"
      element={
        <ProtectedRoute requiredRole="admin">
          <div className="d-flex">
            <AdminSidebar >
              <AdminSchoolList />
            </AdminSidebar>

          </div>
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin/school/register"
      element={
        <ProtectedRoute requiredRole="admin">
          <div className="d-flex">
            <AdminSidebar >
              <AdminSchoolRegister />
            </AdminSidebar>

          </div>
        </ProtectedRoute>
      }
    />

       <Route
      path="/admin/plans"
      element={
        <ProtectedRoute requiredRole="admin">
          <div className="d-flex">
            <AdminSidebar >
              <AdminPlans />
            </AdminSidebar>

          </div>
        </ProtectedRoute>
      }
    />
  </>
);

export default adminRoutes;

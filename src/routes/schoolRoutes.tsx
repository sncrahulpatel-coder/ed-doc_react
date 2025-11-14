import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import SchoolDashboard from "../pages/School/SchoolDashboard";
import SchoolSidebar from "../pages/School/SchoolSidebar";
import SchoolRecord from "../pages/School/SchoolRecord/SchoolRecord";
import StundentRecord from "../pages/School/StundentRecord/StundentRecord";
import StaffRecord from "../pages/School/TeacherRecord/TeacherRecord";
import StundentAdd from "../pages/School/StundentRecord/StundentAdd";

const schoolRoutes = (
  <>

    <Route
      path="/school/dashboard"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <SchoolDashboard />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

      <Route
      path="/school/SchoolRecords"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <SchoolRecord />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

 <Route
      path="/school/studentRecords"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StundentRecord />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
 <Route
      path="school/TeacherRecords"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StaffRecord />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

    <Route
      path="/school/studentRecords/add"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StundentAdd />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
  </>
);

export default schoolRoutes;

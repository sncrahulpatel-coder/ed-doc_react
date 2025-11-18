import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import SchoolDashboard from "../pages/School/SchoolDashboard";
import SchoolSidebar from "../pages/School/SchoolSidebar";
import SchoolRecord from "../pages/School/SchoolRecord/SchoolRecord";
import StundentRecord from "../pages/School/StundentRecord/StundentRecord";
import StundentAdd from "../pages/School/StundentRecord/StundentAdd";
import TeacherRecord from "../pages/School/TeacherRecord/TeacherRecord";
import TeacherAdd from "../pages/School/TeacherRecord/TeacherAdd";
import StundentDetails from "../pages/School/StundentRecord/StundentDetails";
import TeacherDetails from "../pages/School/TeacherRecord/TeacherDetails";
import TeacherEdit from "../pages/School/TeacherRecord/TeacherEdit";
import StudentDocument from "../pages/School/StundentRecord/StudentDocument";
import SchoolRecordInside from "../pages/School/SchoolRecord/SchoolRecordInside";
import SchoolDocumentView from "../pages/School/SchoolRecord/SchoolDocumentView";

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
      path="/school/StudentDocument/studentRecords"
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
              <TeacherRecord />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
     <Route
      path="school/TeacherRecords/add"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <TeacherAdd />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

    <Route
      path="/school/StudentDocument/studentRecords/add"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StundentAdd />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
     <Route
      path="/school/StudentDocument/studentRecords/Student"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StundentDetails />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

    <Route
      path="/school/StudentDocument/studentRecords/Student/Edit"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StundentAdd />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

    
    <Route
      path="/school/TeacherRecords/Details"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <TeacherDetails />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

      <Route
      path="/school/TeacherRecords/Details/Edit"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <TeacherEdit />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

      <Route
      path="/school/StudentDocument"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <StudentDocument />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
    <Route
      path="/school/schoolRecords/folder"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <SchoolRecordInside />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />

    <Route
      path="/school/schoolRecords/folder/View"
      element={
        <ProtectedRoute requiredRole="school">
          <SchoolSidebar>
              <SchoolDocumentView />
          </SchoolSidebar>
        </ProtectedRoute>
      }
    />
  </>
);

export default schoolRoutes;

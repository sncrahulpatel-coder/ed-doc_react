import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import { AuthProvider } from "./context/AuthContext";
import LogoutPage from "./components/LogoutPage";
import Unauthorized from "./pages/Others/Unauthorized";

import adminRoutes from "./routes/adminRoutes";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./i18n/i18n"; // import config here
import NotFound from "./pages/Others/404_page";
import { useDetectDevTools } from "./utils/useDetectDevTools";
import api from "./services/api";
import schoolRoutes from "./routes/schoolRoutes";
import CopyRight from "./pages/Others/CopyRight";
import './App.css'
function App() {
  

   useDetectDevTools({
    onDetect: (reason) => {
      // send telemetry to your backend (recommended)
      api.post("/api/securityError/log-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, url: window.location.href, ts: Date.now() }),
      }).catch(() => {});
    },
    blockUI: true,
    redirectOnDetect: false,
    disableCopyCut: true,
    checkIntervalMs: 1200,
  });


  return (
     <AuthProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Admin Routes */}
            {adminRoutes}
            {schoolRoutes}

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* ✅ Add footer at bottom */}
        <CopyRight />
      </div>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import "./Login.css";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useLoader } from "../../context/LoaderContext";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const EdDocLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showLoader, hideLoader } = useLoader();
  const { login } = useAuth();
  const navigate = useNavigate();

  // 🔹 Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      navigate(`/${role}/dashboard`);
    }
  }, [navigate]);

  // 🔹 Handle Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    showLoader();

    let apiUrl = "/login";
    if (userId.includes("@admin")) {
      apiUrl = "/api/admin/login";
    }

    try {
      const res = await api.post(apiUrl, { email: userId, password });

      if (res.data.success) {
        const { token, default_password, role, name, email } = res.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("default_password", default_password);
        localStorage.setItem("role", role);
        localStorage.setItem("activeMenuItem", "0");

        login({ name, email, role });

        toast.success("Login successful 🎉");
        navigate(`/${role}/dashboard`);
        return;
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  // 🔹 Dark mode setup
  

  return (
    <div
      className="Eddoclogin-container"
      
    >
      {/* Left Side (Image / Animation) */}
      <div className="Eddoclogin-left">
        <img
          src="/Login/Mobile login.gif"
          className="Eddoclogin-video"
          alt="Login Animation"
        />
      </div>

      {/* Right Side (Form) */}
      <div className="Eddoclogin-right">
        <div className="Eddoclogin-form">
          <h1>Welcome Back!</h1>
          <p>Simplify your workflow and boost your productivity with Ed-Doc</p>

          <form onSubmit={handleSubmit}>
            <div className="Eddoclogin-input-group">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username or Email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>

            <div className="Eddoclogin-input-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="Eddoclogin-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <div className="Eddoclogin-error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EdDocLogin;

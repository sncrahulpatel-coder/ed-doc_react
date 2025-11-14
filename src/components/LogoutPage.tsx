import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const LogoutPage = () => {
  const { logout } = useAuth();
  logout();
  return <Navigate to="/" />;
};

export default LogoutPage;

import { Navigate, Outlet } from "react-router-dom";

const RequireAdminAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = user?.role === "admin";
  return admin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAdminAuth;
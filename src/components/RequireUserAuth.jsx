import { Navigate, Outlet } from "react-router-dom";

const RequireUserAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireUserAuth;
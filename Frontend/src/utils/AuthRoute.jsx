import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;
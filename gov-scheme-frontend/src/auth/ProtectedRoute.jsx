import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth(); // Assume AuthContext provides a loading state
  const location = useLocation();

  // 1. If the app is still validating the token, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 2. If no token, redirect to login but save the current location
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
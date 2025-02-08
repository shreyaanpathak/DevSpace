import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { currentUser, loading } = useSelector((state) => state.account);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate 
        to="/signin" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  return children;
}

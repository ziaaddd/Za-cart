import { useAppSelector } from "../../store/hooks";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login?message=login_required" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

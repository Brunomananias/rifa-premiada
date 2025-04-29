import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, token } = useAuth();
  
    if (token === null) {
      // ainda carregando do localStorage
      return <div>Carregando...</div>;
    }
  
    return isAuthenticated ? <Outlet /> : <Navigate to="/admin" replace />;
  };
  

export default ProtectedRoute;
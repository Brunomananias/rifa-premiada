import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Lógica de autenticação
    navigate('/admin/dashboard');
  };

  return (
    <div className="container">
      <h2>Login do Administrador</h2>
      <button className="button" onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default AdminLogin;

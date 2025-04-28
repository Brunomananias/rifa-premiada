import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();

  const linkStyle = (path: string) => ({
    display: 'block',
    padding: '1rem',
    color: location.pathname === path ? '#000' : '#fff',
    backgroundColor: location.pathname === path ? '#ffd700' : 'transparent',
    textDecoration: 'none',
    fontWeight: 'bold',
  });

  return (
    <nav
      style={{
        width: '220px',
        backgroundColor: '#111',
        padding: '2rem 1rem',
        minHeight: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: '2rem' }}>Admin Panel</h2>
      <Link to="/admin/dashboard" style={linkStyle('/admin/dashboard')}>
        Dashboard
      </Link>
      <Link to="/admin/rifas" style={linkStyle('/admin/rifas')}>
        Rifas
      </Link>
      <Link to="/admin/menor-maior-cota" style={linkStyle('/admin/menor-maior-cota')}>
        Menor e Maior 
      </Link>
      <Link to="/admin/compras" style={linkStyle('/admin/compras')}>
        Compras
      </Link>
      <Link to="/admin/clientes" style={linkStyle('/admin/clientes')}>
        Clientes
      </Link>
      <Link to="/admin/sorteio" style={linkStyle('/admin/sorteio')}>
        Sorteio
      </Link>
      <Link to="/admin/gateway-config" style={linkStyle('/admin/gateway-config')}>
        Gateway de Pagamento
      </Link>


      <Link to="/" style={{ ...linkStyle('/'), marginTop: '2rem' }}>
        Voltar ao site
      </Link>
    </nav>
  );
};

export default AdminNavbar;

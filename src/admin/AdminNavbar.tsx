import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface IProps {
  closeSidebar?: () => void;
}

const AdminNavbar = ({ closeSidebar }: IProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, planId, loading } = useAuth();
  const planName = localStorage.getItem('plan_name');
  const userName = localStorage.getItem('user_name');

  if (loading) return null;

  const linkStyle = (path: string) => ({
    display: 'block',
    padding: '1rem',
    color: location.pathname === path ? '#000' : '#fff',
    backgroundColor: location.pathname === path ? '#ffd700' : 'transparent',
    textDecoration: 'none',
    fontWeight: 'bold',
  });

  const handleLinkClick = () => {
    if (closeSidebar) closeSidebar();
  };

  const handleLogout = () => {
    logout();            
    navigate('/');
  };

  const handleWhatsAppSupport = () => {
    const phoneNumber = '5531975011732';  // Altere para o número de WhatsApp de suporte
    const message = 'Olá, preciso de ajuda!';  // Mensagem padrão para enviar no WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <nav
      style={{
        width: '220px',
        marginTop: 30,
        minWidth: '220px',
        backgroundColor: '#111',
        padding: '2rem 1rem',
        minHeight: '100vh',
        boxShadow: '2px 0 5px rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}
    >
      <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Admin Panel</h2>
      {user && (
        <div style={{ color: '#aaa', marginBottom: '2rem' }}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff' }}>
            Bem-vindo, <span style={{ color: '#ffd700' }}>{userName}</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#ffd700' }}>{planName}</div>
        </div>
      )}

      <Link to="/admin/dashboard" onClick={handleLinkClick} style={linkStyle('/admin/dashboard')}>Dashboard</Link>
      <Link to="/admin/rifas" onClick={handleLinkClick} style={linkStyle('/admin/rifas')}>Rifas</Link>
      {planId === 3 && <Link to="/admin/menor-maior-cota" onClick={handleLinkClick} style={linkStyle('/admin/menor-maior-cota')}>Menor e Maior</Link>}
      <Link to="/admin/compras" onClick={handleLinkClick} style={linkStyle('/admin/compras')}>Compras</Link>
      {planId !== 5 && <Link to="/admin/clientes" onClick={handleLinkClick} style={linkStyle('/admin/clientes')}>Clientes</Link>}
      <Link to="/admin/sorteio" onClick={handleLinkClick} style={linkStyle('/admin/sorteio')}>Sorteio</Link>
      {planId === 3 && <Link to="/admin/gateway-config" onClick={handleLinkClick} style={linkStyle('/admin/gateway-config')}>Gateway de Pagamento</Link>}
      <Link to="/admin/plano" onClick={handleLinkClick} style={linkStyle('/admin/plano')}>Meu Plano</Link>
      <Link to="/admin/gateway-config" onClick={handleLinkClick} style={linkStyle('/admin/gateway-config')}>Configuração</Link>

      <button onClick={() => { handleLogout(); handleLinkClick(); }} style={{ ...linkStyle('/'), marginTop: '2rem', background: 'none', border: 'none', textAlign: 'left', width: '100%', cursor: 'pointer' }}>SAIR</button>

      {/* Suporte WhatsApp */}
      <button 
        onClick={handleWhatsAppSupport} 
        style={{
          ...linkStyle('/'),
          marginTop: '2rem',
          background: '#25D366',  // Cor do WhatsApp
          color: '#fff',
          textAlign: 'left',
          width: '100%',
          cursor: 'pointer',
          fontWeight: 'normal'
        }}
      >
        Suporte via WhatsApp
      </button>
    </nav>
  );
};

export default AdminNavbar;

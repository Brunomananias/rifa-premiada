import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Dashboard do Admin</h1>
      <p>Bem-vindo! Aqui você pode gerenciar suas rifas e acompanhar tudo que está rolando.</p>

      {/* Exemplo de cards ou dados */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={cardStyle}>Total de Rifas: <strong>12</strong></div>
        <div style={cardStyle}>Total de Compras: <strong>87</strong></div>
        <div style={cardStyle}>Próxima Rifa: <strong>#13</strong></div>
      </div>
    </AdminLayout>
  );
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#222',
  padding: '1.5rem',
  borderRadius: '8px',
  color: '#fff',
  flex: 1,
  boxShadow: '0 0 10px rgba(255, 255, 255, 0.05)',
};

export default AdminDashboard;

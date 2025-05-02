import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
  const idUser = localStorage.getItem('user');
  const [rafflesQuantity, setRafflesQuantity] = useState<number>();
  const [purchasesQuantity, setPurchasesQuantity] = useState<number>();

  const fetchTotalRaffles = async() => {
    const response = await apiClient.get('api/raffles', {
      params: { idUsuarioLogado: idUser }
    })
    setRafflesQuantity(response.data.length)
  }

  const fetchTotalPurchases = async() => {
    const response = await apiClient.get('api/NumbersSold/quantity-purchases')
    setPurchasesQuantity(response.data);
  }

  useEffect(() => {
    fetchTotalRaffles ();
    fetchTotalPurchases();
  })
  return (
    <AdminLayout>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'yellow' }}>Dashboard do Admin</h1>
      <p>Bem-vindo! Aqui você pode gerenciar suas rifas e acompanhar tudo que está rolando.</p>

      {/* Exemplo de cards ou dados */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <div style={cardStyle}>Total de Rifas: <strong>{rafflesQuantity}</strong></div>
        <div style={cardStyle}>Total de Compras: <strong>{purchasesQuantity}</strong></div>
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

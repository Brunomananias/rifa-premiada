/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import './AdminGatewayConfig.css';
import AdminLayout from './AdminLayout';
import { toast } from 'react-toastify';

const AdminGatewayConfig = () => {
  const [paggueClientKey, setPaggueClientKey] = useState('');
  const [paggueClientSecret, setPaggueClientSecret] = useState('');
  const [paggueCompanyId, setPaggueCompanyId] = useState('');
  const [paggueEnabled, setPaggueEnabled] = useState(false);
  const userId = localStorage.getItem('user');
  useEffect(() => {
    apiClient.get(`/api/Gateway/${Number(userId)}`)
      .then((res) => {
        setPaggueClientKey(res.data.clientKey || '');
        setPaggueClientSecret(res.data.clientSecret || '');
        setPaggueCompanyId(res.data.idEmpresa || '');
        setPaggueEnabled(res.data.enabled || false);
      })
  }, []);

  const handleSave = () => {
    if (!paggueClientKey || !paggueClientSecret) {
      toast.warning("Por favor, preencha todas as informações do Paggue.");
      return;
    }

    apiClient.post('/api/Gateway/save', {
      clientKey: paggueClientKey,
      clientSecret: paggueClientSecret,
      companyId: paggueCompanyId,
      userId: Number(userId),
      enabled: paggueEnabled,
    })
      .then(() => {
        toast.success("Configuração do Paggue salva com sucesso!");
      })
      .catch((err) => {
        toast.warning("erro ao salvar as configurações!");

        console.error(err);
      });
  };

  return (
    <AdminLayout>
      <div className="gateway-container">
        <h2>Configuração Gateway Paggue</h2>

        <div className="gateway-group">
          <div className="gateway-label">Client Key:</div>
          <input
            type="text"
            className="gateway-input"
            value={paggueClientKey}
            onChange={(e) => setPaggueClientKey(e.target.value)}
            placeholder="Insira sua Client Key"
          />

          <div className="gateway-label">Client Secret:</div>
          <input
            type="text"
            className="gateway-input"
            value={paggueClientSecret}
            onChange={(e) => setPaggueClientSecret(e.target.value)}
            placeholder="Insira seu Client Secret"
          />

          <div className="gateway-label">ID empresa:</div>
          <input
            type="text"
            className="gateway-input"
            value={paggueCompanyId}
            onChange={(e) => setPaggueCompanyId(e.target.value)}
            placeholder="Insira seu ID empresa"
          />

          <div className="gateway-label">Habilitar Gateway Paggue:</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={paggueEnabled}
              onChange={(e) => setPaggueEnabled(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <button className="gateway-button" onClick={handleSave}>
          Salvar Configuração
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminGatewayConfig;

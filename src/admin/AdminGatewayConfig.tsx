import React, { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const AdminGatewayConfig = () => {
  // Declare os estados corretamente
  const [pixKey, setPixKey] = useState('');
  const [pixCopiaCola, setPixCopiaCola] = useState(''); // Declaração do estado pixCopiaCola

  // Efeito para carregar dados iniciais do backend
  useEffect(() => {
    apiClient.get('/api/PixConfig').then((res) => {
      setPixKey(res.data.pixKey || '');
      setPixCopiaCola(res.data.pixCopiaCola || ''); // Preenchendo o estado corretamente
    });
  }, []);

  // Função de salvar
  const handleSave = () => {
    if (!pixKey || !pixCopiaCola) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    apiClient
      .post('/api/PixConfig', { pixKey, pixCopiaCola })
      .then(() => {
        alert('Configuração salva com sucesso!');
      })
      .catch((err) => {
        alert('Ocorreu um erro ao salvar as configurações!');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Configuração do Gateway de Pagamento - Pix</h2>
      <div>
        <label>Chave Pix:</label>
        <input
          type="text"
          value={pixKey}
          onChange={(e) => setPixKey(e.target.value)}
          placeholder="Insira a chave Pix"
        />
      </div>
      <div>
        <label>Pix Copia e Cola:</label>
        <textarea
          value={pixCopiaCola}
          onChange={(e) => setPixCopiaCola(e.target.value)} // Certifique-se de que esta função seja chamada corretamente
          placeholder="Insira o código Copia e Cola"
        />
      </div>
      <button onClick={handleSave}>Salvar Configuração</button>
    </div>
  );
};

export default AdminGatewayConfig;

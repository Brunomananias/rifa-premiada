import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';
import './AdminGatewayConfig.css';
import AdminLayout from './AdminLayout';

const AdminGatewayConfig = () => {
  const [pixKey, setPixKey] = useState('');
  const [pixCopiaCola, setPixCopiaCola] = useState('');
  const [pagarMeKey, setPagarMeKey] = useState('');
  const [mercadoPagoKey, setMercadoPagoKey] = useState('');
  
  // Estado para armazenar se o gateway está habilitado
  const [pixEnabled, setPixEnabled] = useState(false);
  const [pagarMeEnabled, setPagarMeEnabled] = useState(false);
  const [mercadoPagoEnabled, setMercadoPagoEnabled] = useState(false);

  useEffect(() => {
    apiClient.get('/api/PaymentGatewayConfig/Config').then((res) => {
      // Acessando diretamente os valores de objetos (não um array)
      setPagarMeKey(res.data.pagarMeConfig.pagarMeKey || '');  // Atualiza o estado com a chave PagarMe
      setPagarMeEnabled(res.data.pagarMeConfig.enabled || false);  // Atualiza o estado com o status de habilitação
      setMercadoPagoKey(res.data.mercadoPagoConfig.mercadoPagoKey || '');  // Atualiza a chave Mercado Pago
      setMercadoPagoEnabled(res.data.mercadoPagoConfig.enabled || false);  // Atualiza o status de habilitação do Mercado Pago
    }).catch((error) => {
      console.error('Erro ao buscar configurações:', error);
    });
  }, []);
  

  // Função para salvar as configurações
  const handleSave = () => {
    if (!pixKey || !pixCopiaCola || !pagarMeKey || !mercadoPagoKey) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    // Configuração do Pix
    apiClient.post('/api/PaymentGatewayConfig/PixConfig', { pixKey, pixCopiaCola, enabled: pixEnabled })
      .then(() => {
        alert('Configuração Pix salva com sucesso!');
      })
      .catch((err) => {
        alert('Erro ao salvar a configuração do Pix!');
        console.error(err);
      });
  
    // Configuração do Pagar.me
    apiClient.post('/api/PaymentGatewayConfig/PagarMeConfig', { pagarMeKey, enabled: pagarMeEnabled })
      .then(() => {
        alert('Configuração Pagar.me salva com sucesso!');
      })
      .catch((err) => {
        alert('Erro ao salvar a configuração do Pagar.me!');
        console.error(err);
      });
  
    // Configuração do Mercado Pago
    apiClient.post('/api/PaymentGatewayConfig/MercadoPagoConfig', { mercadoPagoKey, enabled: mercadoPagoEnabled })
      .then(() => {
        alert('Configuração Mercado Pago salva com sucesso!');
      })
      .catch((err) => {
        alert('Erro ao salvar a configuração do Mercado Pago!');
        console.error(err);
      });
  };

  return (
    <AdminLayout>
      <div className="gateway-container">
        <h2>Configuração de Gateways de Pagamento</h2>

        <div className="gateway-group">
          <h3>Gateway Pix</h3>
          <div className="gateway-label">Chave Pix:</div>
          <input
            type="text"
            className="gateway-input"
            value={pixKey}
            onChange={(e) => setPixKey(e.target.value)}
            placeholder="Insira a chave Pix"
          />
          <div className="gateway-label">Pix Copia e Cola:</div>
          <textarea
            className="gateway-textarea"
            value={pixCopiaCola}
            onChange={(e) => setPixCopiaCola(e.target.value)}
            placeholder="Insira o código Copia e Cola"
          />
          <div className="gateway-label">Habilitar Gateway Pix:</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={pixEnabled}
              onChange={(e) => setPixEnabled(e.target.checked)} // Atualiza o estado ao alterar o checkbox
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="gateway-group">
          <h3>Pagar.me</h3>
          <div className="gateway-label">Chave Pagar.me:</div>
          <input
  type="text"
  className="gateway-input"
  value={pagarMeKey}  // Passando o valor para o campo de entrada
  onChange={(e) => {
    console.log("Valor digitado:", e.target.value);  // Verifica o valor digitado
    setPagarMeKey(e.target.value);  // Atualiza o estado com o valor digitado
  }}  
  placeholder="Insira a chave Pagar.me"
/>


          <div className="gateway-label">Habilitar Gateway Pagar.me:</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={pagarMeEnabled}
              onChange={(e) => setPagarMeEnabled(e.target.checked)} // Atualiza o estado ao alterar o checkbox
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="gateway-group">
          <h3>Mercado Pago</h3>
          <div className="gateway-label">Chave Mercado Pago:</div>
          <input
            type="text"
            className="gateway-input"
            value={mercadoPagoKey}
            onChange={(e) => setMercadoPagoKey(e.target.value)}
            placeholder="Insira a chave Mercado Pago"
          />
          <div className="gateway-label">Habilitar Gateway Mercado Pago:</div>
          <label className="switch">
            <input
              type="checkbox"
              checked={mercadoPagoEnabled}
              onChange={(e) => setMercadoPagoEnabled(e.target.checked)} // Atualiza o estado ao alterar o checkbox
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

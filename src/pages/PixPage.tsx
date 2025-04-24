import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './PixPage.css';

interface PixConfig {
  pixKey: string;
  pixCopiaCola: string;
  qrCodeUrl?: string;
}

const PixPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { raffleId, numerosSelecionados, rifaTitle, totalPrice } = location.state;

  const [pixConfig, setPixConfig] = useState<PixConfig | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Buscar a configuração Pix da rifa
  useEffect(() => {
    const fetchPixConfig = async () => {
      try {
        const response = await apiClient.get(`/api/PixConfig/${raffleId}`);
        setPixConfig(response.data);
      } catch (error) {
        console.error('Erro ao buscar configuração de Pix:', error);
      }
    };

    fetchPixConfig();
  }, [raffleId]);

  // Verificar automaticamente o status do pagamento
  useEffect(() => {
    if (!pixConfig?.pixKey) return;

    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get("/api/PixTransactions/status", {
          params: { pixKey: pixConfig.pixKey }
        });

        if (response.data.status === "paid") {
          setIsPaid(true);
          alert("Pagamento confirmado automaticamente!");
          navigate("/");
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pixConfig, navigate]);

  const handleConfirmarPagamento = async () => {
    try {
      await apiClient.post("/api/PixTransactions/confirm", {
        raffleId,
        numbers: numerosSelecionados
      });

      alert("Pagamento confirmado com sucesso!");
      navigate("/");
    } catch (err) {
      alert("Erro ao confirmar pagamento.");
      console.error(err);
    }
  };

  if (!pixConfig) {
    return <div>Carregando configurações de Pix...</div>;
  }

  return (
    <div className="pix-container">
      <div className="pix-card">
        <h1>Pagamento via Pix</h1>
        <h2>{rifaTitle}</h2>

        <p><strong>Números comprados:</strong></p>
        <div className="pix-numbers">
          {numerosSelecionados.map((num) => (
            <div key={num} className="number-button">{num}</div>
          ))}
        </div>

        <p><strong>Total: </strong>R$ {totalPrice.toFixed(2)}</p>

        <div className="pix-info">
          <p><strong>Chave Pix:</strong> {pixConfig.pixKey}</p>
          <div className="qrcode">
            <p>{pixConfig.pixCopiaCola}</p>
          </div>

          <p>Escaneie o QR Code ou copie o código acima para pagar.</p>
          <p>Após o pagamento, você será redirecionado automaticamente.</p>

          <p>Ou clique no botão abaixo se já pagou:</p>
          <button className="button" onClick={handleConfirmarPagamento}>
            Já paguei
          </button>
        </div>
      </div>
    </div>
  );
};

export default PixPage;

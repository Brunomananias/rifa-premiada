/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './PixPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';

interface PixPageState {
  email: string;
  descricao: string;
  totalPrice: number;
  raffleId: number;
  rifaTitle: string;
  transactionId: number;
  numbersSoldIds: number;
  numerosSelecionados: number[];
}

interface PaggueResponse {
  qrCodeBase64: string;
  paymentId: string;
  externalId: string;
  paymentCode: string;
}

interface PaymentStatusResponse {
  status: string; // 'pending', 'approved', 'rejected', etc.
}

const PixPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PixPageState;

  const [pixData, setPixData] = useState<PaggueResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(2 * 60); // 60 minutos * 60 segundos

  useEffect(() => {
    if (!state) return;
    console.log(state);

    // Fazer a requisição para criar o pagamento Pix
    apiClient.post<PaggueResponse>('api/PagguePayment/gerar-pix', {
      payerName: "Teste de integração",
      amount: state.totalPrice,
      expiration: 1, // tempo de expiração em minutos
      externalId: state.transactionId.toString(),
      description: state.rifaTitle,
      meta: {
        extraData: "Algum dado extra",
        webhookUrl: "https://seu-webhook-url"
      },
      raffleId: state.raffleId 
    })
      .then(response => {
        console.log(response.data);
        setPixData(response.data);
        setIsLoading(false);
        startPaymentStatusCheck(response.data.paymentId);
      })
      .catch(error => {
        console.error('Erro ao gerar pagamento:', error);
        setError('Erro ao gerar pagamento Pix.');
        setIsLoading(false);
      });
  }, [state]);
  

  const startPaymentStatusCheck = (paymentId: string) => {
    const intervalId = setInterval(() => {
      apiClient
        .get<PaymentStatusResponse>(`api/PagguePayment/status/${paymentId}?rifaId=${state.raffleId}`)
        .then(response => {
          const newStatus = response.data.status;
          setPaymentStatus(newStatus);

          if (newStatus === '1') { // '1' significa aprovado
            clearInterval(intervalId);
            navigate('/pagamento-concluido', {
              state: {
                numerosSelecionados: state.numerosSelecionados,
                rifaTitle: state.rifaTitle,
                paymentId: state.transactionId
              }
            });
          }
        })
        .catch(error => {
          console.error('Erro ao verificar status:', error);
          // Mantém o intervalo rodando
        });
    }, 2000); // A cada 2 segundos

    // Limpa quando sair da página
    return () => clearInterval(intervalId);
  };

  // Contador de expiração
  useEffect(() => {
    if (timeLeft <= 0) {
      setError('O tempo para pagamento expirou. Por favor, gere um novo pagamento.');
      cancelTransaction();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000); // Atualiza a cada 1 segundo

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const cancelTransaction = () => {
    console.log('Cancelando a transação devido ao tempo expirado');
    apiClient.delete(`api/PixTransactions/${state.numbersSoldIds}`)
      .then(() => {
        alert('Pagamento expirado. Transação cancelada.');
        navigate('/rifas');
      })
      .catch(error => {
        console.error('Erro ao cancelar a transação:', error);
        alert('Erro ao cancelar a transação.');
      });
  };

  const handleConfirmarPagamentoManual = () => {
    if (paymentStatus === '1') {
      navigate('/pagamento-concluido', {
        state: {
          ...state,
          paymentId: pixData?.paymentId
        }
      });
    } else {
      alert('Pagamento ainda não foi confirmado. Por favor, aguarde ou tente novamente em alguns instantes.');
    }
  };

  if (isLoading) {
    return (
      <div className="pix-container">
        <div className="pix-card">
          <h1>Gerando pagamento Pix...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pix-container">
        <div className="pix-card">
          <h1>Erro no pagamento</h1>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pix-container">
      <div className="pix-card">
        <h1>Pagamento via Pix</h1>
        <h2>{state?.rifaTitle}</h2>

        <p><strong>Total:</strong> R$ {state?.totalPrice.toFixed(2)}</p>
        <p><strong>Status:</strong> {paymentStatus === "0" ? 'Aguardando pagamento...' : 'Pagamento aprovado!'}</p>
        <p><strong>Tempo restante:</strong> {formatTime(timeLeft)}</p>

        {pixData && (
          <div className="pix-info">
            <h3>Escaneie o QR Code:</h3>
            <img
              src={`data:image/png;base64,${pixData.qrCodeBase64}`}
              alt="QR Code Pix"
              className="qr-image"
            />
            <p>Ou copie o código Pix:</p>
            <textarea
              className="pix-code-box"
              value={pixData.paymentCode}
              readOnly
              rows={3}
            />

            <button
              className="button"
              onClick={handleConfirmarPagamentoManual}
              disabled={paymentStatus !== '1'}
            >
              {paymentStatus === '1' ? 'Continuar' : 'Aguardando pagamento...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixPage;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

interface PlanPageState {
  name: string;
  id: number;
  price: number;
  idPixTransaction: number;
}

interface PixResponse {
  qrCodeBase64: string;
  qrCodeText: string;
  paymentId: string;
}

interface PaymentStatusResponse {
  status: string; // 'pending', 'approved', 'rejected', etc.
}

const PixMercadoPagoPage: React.FC = () => {
  const hasExecuted = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PlanPageState;
 const { user } = useAuth();
  const [pixData, setPixData] = useState<PixResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 const [timeLeft, setTimeLeft] = useState<number>(3 * 60);

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
 

  useEffect(() => {
    if (hasExecuted.current) return;
    hasExecuted.current = true;
  
    handlePagamentoPix();
  }, []);

  const handlePagamentoPix = async () => {
    try {
      setIsLoading(true);
  
      const userEmailResponse = await apiClient.get<string>(`api/users/user-email?idUser=${user}`);
      const email = userEmailResponse.data;
  
      const response = await apiClient.post<PixResponse>('api/MercadoPago', {
        email,
        descricao: "assinatura",
        valor: 1
      });
  
      console.log("PIX gerado:", response.data.paymentId);
  
      setPixData({
        qrCodeBase64: response.data.qrCodeBase64,
        qrCodeText: response.data.qrCodeText,
        paymentId: response.data.paymentId,
      });
  
      startPaymentStatusCheck(response.data.paymentId);
  
    } catch (err) {
      console.error('Erro ao gerar pagamento:', err);
      setError('Erro ao gerar pagamento Pix.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startPaymentStatusCheck = (paymentId: string) => {
    const intervalId = setInterval(() => {
      apiClient.get<PaymentStatusResponse>(`api/MercadoPago/status/${paymentId}`)
        .then(response => {
          const newStatus = response.data.status;
          setPaymentStatus(newStatus);

          if (newStatus === 'approved') {
            clearInterval(intervalId);
            const userId = localStorage.getItem('user');
            if (userId && state.id) {
                // Atualizar plano do usuário
                apiClient.put(`api/Users/plan`, {
                  userId: Number(userId),
                  planId: Number(state.id),
                  planName: state.name
                })
                .then((response) => {
                  // Suponha que a resposta da API inclua o novo plan_id e o nome do plano
                  const { newPlanId, newPlanName } = response.data; // Exemplo de resposta
    
                  // Atualizar localStorage com o novo plan_id e nome do plano
                  localStorage.setItem('plan_id', newPlanId);
                  localStorage.setItem('plan_name', newPlanName);
    
                  navigate('/admin/pagamento-concluido-admin', {
                    state: {
                      paymentId: state.idPixTransaction,
                      planName: newPlanName,
                    }});
                })
                .catch(error => {
                  console.error('Erro ao atualizar plano do usuário:', error);
                });
              } else {
                console.error('user_id ou plan_id não encontrado no localStorage');
              }
            }
          })
          .catch(error => {
            console.error('Erro ao verificar status:', error);
            // Não limpar o intervalo para continuar tentando
          });
      }, 2000); // Verifica a cada 2 segundos

    // Limpar intervalo quando componente desmontar
    return () => clearInterval(intervalId);
  };

  const cancelTransaction = () => {
        alert('Pagamento expirado. Transação cancelada.');
        navigate('/admin/dashboard');
  };

  const handleConfirmarPagamentoManual = () => {
    if (paymentStatus === 'approved') {
      navigate('/pagamento-concluido-admin', {
        state: {
          planName: state.name,
          paymentId: state.idPixTransaction
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
        <h2>{state?.name}</h2>

        <p><strong>Total:</strong> R$ {state?.price.toFixed(2)}</p>
        <p><strong>Status:</strong> {paymentStatus === 'pending' ? 'Aguardando pagamento...' : 'Pagamento aprovado!'}</p>
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
              value={pixData.qrCodeText}
              readOnly
              rows={1}
            />

            <button
              className="button"
              onClick={handleConfirmarPagamentoManual}
              disabled={paymentStatus !== 'approved'}
            >
              {paymentStatus === 'approved' ? 'Continuar' : 'Aguardando pagamento...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PixMercadoPagoPage;
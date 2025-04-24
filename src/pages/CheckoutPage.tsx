import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { numerosSelecionados, rifaTitle, pricePerNumber, raffleId } = location.state as {
    numerosSelecionados: number[];
    rifaTitle: string;
    pricePerNumber: number;
    raffleId: number;
  };

  const totalPrice = numerosSelecionados.length * pricePerNumber;
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [erro, setErro] = useState<string | null>(null);

  const validarCelular = (celular: string) => {
    const regex = /^\(?\d{2}\)?\s?\d{5}-\d{4}$/;
    return regex.test(celular);
  };

  const handleFinalizarCompra = async () => {
    if (!nome || !whatsapp) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
  
    if (!validarCelular(whatsapp)) {
      setErro('Insira um número válido no formato (XX) XXXXX-XXXX');
      return;
    }
  
    try {
      const checkoutResponse = await apiClient.post('/api/PixTransactions/checkout', {
        user: {
          name: nome,
          whatsapp: whatsapp
        },
        raffleId: raffleId,
        numbers: numerosSelecionados,
        price: totalPrice
      });
  
      const { transactionId, pixCode } = checkoutResponse.data;
  
      navigate('/pix', {
        state: {
          numerosSelecionados,
          rifaTitle,
          totalPrice,
          transactionId,
          pixCode,
          raffleId
        }
      });
    } catch (err) {
      console.error(err);
      setErro('Erro ao processar o pagamento. Tente novamente.');
    }
  };
  

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h1>Checkout</h1>

        <h2>{rifaTitle}</h2>

        <div className="checkout-summary">
          <p><strong>Rifa:</strong> {rifaTitle}</p>
          <p><strong>Números comprados:</strong></p>
          <div className="checkout-numbers">
            {numerosSelecionados.map((num) => (
              <div key={num} className="number-button">{num}</div>
            ))}
          </div>
          <p><strong>Total: </strong>R$ {totalPrice.toFixed(2)}</p>
        </div>

        <div className="checkout-form">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="WhatsApp (com DDD)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {erro && <p className="error-message">{erro}</p>}

        <button onClick={handleFinalizarCompra} className="button">
          Finalizar Compra
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;

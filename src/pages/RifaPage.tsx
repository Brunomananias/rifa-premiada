import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './RifaPage.css';
import { toast } from 'react-toastify';

interface Raffle {
  id: number;
  title: string;
  description: string;
  price: number;
  total_Numbers: number;
  soldNumbers: number[];
  image_Url: string;
}

const RifaPage = () => {
  const { id } = useParams<{ id: string }>();
  const [rifa, setRifa] = useState<Raffle | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [erro, setErro] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlinking, setIsBlinking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifa = async () => {
      try {
        setIsLoading(true);
        if (id) {
          const response = await apiClient.get(`api/Raffles/${id}`);
          setRifa(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar rifa", error);
        setErro("Não foi possível carregar os detalhes da rifa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRifa();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 1000); // Pisca a cada 1 segundo
  
    return () => clearInterval(interval);
  }, []);

  const handleComprar = async () => {
    try {
      setErro(null);
      
      if (!rifa) throw new Error("Rifa não encontrada");
      if (quantidade < 1) throw new Error("Quantidade inválida");
      if(rifa.price < 1){
        toast.warning("Não é possível menos de R$ 1,00");
        return;
      }
      // Verificar disponibilidade antes de gerar números
      const availableNumbers = rifa.total_Numbers - (rifa.soldNumbers?.length || 0);
      if (quantidade > availableNumbers) {
        throw new Error(`Apenas ${availableNumbers} cotas disponíveis`);
      }

      const numerosSelecionados = gerarNumerosAleatoriosDisponiveis(
        rifa.total_Numbers,
        rifa.soldNumbers || [],
        quantidade
      );
      
      navigate('/checkout', {
        state: { 
          numerosSelecionados, 
          rifaTitle: rifa.title, 
          pricePerNumber: rifa.price,
          raffleId: rifa.id,
          totalPrice: rifa.price * quantidade,
          quantidade
        }
      });
    } catch (err) {
      setErro((err as Error).message);
    }
  };

  const gerarNumerosAleatoriosDisponiveis = (
    totalNumbers: number, 
    vendidos: number[], 
    quantidade: number
  ): number[] => {
    const numerosDisponiveis = Array.from({ length: totalNumbers }, (_, i) => i + 1)
      .filter(num => !vendidos.includes(num));
    
    if (quantidade > numerosDisponiveis.length) {
      throw new Error('Quantidade solicitada maior que a disponível');
    }

    // Embaralhar array e pegar os primeiros 'quantidade' elementos
    const shuffled = [...numerosDisponiveis].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, quantidade).sort((a, b) => a - b);
  };

  const handleQuantidadeChange = (value: number) => {
    if (rifa) {
      const maxAvailable = rifa.total_Numbers - (rifa.soldNumbers?.length || 0);
      const newValue = Math.max(1, Math.min(value, maxAvailable));
      setQuantidade(newValue);
    }
  };

  const handleQuickSelect = (value: number) => {
    if (rifa) {
      const maxAvailable = rifa.total_Numbers - (rifa.soldNumbers?.length || 0);
      const newValue = Math.max(1, Math.min(quantidade + value, maxAvailable));
      setQuantidade(newValue);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando rifa...</p>
      </div>
    );
  }

  if (!rifa) {
    return (
      <div className="error-container">
        <p>{erro || "Rifa não encontrada"}</p>
        <button onClick={() => navigate('/')} className="button">
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  const availableNumbers = rifa.total_Numbers - (rifa.soldNumbers?.length || 0);

  return (
    <div className="rifa-container">
      <div className="rifa-content">
        <div className="rifa-image-container">
          <img 
            src={rifa.image_Url} 
            alt={`Prêmio da Rifa: ${rifa.title}`} 
            className="rifa-image" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
            }}
          />
        </div>
        
        <div className="rifa-details">
          <h1 className="rifa-title">{rifa.title}</h1>

          <div className={`call-to-action ${isBlinking ? 'blink' : ''}`}>
            🎉 ADQUIRA JÁ! GARANTA SUAS COTAS! 🎉
          </div>
          
          <div className="rifa-meta">
            <span className="rifa-price">
              R$ {rifa.price.toFixed(2).replace('.', ',')} por cota
            </span>
            <span className="rifa-available">
              {availableNumbers} de {rifa.total_Numbers} cotas disponíveis
            </span>
          </div>
          
          <div className="rifa-description-container">
            <h3>Descrição do prêmio:</h3>
            <p className="rifa-description">{rifa.description}</p>
          </div>
          
          <div className="rifa-purchase">
          <div className="quick-buttons">
                {[100, 200, 500, 1000, 2000, 3000].map((value) => (
                  <button
                    key={value}
                    className="quick-button"
                    onClick={() => handleQuickSelect(value)}
                    disabled={value > availableNumbers}
                  >
                    +{value}
                  </button>
                ))}
              </div>
            <div className="quantity-selector">
              <label htmlFor="quantidade">Quantidade:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantidadeChange(quantidade - 1)}
                  disabled={quantidade <= 1}
                  aria-label="Reduzir quantidade"
                >
                  -
                </button>
                <input
                  id="quantidade"
                  type="number"
                  value={quantidade}                  
                  max={availableNumbers}
                  onChange={(e) => handleQuantidadeChange(Number(e.target.value))}
                />
                <button 
                  onClick={() => handleQuantidadeChange(quantidade + 1)}
                  disabled={quantidade >= availableNumbers}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="total-price">
              Total: R$ {(rifa.price * quantidade).toFixed(2).replace('.', ',')}
            </div>
            
            <button
              onClick={handleComprar}
              className="button buy-button"
              disabled={availableNumbers === 0}
            >
              {availableNumbers === 0 ? 'ESGOTADO' : 'COMPRAR AGORA'}
            </button>
          </div>
          
          {erro && <div className="error-message">{erro}</div>}
        </div>
      </div>
    </div>
  );
};

export default RifaPage;
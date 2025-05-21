import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './RifasDisponiveis.css';

interface Raffle {
  id: number;
  title: string;
  description: string;
  price: number;
  total_Numbers: number;
  image_Url: string;
}

const RifasDisponiveis = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const response = await apiClient.get('api/Raffles/rifas-publicas');
        setRaffles(response.data);
      } catch (error) {
        console.error("Erro ao carregar rifas", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRaffles();
  }, []);
  

  return (
    <div className="rifas-container">
      <h1>Rifas Disponíveis 🎁</h1>
      <p>Escolha a sua sorte! Participe e concorra a prêmios incríveis.</p>
  
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando rifas...</p>
        </div>
      ) : (
        <div className="raffles-grid">
          {raffles.map((raffle) => (
            <div key={raffle.id} className="raffle-card">
              <img src={raffle.image_Url} alt={raffle.title} />
              <h3>{raffle.title}</h3>
              <p>{raffle.description}</p>
              <div className="raffle-info">
                <span>🎫 {raffle.total_Numbers} números</span>
                <span>💰 R$ {raffle.price.toFixed(2)}</span>
              </div>
              <Link to={`/rifa/${raffle.id}`} className="raffle-button">
                Ver Detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default RifasDisponiveis;

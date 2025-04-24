import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './RifaPage.css';

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRifa = async () => {
      try {
        if (id) {
          const response = await apiClient.get(`/api/Raffles/${id}`);
          setRifa(response.data);
        }
      } catch (error) {
        console.error("Erro ao carregar rifa", error);
      }
    };

    fetchRifa();
  }, [id]);

  const handleComprar = () => {
    try {
      if (!rifa) throw new Error("Rifa não encontrada");

      const soldNumbers = rifa.soldNumbers || []; // Garantir que seja um array
      const gerados = gerarNumerosAleatoriosDisponiveis(
        rifa.total_Numbers,
        soldNumbers,
        quantidade
      );
      
      setErro(null);
      navigate('/checkout', {
        state: { 
          numerosSelecionados: gerados, 
          rifaTitle: rifa.title, 
          pricePerNumber: rifa.price,
          raffleId: rifa.id 
        }
      });
    } catch (err) {
      setErro((err as Error).message);
    }
  };

  // Função para gerar números aleatórios (simulando a lógica de sorteio)
  const gerarNumerosAleatoriosDisponiveis = (totalNumbers: number, vendidos: number[], quantidade: number) => {
    const numerosDisponiveis = [];
    for (let i = 1; i <= totalNumbers; i++) {
      if (!vendidos.includes(i)) {
        numerosDisponiveis.push(i);
      }
    }
    console.log(totalNumbers);
    if (quantidade > numerosDisponiveis.length) {
      throw new Error('Quantidade de cotas maior que o número de cotas disponíveis');
    }

    const numerosSelecionados: number[] = [];
    while (numerosSelecionados.length < quantidade) {
      const numeroAleatorio = numerosDisponiveis[Math.floor(Math.random() * numerosDisponiveis.length)];
      if (!numerosSelecionados.includes(numeroAleatorio)) {
        numerosSelecionados.push(numeroAleatorio);
      }
    }

    return numerosSelecionados;
  };

  if (!rifa) return <div>Carregando...</div>;

  return (
    <div className="rifa-container">
      <div className="rifa-content">
        <img src={rifa.image_Url} alt="Prêmio da Rifa" className="rifa-image" />
        <div className="rifa-details">
          <h1>{rifa.title}</h1>
          <p className="rifa-description">{rifa.description}</p>
          <p className="rifa-price">Valor por número: <strong>R$ {rifa.price.toFixed(2)}</strong></p>
          <div style={{ marginTop: '1rem' }}>
            <label>
              Quantidade de cotas:
              <input
                type="number"
                value={quantidade}
                min={1}
                max={rifa && rifa.total_Numbers && rifa.soldNumbers ? rifa.total_Numbers - rifa.soldNumbers.length : 0} // Garantir que tudo seja um número
                onChange={(e) => setQuantidade(Number(e.target.value))}
                style={{
                  marginLeft: '1rem',
                  padding: '0.3rem',
                  width: '80px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />

            </label>
            <button
              onClick={handleComprar}
              style={{ marginLeft: '1rem' }}
              className="button"
            >
              Comprar
            </button>
          </div>
          {erro && <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>}
        </div>
      </div>
    </div>
  );
};


export default RifaPage;

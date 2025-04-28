import React, { useState, useEffect } from 'react';
import './Roleta.css';

// Definindo os prêmios
const premios = [
  { label: '💸 10 Mil no Pix', cor: '#4CAF50' },
  { label: 'R$ 500,00', cor: '#333' },  // Fatia preta com "R$ 500,00"
  { label: '📱 iPhone', cor: '#2196F3' },
];

const Roleta: React.FC = () => {
  const [anguloFinal, setAnguloFinal] = useState(0);
  const [isGiroEmAndamento, setIsGiroEmAndamento] = useState(false);  // Controla se o giro está em andamento
  const [premioSorteado, setPremioSorteado] = useState<string | null>(null);  // Prêmio sorteado
  const [premiosDisponiveis, setPremiosDisponiveis] = useState(premios);
  const somRoleta = new Audio('/roleta.mp3'); // Supondo que o arquivo de som esteja na pasta public

  useEffect(() => {
    if (isGiroEmAndamento) {
      somRoleta.play();  // Toca o som quando o giro começa

      // Para o som após 4 segundos (tempo suficiente para o giro terminar)
      const timeout = setTimeout(() => {
        somRoleta.pause();
        somRoleta.currentTime = 0;
      }, 3540);  // O tempo em milissegundos (ajustar conforme necessário)

      // Limpeza do efeito ao desmontar o componente
      return () => clearTimeout(timeout);
    }
  }, [isGiroEmAndamento]);

  useEffect(() => {
    if (premiosDisponiveis.length === 0) {
      setPremiosDisponiveis(premios);  // Recarrega os prêmios quando todos forem sorteados
    }
  }, [premiosDisponiveis]);

  const girarRoleta = () => {
    setIsGiroEmAndamento(true);
  
    const premiosRestantes = [...premiosDisponiveis];
    const randomIndex = Math.floor(Math.random() * premiosRestantes.length);
  
    const premioSorteado = premiosRestantes[randomIndex];
  
    // Agora pega o índice CORRETO no array original
    const indexPremioOriginal = premios.findIndex(p => p.label === premioSorteado.label);
  
    const voltas = 1650; // 4 voltas
    const anguloAleatorio = voltas + indexPremioOriginal * (360 / premios.length);
  
    setAnguloFinal(anguloAleatorio);
  
    // Remove o prêmio sorteado dos disponíveis
    const novosPremiosDisponiveis = premiosRestantes.filter((_, index) => index !== randomIndex);
    setPremiosDisponiveis(novosPremiosDisponiveis);
  
    setTimeout(() => {
      setPremioSorteado(premioSorteado.label);
      setIsGiroEmAndamento(false);
    }, 4000);
  };
  

  return (
    <div className="roleta-container">
      <div className="apontador"></div>
      <div className="roleta" style={{ transform: `rotate(${anguloFinal}deg)` }}>
        {premios.map((premio, index) => (
          <div
            key={index}
            className="fatia"
            style={{
              transform: `rotate(${index * (360 / premios.length)}deg) skewY(-30deg)`,
              background: premio.cor
            }}
          >
            <span className="texto-premio">{premio.label}</span>
          </div>
        ))}
      </div>
      <button onClick={girarRoleta} className="botao-girar" disabled={isGiroEmAndamento}>
        {isGiroEmAndamento ? 'Girando...' : 'Girar'}
      </button>

      {/* Modal de Felicitações */}
      {premioSorteado && !isGiroEmAndamento && (
        <div className="modal">
          <div className="modal-content">
            <h2>Parabéns!</h2>
            <p>{premioSorteado}</p>
            <button onClick={() => setPremioSorteado(null)} className="fechar-modal">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roleta;

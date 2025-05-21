import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🚀 Crie suas próprias rifas e comece a lucrar hoje mesmo!</h1>
        <p>Com a <strong>Rifa Premiada</strong>, você tem acesso a um sistema completo para gerenciar rifas com facilidade e segurança.</p>

        <img 
          src="/logo.jpg" 
          alt="Dashboard da plataforma" 
          className="home-banner" 
        />

        <div className="home-buttons">
          <Link to="/planos" className="button cta">Ver Planos</Link>
          <Link to="/rifas" className="button outlined">Participar de Rifas</Link>
          <Link to="/admin" className="button secondary">Entrar</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>✨ O que você encontra aqui:</h2>
        <ul className="features-list">
          <li>📊 Painel completo de gerenciamento</li>
          <li>🎯 Cadastro de rifas ilimitadas</li>
          <li>🎁 Sorteios automáticos com segurança</li>
          <li>📱 Layout moderno e responsivo</li>
          <li>💰 Aumente sua renda com facilidade</li>
          <li>⚡ Pagamento por Pix com verificação automática, sem precisar do admin!</li>
        </ul>
      </div>

      <div className="highlight-box">
        <h3>⚡ Pagamento automático por Pix!</h3>
        <p>Assim que o cliente paga, o sistema verifica automaticamente, sem precisar da aprovação do administrador.</p>
      </div>

      <div className="cta-final">
        <h2>Assine agora e comece a criar rifas em minutos!</h2>
        <Link to="/planos" className="button cta-big">Quero Criar Rifas</Link>
      </div>
    </div>
  );
};

export default Home;

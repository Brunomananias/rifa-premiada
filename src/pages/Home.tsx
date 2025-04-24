import { Link } from 'react-router-dom';
import './Home.css'; // Criamos esse CSS para estilizar melhor a página

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🎉 Bem-vindo à Rifa Premiada!</h1>
        <p>Participe agora e concorra a prêmios incríveis toda semana!</p>
        <img 
          src="/images/premios-banner.jpg" 
          alt="Prêmios incríveis" 
          className="home-banner" 
        />

        <div className="home-buttons">
          <Link to="/rifas" className="button primary">Ver Rifas</Link>
          <Link to="/admin" className="button secondary">Área Administrativa</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

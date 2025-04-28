import { Link } from 'react-router-dom';
import './Home.css'; // Criamos esse CSS para estilizar melhor a página
import Button from '@mui/material/Button';

const Home = () => {

  
  const handleAbrirRoleta = () => {
    navigate('/roleta');
  };
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
          <Button variant="contained" color="primary" onClick={handleAbrirRoleta}>
        Abrir Roleta
      </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;

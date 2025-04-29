import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">🎟️ RifaPremiada</Link>

        <div className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Início</Link>
          <Link to="/como-funciona" onClick={() => setOpen(false)}>Como Funciona</Link>
          <Link to="/planos" onClick={() => setOpen(false)}>Preços</Link>
          <Link to="/rifas" onClick={() => setOpen(false)}>Rifas</Link>
          <Link to="/contato" onClick={() => setOpen(false)}>Contato</Link>
        </div>

        <div className="menu-icon" onClick={() => setOpen(!open)}>
          <div className={`bar ${open ? 'open' : ''}`}></div>
          <div className={`bar ${open ? 'open' : ''}`}></div>
          <div className={`bar ${open ? 'open' : ''}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

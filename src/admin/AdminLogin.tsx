import React, { useState } from 'react';
import axios from 'axios';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';


const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiClient.post('api/auth/login', {
        email,
        password: senha
      });
      
      // Aqui, você deveria receber o token e o user no response.data
      const { token, user } = response.data;
      
      // Atualiza o contexto
      login(token, user);
      
      // Redireciona
      navigate('/admin/dashboard');
      
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao fazer login');
      } else {
        setError('Erro desconhecido ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-header">
          <h1 className="logo">Rifa Premiada</h1>
          <h2>Bem-vindo de volta!</h2>
          <p className="subtitle">Insira suas informações abaixo para entrar na sua conta</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Endereço de e-mail</label>
            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error && !email ? 'input-error' : ''}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <div className="password-input-container">
              <input
                id="senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={error && !senha ? 'input-error' : ''}
                disabled={loading}
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          <div className="login-footer">
            <a href="/forgot-password" className="forgot-password">Esqueceu sua senha?</a>
            <p className="register-link">
              Ainda não tem uma conta?{' '}
              <span onClick={() => navigate('/register')}>Registre-se</span>
            </p>
          </div>
        </form>
      </div>

      <div className="login-banner">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/5579/5579459.png" 
          alt="Ilustração de dashboard" 
          className="banner-image"
        />
        <h3>Painel rápido e prático</h3>
        <p>Acompanhe suas campanhas de perto com relatórios detalhados</p>
      </div>
    </div>
  );
};

export default AdminLogin;
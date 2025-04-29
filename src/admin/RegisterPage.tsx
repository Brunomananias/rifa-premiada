import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você faria a chamada para a API de cadastro
    console.log('Formulário enviado:', form);
    navigate('/admin/dashboard');
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Crie sua conta</h2>
        <p>Insira suas informações para começar</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nome completo</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Digite seu nome"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Endereço de e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha"
            value={form.password}
            onChange={handleChange}
            required
          />

            <label htmlFor="password">Repita a senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Repita sua senha"
            value={form.password}
            onChange={handleChange}
            required
          />
          <p>Ao clicar no botão abaixo "Registrar", você concorda com nossos termos de uso e a nossa política de privacidade e confirma ter mais de 18 anos.</p>
          <button type="submit" className="btn-register">Registrar</button>
        </form>

        <p className="login-link">
          Já tem uma conta? <span onClick={() => navigate('/login')}>Entrar</span>
        </p>
      </div>

      <div className="register-side">
        <img src="/mockup.jpg" alt="Painel" />
        <h3>Gerencie suas rifas com facilidade</h3>
        <p>Dashboard completo, controle de clientes, sorteios e muito mais.</p>
      </div>
    </div>
  );
};

export default RegisterPage;

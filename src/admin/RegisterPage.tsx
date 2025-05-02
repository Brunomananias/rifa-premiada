/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './RegisterPage.css';
import apiClient from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const planName = searchParams.get("planName");
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
    whatsapp: '',
    document: '',
    plan_name: planName ? planName : ''
  });

  useEffect(() => {
    if (planName) {
      setForm((prev) => ({ ...prev, plan_name: planName }));
    }
  }, [planName]);

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
  
    if (value.length > 11) value = value.slice(0, 11);
  
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  
    setForm({ ...form, whatsapp: value });
  };
  
  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
  
    if (value.length > 11) value = value.slice(0, 11);
  
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  
    setForm({ ...form, document: value });
  };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.repeatPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      const response = await apiClient.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        whatsapp: form.whatsapp,
        document: form.document,
        planName: form.plan_name
      });
      console.log(form.plan_name);
      const data = response.data;
      console.log(data);
      login(data.token, data.user, data.planId, data.planName);
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data || 'Erro ao registrar');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Crie sua conta</h2>
        <p>Insira suas informações para começar</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name" style={{ color: 'black'}}>Nome completo</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Digite seu nome"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="email" style={{ color: 'black'}}>Endereço de e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="whatsapp" style={{ color: 'black' }}>WhatsApp</label>
          <input
            type="text"
            id="whatsapp"
            name="whatsapp"
            placeholder="Digite seu número"
            value={form.whatsapp}
            onChange={handleWhatsAppChange}
            required
          />

        <label htmlFor="document" style={{ color: 'black' }}>CPF</label>
        <input
          type="text"
          id="document"
          name="document"
          placeholder="Digite seu CPF"
          value={form.document}
          onChange={handleDocumentChange}
          required
        />

          <label htmlFor="password" style={{ color: 'black'}}>Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Crie uma senha"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="repeatPassword" style={{ color: 'black'}}>Repita a senha</label>
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            placeholder="Repita sua senha"
            value={form.repeatPassword}
            onChange={handleChange}
            required
          />

          {form.plan_name && (
            <p style={{ fontWeight: "bold", color: "#333" }}>
              Plano selecionado: <span style={{ color: "green" }}>{form.plan_name}</span>
            </p>
          )}

          <p>
            Ao clicar no botão abaixo "Registrar", você concorda com nossos termos de uso e a nossa política de privacidade e confirma ter mais de 18 anos.
          </p>

          <button type="submit" className="btn-register">Registrar</button>
        </form>

        <p className="login-link">
          Já tem uma conta? <span onClick={() => navigate('/admin')}>Entrar</span>
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

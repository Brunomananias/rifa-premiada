/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { FaPhone, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import './ContatoPage.css';

const ContatoPage = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{success: boolean, message: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulando envio para API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui você faria a chamada real para sua API
      // const response = await apiClient.post('/api/contato', formData);
      
      setSubmitStatus({
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
      });
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contato-container">
      <div className="contato-header">
        <h1>Fale Conosco</h1>
        <p>Estamos aqui para ajudar. Entre em contato através do formulário ou pelos nossos canais diretos.</p>
      </div>

      <div className="contato-content">
        <div className="contato-form">
          <h2>Envie sua mensagem</h2>
          
          {submitStatus && (
            <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome">Nome Completo*</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">E-mail*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="assunto">Assunto*</label>
              <select
                id="assunto"
                name="assunto"
                value={formData.assunto}
                onChange={handleChange}
                required
              >
                <option value="">Selecione um assunto</option>
                <option value="Dúvida sobre rifas">Dúvida sobre rifas</option>
                <option value="Problema com pagamento">Problema com pagamento</option>
                <option value="Sugestão">Sugestão</option>
                <option value="Parceria">Parceria</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem*</label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={5}
                value={formData.mensagem}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : (
                <>
                  <FaPaperPlane /> Enviar Mensagem
                </>
              )}
            </button>
          </form>
        </div>

        <div className="contato-info">
          <h2>Informações de Contato</h2>

          <div className="info-card">
            <div className="info-icon">
              <FaPhone />
            </div>
            <div className="info-content">
              <h3>Telefones</h3>
              <p>(11) 9999-9999</p>
              <p>(11) 8888-8888 (WhatsApp)</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaEnvelope />
            </div>
            <div className="info-content">
              <h3>E-mails</h3>
              <p>contato@rifasapp.com</p>
              <p>suporte@rifasapp.com</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <FaClock />
            </div>
            <div className="info-content">
              <h3>Horário de Atendimento</h3>
              <p>Segunda a Sexta: 9h às 18h</p>
              <p>Sábado: 9h às 13h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContatoPage;
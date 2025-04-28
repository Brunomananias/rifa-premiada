import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ComoFuncionaPage.css';

const ComoFunciona = () => {
  const [activeTab, setActiveTab] = useState<'participante' | 'admin'>('participante');

  return (
    <div className="como-funciona-container">
      <div className="header">
        <h1 style={{color: 'white'}}>Como Funciona</h1>
        <p>Entenda o passo a passo para participar e administrar rifas</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'participante' ? 'active' : ''}`}
          onClick={() => setActiveTab('participante')}
        >
          Para Participantes
        </button>
        <button 
          className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          Para Administradores
        </button>
      </div>

      <div className="content">
        {activeTab === 'participante' ? (
          <div className="participante-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Escolha sua rifa</h3>
                <p>Navegue pelas rifas disponíveis e selecione aquela que deseja participar.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Selecione suas cotas</h3>
                <p>Escolha a quantidade de cotas que deseja comprar ou utilize nossos botões de atalho.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Finalize o pagamento</h3>
                <p>Complete o checkout com seus dados e realize o pagamento através do nosso sistema seguro.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Aguarde o sorteio</h3>
                <p>Você receberá os números das suas cotas por whatsapp e poderá acompanhar a data do sorteio.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Confira o resultado</h3>
                <p>O sorteio será realizado ao vivo e o resultado publicado em nosso site e redes sociais.</p>
              </div>
            </div>

            <Link to="/rifas" className="cta-button">
              Quero Participar!
            </Link>
          </div>
        ) : (
          <div className="admin-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Cadastre-se como administrador</h3>
                <p>Realize o pagamento da taxa administrativa para ter acesso ao painel de controle.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Crie sua rifa</h3>
                <p>Preencha todos os detalhes do prêmio, valor das cotas, data do sorteio e upload de imagens.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Monitore as vendas</h3>
                <p>Acompanhe em tempo real o progresso de vendas de cada rifa através de gráficos e relatórios.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Realize o sorteio</h3>
                <p>Nosso sistema gera o ganhador aleatoriamente e você pode transmitir o sorteio ao vivo.</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">5</div>
              <div className="step-content">
                <h3>Entregue o prêmio</h3>
                <p>Entre em contato com o ganhador e coordene a entrega do prêmio.</p>
              </div>
            </div>

            <Link to="/admin/register" className="cta-button">
              Quero ser Administrador
            </Link>
          </div>
        )}
      </div>

      <div className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-item">
          <h3>Como é garantida a lisura do sorteio?</h3>
          <p>Nosso sistema utiliza algoritmos certificados para geração aleatória e todos os sorteios podem ser auditados. Além disso, incentivamos a transmissão ao vivo dos sorteios.</p>
        </div>
        <div className="faq-item">
          <h3>Quanto tempo tenho para pagar minhas cotas?</h3>
          <p>O pagamento deve ser realizado imediatamente após a seleção das cotas. Reservamos os números por 30 minutos durante o processo de checkout.</p>
        </div>
        <div className="faq-item">
          <h3>Posso cancelar uma rifa que criei?</h3>
          <p>Rifas podem ser canceladas apenas antes do início das vendas. Após o lançamento, apenas em casos excepcionais e com devolução integral aos participantes.</p>
        </div>
      </div>
    </div>
  );
};

export default ComoFunciona;
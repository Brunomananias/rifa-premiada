import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient'; // <-- certifique que está importando aqui
import './PagamentoConcluidoPage.css';

interface PagamentoState {
    numerosSelecionados: number[];
    rifaTitle: string;
    paymentId: number; // Adicionei paymentId
}

const PagamentoConcluidoPage = () => {
    const location = useLocation();
    const state = location.state as PagamentoState;
    console.log(state);
    useEffect(() => {
        const updatePixStatus = async () => {
            if (!state?.paymentId) return;
         
            try {
                await apiClient.put(`api/PixTransactions/update-pix-status/${state.paymentId}`, {
                    status: 'approved'
                });
                console.log('Pix status atualizado com sucesso!');
            } catch (error) {
                console.error('Erro ao atualizar o status do Pix:', error);
            }
        };

        updatePixStatus();
    }, [state?.paymentId]);

    if (!state) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="pagamento-concluido-container">
            <div className="confirmation-card">
                <div className="confirmation-header">
                    <svg className="confirmation-icon" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                    </svg>
                    <h1>Pagamento Concluído!</h1>
                    <p className="subtitle">Seus números foram reservados com sucesso</p>
                </div>

                <div className="rifa-info">
                    <h2>{state.rifaTitle || 'Rifa'}</h2>
                    <p>Você adquiriu os seguintes números:</p>

                    <div className="numeros-container">
                        {state.numerosSelecionados.map((numero) => (
                            <span key={numero} className="numero-badge">
                                {numero}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="primary-button" onClick={() => window.print()}>
                        Imprimir Comprovante
                    </button>
                    <button className="secondary-button" onClick={() => window.location.href = '/'}>
                        Voltar ao Início
                    </button>
                </div>

                <div className="additional-info">
                    <p>Um e-mail de confirmação foi enviado para você.</p>
                    <p>Em caso de dúvidas, entre em contato conosco.</p>
                </div>
            </div>
        </div>
    );
};

export default PagamentoConcluidoPage;

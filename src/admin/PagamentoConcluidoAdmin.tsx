import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import apiClient from '../services/apiClient'; // <-- certifique que está importando aqui
import './PagamentoConcluidoAdmin.css';

interface PagamentoState {
    planName: string;
    paymentId: number;
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
                    <p className="subtitle">Agora sua assinatura é {state.planName} !</p>
                </div>
                <div className="action-buttons">
                    <button className="primary-button" onClick={() => window.print()}>
                        Imprimir Comprovante
                    </button>
                    <button className="secondary-button" onClick={() => window.location.href = '/admin/dashboard'}>
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

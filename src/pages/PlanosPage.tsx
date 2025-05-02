/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./PlanosPage.css";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
// Defina a interface para os planos
interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  billing_Cycle: string;  // Ex: "mensal", "único"
  campaign_Limit: number;
  number_Limit: number;
  is_Active: boolean;
  created_At: string;
}

const PlanosPage: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      const response = await apiClient.get('api/plans');
      if (!response) {
        throw new Error('Erro ao buscar planos');
      }
      const data = await response.data;
      setPlans(data);
    } catch (error: any) {
      setError(error?.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(); // Chama a função para buscar os planos
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <section className="pricing-section">
      <h1 className="pricing-title">Escolha seu Plano</h1>
      <div className="plans-container">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.id}>
            <h2>{plan.name}</h2>
            <p className="plan-price">
              {plan.billing_Cycle === "único"
                ? `R$ ${plan.price} único`
                : `R$ ${plan.price}/mês`}
            </p>
            <ul>
              {plan.description.replace(/\\n/g, '\n').split('\n').map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button
                className="subscribe-button"
                onClick={() => navigate(`/register?planName=${plan.name}&planId=${plan.id}`)}
                disabled={!plan.is_Active}
              >
                {plan.is_Active ? "Assinar" : "Indisponível"}
              </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlanosPage;

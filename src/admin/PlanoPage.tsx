/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminLayout from "./AdminLayout";
import apiClient from "../services/apiClient";
import { useNavigate } from "react-router-dom";
import "./PlanoPage.css";

interface Plan {
  id: number;
  name: string;
  description: string;
  price: string;
  billing_Cycle: string;
  campaign_Limit: number;
  number_Limit: number;
  is_Active: boolean;
  created_At: string;
}

const PlanoPage: React.FC = () => {
  const [pixData, setPixData] = useState<{
    QrCodeBase64: string;
    QrCodeText: string;
    PaymentId: string;
  } | null>(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const planId = localStorage.getItem('plan_id');
  
  const navigate = useNavigate(); // Hook do React Router para navegação

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await apiClient.get("/api/plans");
        setPlans(response.data);
      } catch (err: any) {
        setError("Erro ao buscar planos");
      } finally {
        setLoading(false);
      }
    };
 
    const fetchSelectedPlan = async () => {
      try {
        const response = await apiClient.get(`/api/plans/${planId}`);
        setSelectedPlan(response.data);
      } catch (err: any) {
        setError("Erro ao buscar planos");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedPlan();
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!pixData?.PaymentId || !checkingPayment) return;
  
    const interval = setInterval(async () => {
      try {
        const res = await apiClient.get(`/api/pagamentos/status/${pixData.PaymentId}`);
        const status = res.data.status;
  
        if (status === "approved") {
          clearInterval(interval);
          alert("Pagamento aprovado!");
          window.location.href = "/admin/dashboard";
        }
      } catch (err) {
        console.error("Erro ao checar status do pagamento", err);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [pixData, checkingPayment]);
  

  const handleSubscribe = async (plan: Plan) => {
    try {
      const userEmail = await apiClient.get(`/api/users/user-email?idUser=${user}`);
      const response = await apiClient.post("/api/MercadoPago", {
        Valor: parseFloat(plan.price),
        Descricao: `Assinatura do plano ${plan.name}`,
        Email: userEmail.data
      });

      setPixData(response.data);
      setCheckingPayment(true);

      navigate('/admin/pixMercadoPago', {
        state: {
          idPixTransaction: plan.id,
          name: plan.name,
          id: plan.id,
          price: plan.price
        }
      });
    } catch (error) {
      console.error("Erro ao criar pagamento PIX", error);
      setError("Erro ao iniciar pagamento PIX.");
    }
  };

  if (!user) return <div>Carregando usuário...</div>;
  if (loading) return <div>Carregando planos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <AdminLayout>
      {pixData && (
        <div style={{ marginTop: "2rem", background: "#fff", padding: "1rem", borderRadius: "8px", color: "#000" }}>
          <h3>Pagamento via Pix</h3>
          <p>Escaneie o QR Code abaixo ou copie o código Pix:</p>
          <img src={`data:image/png;base64,${pixData.QrCodeBase64}`} alt="QR Code Pix" style={{ width: 256 }} />
          <textarea
            readOnly
            value={pixData.QrCodeText}
            style={{ width: "100%", marginTop: "1rem" }}
          />
          <p>Aguardando confirmação do pagamento...</p>
        </div>
      )}

      <div style={{ background: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
        <h1 style={{ color: 'white'}}>Detalhes do Plano</h1>
        <div style={{ marginTop: "1rem", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
          <p style={{ color: "#000" }}><strong>Nome do Plano:</strong> {selectedPlan?.name || "Free"}</p>
          <p style={{ color: "#000" }}><strong>Limite de Rifas:</strong> {selectedPlan?.campaign_Limit || "1000"}</p>
          <p style={{ color: "#000" }}><strong>Validade:</strong> {user.plano_validade || "Sem vencimento"}</p>
          <p style={{ color: "#000" }}><strong>Detalhes do plano:</strong> {selectedPlan?.description.replace(/\\n/g, "\n").split("\n").join(", ") || "1000"}</p>
          <p style={{ color: "#000" }}><strong>Suporte Premium:</strong> {user.plano_suporte ? "Sim" : "Não"}</p>
        </div>

        <h2 style={{ marginTop: "2rem" }}>Mudar de Plano</h2>
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
                {plan.description.replace(/\\n/g, "\n").split("\n").map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                className="subscribe-button"
                disabled={!plan.is_Active}
                onClick={() => handleSubscribe(plan)}
              >
                {plan.is_Active ? "Assinar" : "Indisponível"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PlanoPage;

import React from "react";
import "./PlanosPage.css";

interface Plan {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
}

const plans: Plan[] = [
    {
        title: "Campanha única",
        price: "R$ 60 uma única vez",
        features: [
          "1 campanha",
          "10.000 bilhetes",
          "Lista de compradores",
          "Dashboard simples",
        ],
        buttonText: "Assinar",
      },
  {
    title: "Plano Básico",
    price: "R$ 149/mês",
    features: [
      "2 campanhas por mês",
      "30.000 bilhetes",
      "Sorteio manual",
      "Lista de clientes",
      "Lista de compradores",
      "Dashboard simples",
    ],
    buttonText: "Assinar",
  },
  {
    title: "Plano Intermediário",
    price: "R$ 299/mês",
    features: [
      "5 campanhas por mês",
      "70.000 bilhetes",
      "Roleta",
      "Números premiados",
      "Maior e Menor Cota",
      "Dashboard avançado",
      "Suporte WhatsApp",
    ],
    buttonText: "Assinar",
  },
  {
    title: "Plano Avançado",
    price: "R$ 499/mês",
    features: [
      "10 campanhas por mês",
      "bilhetes ilimitados",
      "Números premiados",
      "Roleta",
      "Dashboard completo",
      "Suporte prioritário",
    ],
    buttonText: "Assinar",
  },
];

const PlanosPage: React.FC = () => {
  return (
    <section className="pricing-section">
      <h1 className="pricing-title">Escolha seu Plano</h1>
      <div className="plans-container">
        {plans.map((plan, index) => (
          <div className="plan-card" key={index}>
            <h2>{plan.title}</h2>
            <p className="plan-price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            <button className="subscribe-button">{plan.buttonText}</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlanosPage;

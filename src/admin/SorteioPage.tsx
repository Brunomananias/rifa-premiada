/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "./SorteioPage.css"; // Importando o CSS separado
import apiClient from "../services/apiClient";
import AdminLayout from "./AdminLayout";

export default function SorteioPage() {
  const [rifas, setRifas] = useState<any[]>([]);
  const [rifaSelecionada, setRifaSelecionada] = useState<string>("");
  const [numeroSorteado, setNumeroSorteado] = useState<number | null>(null);
  const [nomeComprador, setNomeComprador] = useState<string | null>(null); // Novo estado para nome do comprador
  const [sorteando, setSorteando] = useState(false);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await apiClient.get('/api/raffles');
        setRifas(response.data);
      } catch (error) {
        console.error("Erro ao buscar rifas:", error);
      }
    };

    fetchRifas();
  }, []);

  const sortearNumero = async () => {
    if (!rifaSelecionada) {
      setErro("Selecione uma rifa antes de sortear!");
      return;
    }

    setErro("");
    setSorteando(true);
    setNumeroSorteado(null);
    setNomeComprador(null); // Resetando o nome do comprador

    try {
      const response = await apiClient.post(`/api/raffles/${rifaSelecionada}/sortear`);
      const { numeroSorteado, nomeComprador } = response.data; // Agora recebemos o nome do comprador

      setTimeout(() => { // animação simulada
        setNumeroSorteado(numeroSorteado);
        setNomeComprador(nomeComprador); // Armazenando o nome do comprador
        setSorteando(false);
      }, 2000);
    } catch (error) {
      console.error("Erro ao sortear:", error);
      setErro("Erro ao realizar o sorteio.");
      setSorteando(false);
    }
  };

  return (
    <AdminLayout>
      <div className="sorteio-container">
        <h1>🎯 Sorteio de Números</h1>

        <div className="select-container">
          <select
            value={rifaSelecionada}
            onChange={(e) => setRifaSelecionada(e.target.value)}
            disabled={sorteando}
          >
            <option value="">Selecione a Rifa</option>
            {rifas.map(r => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={sortearNumero}
          className="btn-sortear"
          disabled={sorteando || !rifaSelecionada}
        >
          {sorteando ? "Sorteando..." : "Sortear Número"}
        </button>

        {erro && <div className="erro">{erro}</div>}

        {numeroSorteado !== null && (
          <div className="numero-sorteado">
            🎉 Número sorteado: <strong>{numeroSorteado}</strong>
          </div>
        )}

        {nomeComprador && (
          <div className="comprador">
            O número sorteado foi comprado por: <strong>{nomeComprador}</strong>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

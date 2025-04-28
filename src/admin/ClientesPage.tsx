import React, { useEffect, useState } from "react";
import apiClient from "../services/apiClient"; // Ajuste o caminho conforme sua estrutura
import AdminLayout from "./AdminLayout";

type Comprador = {
  id: number;
  name: string;
  dataCadastro: string;
  whatsapp: string;
  quantidadeNumeros: number;
  totalPago: string;
  statusPagamento: string;
};

export default function CompradoresPage() {
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompradores, setFilteredCompradores] = useState<Comprador[]>(
    []
  );

  useEffect(() => {
    const fetchCompradores = async () => {
      try {
        const response = await apiClient.get("api/users/compradores");
        setCompradores(response.data);
        setFilteredCompradores(response.data);
      } catch (error) {
        console.error("Erro ao buscar compradores:", error);
      }
    };

    fetchCompradores();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCompradores(compradores);
    } else {
      const filtered = compradores.filter(
        (c) =>
          c.nome_usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.whatsapp.includes(searchTerm)
      );
      setFilteredCompradores(filtered);
    }
  }, [searchTerm, compradores]);

  const formatData = (data: string) => {
    let formattedDate = new Date(data);

    // Se data não for um objeto Date válido, tenta formatar a string
    if (isNaN(formattedDate.getTime())) {
      // Caso a data seja uma string no formato "DD/MM/YYYY HH:mm"
      const [date, time] = data.split(" ");
      const [day, month, year] = date.split("/");
      formattedDate = new Date(`${year}-${month}-${day}T${time}:00`);
    }

    return formattedDate.toLocaleString("pt-BR");
  };

  return (
    <AdminLayout>
      <div
        style={{
          background: "#111",
          minHeight: "100vh",
          padding: "2rem",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            marginBottom: "1rem",
            textAlign: "center",
            color: "white"
          }}
        >
          Lista de Compradores
        </h1>

        {/* Barra de Busca */}
        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <input
            type="text"
            placeholder="Buscar por nome ou WhatsApp"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "8px",
              border: "1px solid #333",
              background: "#222",
              color: "#fff",
              marginBottom: "1rem",
            }}
          />
        </div>

        {/* Tabela */}
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
        <thead>
          <tr>
          <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Id</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Nome</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>WhatsApp</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Números Comprados</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Total Pago</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Status Pagamento</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #444' }}>Data Cadastro</th>
          </tr>
        </thead>
        <tbody>
          {filteredCompradores.map((c) => (
            <tr key={c.id} style={{ background: '#1e1e1e', borderBottom: '1px solid #333' }}>
              <td style={{ padding: '1rem' }}>{c.id}</td>
              <td style={{ padding: '1rem' }}>{c.name}</td>
              <td style={{ padding: '1rem' }}>{c.whatsapp}</td>
              <td style={{ padding: '1rem' }}>{c.quantidadeNumeros}</td>
              <td style={{ padding: '1rem' }}>R$ {c.totalPago.toFixed(2)}</td>
              <td style={{ padding: '1rem' }}>
                <span
                  style={{
                    color: c.statusPagamento === 'Pago' ? 'limegreen' : 'orange',
                    fontWeight: 'bold',
                  }}
                >
                  {c.statusPagamento}
                </span>
              </td>
              <td style={{ padding: '1rem' }}>
                    {c.dataCadastro ? formatData(c.dataCadastro) : 'Data Inválida'}
                    </td>


            </tr>
          ))}
        </tbody>
      </table>
       
      </div>
    </AdminLayout>
  );
}

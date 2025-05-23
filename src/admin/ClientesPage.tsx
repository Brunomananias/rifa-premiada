import { useEffect, useState } from "react";
import apiClient, { idUser } from "../services/apiClient"; // Ajuste o caminho conforme sua estrutura
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
        const response = await apiClient.get("api/customer/customers", {
          params: {userId: idUser}
        });
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
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.whatsapp.includes(searchTerm)
      );
      setFilteredCompradores(filtered);
    }
  }, [searchTerm, compradores]);

  const formatData = (data: string) => {
    let formattedDate = new Date(data);
  
    if (isNaN(formattedDate.getTime())) {
      const [date, time] = data.split(" ");
      const [day, month, year] = date.split("/");
      formattedDate = new Date(`${year}-${month}-${day}T${time}:00Z`);
    }
  
    // Agora converte de UTC para horário de Brasília (UTC-3)
    const timezoneOffset = -3 * 60; // -3 horas em minutos
    const localDate = new Date(formattedDate.getTime() + timezoneOffset * 60000);
  
    return localDate.toLocaleString("pt-BR");
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
          Lista de Clientes
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
              <td style={{ padding: '1rem' }}>
                R$ {parseFloat(c.totalPago).toFixed(2)}
              </td>
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

import { useEffect, useState } from "react";
import apiClient from "../services/apiClient";
import AdminLayout from "./AdminLayout";

type Comprador = {
  compra_id: number;
  nome_usuario: string;
  nome_rifa: string;
  dataUpdated: string;
  whatsapp: string;
  quantidade_numbers: number;
  totalprice: string;
  payment_status: string;
};

export default function CompradoresPage() {
  const [compradores, setCompradores] = useState<Comprador[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompradores, setFilteredCompradores] = useState<Comprador[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchCompradores = async () => {
      try {
        const response = await apiClient.get("api/NumbersSold/compras");
        setCompradores(response.data);
        setFilteredCompradores(response.data);
      } catch (error) {
        console.error("Erro ao buscar compradores:", error);
      }
    };

    fetchCompradores();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // resetar a página ao filtrar
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
    if (isNaN(formattedDate.getTime())) {
      const [date, time] = data.split(" ");
      const [day, month, year] = date.split("/");
      formattedDate = new Date(`${year}-${month}-${day}T${time}:00Z`);
    }
    const timezoneOffset = -3 * 60;
    const localDate = new Date(formattedDate.getTime() + timezoneOffset * 60000);
    return localDate.toLocaleString("pt-BR");
  };

  // Paginação
  const totalPages = Math.ceil(filteredCompradores.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCompradores.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminLayout>
      <div style={{ background: "#111", minHeight: "100vh", padding: "2rem", color: "#fff" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", textAlign: "center", color: "white" }}>
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
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Id</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Data</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Campanha</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Cliente</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Whatsapp</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Qtd</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Valor R$</th>
              <th style={{ padding: "1rem", borderBottom: "1px solid #444" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((c) => (
              <tr key={c.compra_id} style={{ background: "#1e1e1e", borderBottom: "1px solid #333" }}>
                <td style={{ padding: "1rem" }}>{c.compra_id}</td>
                <td style={{ padding: "1rem" }}>{formatData(c.dataUpdated)}</td>
                <td style={{ padding: "1rem" }}>{c.nome_rifa}</td>
                <td style={{ padding: "1rem" }}>{c.nome_usuario}</td>
                <td style={{ padding: "1rem" }}>{c.whatsapp}</td>
                <td style={{ padding: "1rem" }}>{c.quantidade_numbers}</td>
                <td style={{ padding: "1rem" }}>
                  R${" "}
                  {!isNaN(parseFloat(c.totalprice.replace(",", "."))) &&
                  parseFloat(c.totalprice.replace(",", ".")) > 0
                    ? parseFloat(c.totalprice.replace(",", ".")).toFixed(2)
                    : "0,00"}
                </td>
                <td style={{ padding: "1rem" }}>
                  <span
                    style={{
                      color: c.payment_status === "paid" ? "limegreen" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {c.payment_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              style={{
                margin: "0 5px",
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
                background: currentPage === i + 1 ? "#444" : "#222",
                color: "#fff",
                padding: "0.4rem 0.8rem",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Próxima
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Tab,
  Tabs,
  TextField,
  Typography,
  Button,
  Divider,
  useMediaQuery,
  useTheme,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import AdminLayout from "./AdminLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import apiClient from "../services/apiClient";

interface Raffle {
  id: number;
  title: string;
  description: string;
  price: number;
  total_Numbers: number;
  image_Url: string;
  soldNumbers?: number;
  enabled_Ranking?: boolean;
  ranking_Message?: string;
  ranking_Quantity?: number;
  type_Ranking?: string;
  winnerName?: string;
  winnerPhone?: string;
  drawnNumber?: number;
}

const EditRaffleTabs = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabIndex, setTabIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [rankingType, setRankingType] = useState<"diario" | "total">("diario");
  //   const [formData, setFormData] = useState({
  //     nome: '',
  //     descricao: '',
  //     quantidadeCotas: '',
  //     precoCota: '',
  //   });

  const [currentRaffle, setCurrentRaffle] = useState<Raffle>({
    id: 0,
    title: "",
    description: "",
    price: 1,
    total_Numbers: 100,
    image_Url: "",
    soldNumbers: 0,
    enabled_Ranking: false,
    ranking_Message: "",
    ranking_Quantity: 0,
    type_Ranking: "",
    winnerName: "",
    winnerPhone: "",
    drawnNumber: 0,
  });

  useEffect(() => {
    const fetchRaffleData = async () => {
      try {
        const response = await apiClient.get(`api/Raffles/${id}`);
        const raffleData = response.data;
        setCurrentRaffle(raffleData);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados da rifa", error);
        handleSnackbar("Erro ao carregar dados da rifa", "error");
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRaffleData();
    }
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCurrentRaffle((prev) => {
      // For number fields, convert the string to number
      if (name === "price" || name === "total_Numbers") {
        return {
          ...prev,
          [name]: value === "" ? 0 : Number(value),
        };
      }

      // For other fields, keep as string
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSubmit = async () => {
    if (
      !currentRaffle.title ||
      !currentRaffle.description ||
      !currentRaffle.total_Numbers ||
      !currentRaffle.price
    ) {
      handleSnackbar("Preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      await apiClient.put(`api/Raffles/${id}`, {
        title: currentRaffle.title,
        description: currentRaffle.description,
        price: currentRaffle.price,
        total_Numbers: currentRaffle.total_Numbers,
        image_Url: currentRaffle.image_Url,
        enabled_ranking: currentRaffle.enabled_Ranking,
        ranking_message: currentRaffle.ranking_Message,
        ranking_quantity: currentRaffle.ranking_Quantity,
        type_ranking: rankingType,
      });

      handleSnackbar("Dados salvos com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao salvar alterações", error);
      handleSnackbar("Erro ao salvar alterações.", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageForm = new FormData();
    imageForm.append("image", file);

    try {
      const response = await apiClient.post(
        "api/Raffles/UploadImage",
        imageForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCurrentRaffle((prev) => ({ ...prev, image_Url: response.data.url }));
      handleSnackbar("Imagem enviada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao fazer upload da imagem", error);
      handleSnackbar("Erro ao fazer upload da imagem.", "error");
    }
  };

  const handleRemoveImage = () => {
    setCurrentRaffle((prev) => ({ ...prev, image_Url: "" }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#121212",
          }}
        >
          <CircularProgress color="secondary" />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box
        sx={{
          ml: isMobile ? 0 : "20px",
          p: 3,
          backgroundColor: "#121212",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Editar Rifa: {currentRaffle.title}
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: "#444" }}
        >
          {[
            "Editar Dados",
            "Imagens",
            "Ranking",
            "Ganhador",
            "Cotas Premiadas",
            "Roleta",
          ].map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                color: "white",
                "&.Mui-selected": {
                  color: "yellow",
                },
              }}
            />
          ))}
        </Tabs>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        {tabIndex === 0 && (
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              maxWidth: "600px",
            }}
          >
            <TextField
              fullWidth
              label="Nome da Rifa"
              name="title" // Changed to match Raffle interface
              value={currentRaffle.title}
              onChange={handleChange}
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{ backgroundColor: "#1e1e1e" }}
            />

            <TextField
              fullWidth
              label="Descrição"
              name="description" // Changed to match Raffle interface
              value={currentRaffle.description}
              onChange={handleChange}
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{ backgroundColor: "#1e1e1e" }}
            />

            <TextField
              fullWidth
              label="Quantidade de Cotas"
              name="total_Numbers" // Changed to match Raffle interface
              type="number"
              value={currentRaffle.total_Numbers}
              onChange={handleChange}
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{ backgroundColor: "#1e1e1e" }}
            />

            <TextField
              fullWidth
              label="Preço da Cota (R$)"
              name="price" // Changed to match Raffle interface
              type="number"
              value={currentRaffle.price}
              onChange={handleChange}
              variant="filled"
              InputProps={{ style: { color: "white" } }}
              InputLabelProps={{ style: { color: "#aaa" } }}
              sx={{ backgroundColor: "#1e1e1e" }}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit}
            >
              Salvar Alterações
            </Button>
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ mt: 3, maxWidth: 500 }}>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={<FontAwesomeIcon icon={faImage} />}
              sx={{
                py: 1.5,
                borderColor: "#ddd",
                "&:hover": {
                  borderColor: "#FF4B2B",
                  color: "#FF4B2B",
                },
              }}
            >
              Upload Imagem
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </Button>

            {currentRaffle.image_Url && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mt: 2,
                  position: "relative",
                }}
              >
                <img
                  src={currentRaffle.image_Url}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 250,
                    objectFit: "contain",
                    borderRadius: 8,
                    border: "1px solid #eee",
                  }}
                />
                <IconButton
                  onClick={handleRemoveImage}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      backgroundColor: "#FF4B2B",
                      color: "#fff",
                    },
                  }}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {tabIndex === 2 && (
          <Box sx={{ mt: 3, maxWidth: 500 }}>
            <div className="gateway-label" style={{ color: "white" }}>
              Habilitar Ranking na página da rifa:
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={currentRaffle.enabled_Ranking || false}
                    onChange={() => {
                    setCurrentRaffle(prev => ({
                        ...prev,
                        enabled_Ranking: !prev.enabled_Ranking
                    }));
                    }}
                />
                <span className="slider round"></span>
                </label>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ color: "white", mb: 1 }}>
                Tipo de Ranking:
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                    variant={currentRaffle.type_Ranking === "diario" ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => {
                        setRankingType("diario");
                        setCurrentRaffle(prev => ({...prev, type_Ranking: "diario"}));
                    }}
                    sx={{
                        color: currentRaffle.type_Ranking === "diario" ? "white" : "inherit",
                        flex: 1,
                    }}
                    >
                    Diário
                    </Button>
                    <Button
                    variant={currentRaffle.type_Ranking === "total" ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => {
                        setRankingType("total");
                        setCurrentRaffle(prev => ({...prev, type_Ranking: "total"}));
                    }}
                    sx={{
                        color: currentRaffle.type_Ranking === "total" ? "white" : "inherit",
                        flex: 1,
                    }}
                    >
                    Total
                    </Button>
              </Box>

              <TextField
                fullWidth
                label="Quantidade de compradores"
                name="quantidadeCompradores"
                type="number"
                value={currentRaffle.ranking_Quantity}
                onChange={handleChange}
                variant="filled"
                InputProps={{
                  style: { color: "white" },
                  inputProps: {
                    min: 1,
                  },
                }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{
                  backgroundColor: "#1e1e1e",
                  marginTop: 3,
                }}
              />
              <TextField
                fullWidth
                label="Mensagem da promoção do ranking"
                name="mensagemPromocao"
                type="text"
                value={currentRaffle.ranking_Message}
                onChange={handleChange}
                variant="filled"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{ backgroundColor: "#1e1e1e" }}
                style={{ marginTop: 30 }}
              />
            </Box>
          </Box>
        )}

        {tabIndex === 3 && (
          <Box sx={{ mt: 3, maxWidth: 500 }}>            
              <TextField
                fullWidth
                label="Ganhador"
                name="ganhador"
                type="text"
                value={currentRaffle.winnerName}
                onChange={handleChange}                
                variant="filled"
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{ backgroundColor: "#1e1e1e" }}
              />
              <TextField
                fullWidth
                label="Whatsapp"
                name="mensagemPromocao"
                type="text"
                value={currentRaffle.winnerPhone}
                onChange={handleChange}
                variant="filled"                
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{ backgroundColor: "#1e1e1e" }}
                style={{ marginTop: 30 }}
              />
               <TextField
                fullWidth
                label="Número sorteado"
                name="numeroSorteado"
                type="text"
                value={currentRaffle.drawnNumber}
                onChange={handleChange}
                variant="filled"            
                InputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "#aaa" } }}
                sx={{ backgroundColor: "#1e1e1e" }}
                style={{ marginTop: 30 }}
              />        
          </Box>
        )}

        {/* Demais abas podem ser implementadas aqui */}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default EditRaffleTabs;

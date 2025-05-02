import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import apiClient from '../services/apiClient';
import { TextField, Button, Typography, Box, Snackbar, Alert, LinearProgress, Modal, Backdrop, Fade } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faEdit, 
  faPlusCircle, 
  faHeading, 
  faAlignLeft, 
  faTag, 
  faHashtag, 
  faImage, 
  faTrashAlt, 
  faSave, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';
import './RifasAdmin.css';

interface Raffle {
  id: number;
  title: string;
  description: string;
  price: number;
  total_Numbers: number;
  image_Url: string;
  soldNumbers?: number;
}

const RafflesAdmin = () => {
  const planId = localStorage.getItem('plan_id');
  const idUser = localStorage.getItem('user');
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [currentRaffle, setCurrentRaffle] = useState<Raffle>({
    id: Date.now(),
    title: '',
    description: '',
    price: 1,
    total_Numbers: 100,
    image_Url: '',
    soldNumbers: 0
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Modal states
  const [openModal, setOpenModal] = useState(false);

  const handleSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentRaffle({ ...currentRaffle, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await apiClient.post('api/Raffles/UploadImage', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCurrentRaffle({ ...currentRaffle, image_Url: response.data.url });
    } catch (error) {
      console.error('Error uploading image', error);
      handleSnackbar('Erro ao fazer upload da imagem.', 'error');
    }
  };

  const handleAddOrUpdateRaffle = async () => {
    if (!currentRaffle.title || !currentRaffle.image_Url) {
      handleSnackbar('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    try {
      if ((planId == "5") && currentRaffle.total_Numbers > 500) {
        toast.warning("Não é possível colocar a quantidade de números. Altere seu plano para liberar mais.");
        return;
      }else if(planId == "1" && currentRaffle.total_Numbers > 10000){
        toast.warning("Não é possível colocar a quantidade de números. Altere seu plano para liberar mais.");
        return;
      }else if(planId == "2" && currentRaffle.total_Numbers > 30000){
        toast.warning("Não é possível colocar a quantidade de números. Altere seu plano para liberar mais.");
        return;
      }else if(planId == "3" && currentRaffle.total_Numbers > 70000){
      toast.warning("Não é possível colocar a quantidade de números. Altere seu plano para liberar mais.");
      return;
    }
      if (editingId) {
        // Atualizar rifa existente
        await apiClient.put(`api/Raffles/${editingId}`, {
          title: currentRaffle.title,
          description: currentRaffle.description,
          price: currentRaffle.price,
          total_Numbers: currentRaffle.total_Numbers,
          image_Url: currentRaffle.image_Url,
        });

        const updatedRaffles = raffles.map((raffle) =>
          raffle.id === editingId ? { ...raffle, ...currentRaffle } : raffle
        );
        setRaffles(updatedRaffles);
        handleSnackbar('Rifa atualizada com sucesso!', 'success');
      } else {
        // Criar nova rifa
        const response = await apiClient.post('api/Raffles', {
          title: currentRaffle.title,
          description: currentRaffle.description,
          price: currentRaffle.price,
          total_Numbers: currentRaffle.total_Numbers,
          image_Url: currentRaffle.image_Url,
          user_id: idUser
        });

        setRaffles([...raffles, response.data]);
        handleSnackbar('Rifa registrada com sucesso!', 'success');
      }

      // Resetar formulário
      setCurrentRaffle({
        id: Date.now(),
        title: '',
        description: '',
        price: 1,
        total_Numbers: 100,
        image_Url: '',
        soldNumbers: 0,
      });
      setEditingId(null);
      setOpenModal(false); // Fechar o modal após salvar

    } catch (error) {
      console.error('Failed to save raffle', error);
      handleSnackbar('Erro ao salvar a rifa. Tente novamente.', 'error');
    }
  };

  const handleDeleteRaffle = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta rifa?')) return;
    try {
      await apiClient.delete(`api/Raffles/${id}`);
      setRaffles(raffles.filter((r) => r.id !== id));
      handleSnackbar('Rifa deletada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar rifa', error);
      handleSnackbar('Erro ao deletar a rifa. Tente novamente.', 'error');
    }
  };

  const loadRaffles = async () => {
    try {
      const response = await apiClient.get('api/Raffles', {
        params: { idUsuarioLogado: idUser }
      });
      setRaffles(response.data);
    } catch (error) {
      console.error('Erro ao carregar rifas', error);
    }
  };
  

  useEffect(() => {
    loadRaffles();
  }, []);

  return (
    <AdminLayout>
      <Typography variant="h4" color="white">Rifas Registradas</Typography>

      <Box mt={4}>
        {raffles.map((raffle) => {
          const soldArray = raffle.soldNumbers
            ? String(raffle.soldNumbers).split(',')
            : [];
        
          const soldCount = soldArray.length;
          const progress = (soldCount / raffle.total_Numbers) * 100;

          return (
            <Box
              key={raffle.id}
              display="flex"
              alignItems="center"
              mb={2}
              bgcolor="#333"
              p={2}
              borderRadius={2}
              boxShadow={3}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <img
                src={raffle.image_Url}
                alt={raffle.title}
                style={{ width: '100px', marginRight: '1rem', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}
              />
              <Box flex={1}>
                <Typography variant="h6" color="white">
                  {raffle.title}
                </Typography>
                <Typography color="white">{raffle.description}</Typography>
                <Typography color="white" variant="body2">
                  Qtd de Cotas: {raffle.total_Numbers} | Preço: R$ {raffle.price.toFixed(2)}
                </Typography>
                <Box mt={1} width="50%">
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: '#555',
                      '& .MuiLinearProgress-bar': { backgroundColor: '#00c853' }
                    }}
                  />
                  <Typography color="white" variant="caption">
                    {soldCount} / {raffle.total_Numbers} cotas preenchidas
                  </Typography>
                </Box>
              </Box>
              <Button
                onClick={() => {
                  setCurrentRaffle(raffle);
                  setEditingId(raffle.id);
                  setOpenModal(true);
                }}
                variant="contained"
                color="primary"
                sx={{ ml: 2 }}
              >
                Editar
              </Button>
              <Button
                onClick={() => handleDeleteRaffle(raffle.id)}
                variant="contained"
                color="secondary"
                sx={{ ml: 1 }}
              >
                Deletar
              </Button>
            </Box>
          );
        })}
      </Box>

      <Button
          onClick={() => {
            

            if ((planId == "5" || planId == "1")  && raffles.length == 1) {
              toast.warning("Não é possível adicionar mais campanhas. Altere seu plano para liberar mais.");
              return;
            }else if(planId == "3" && raffles.length == 5){
              toast.warning("Não é possível adicionar mais campanhas. Altere seu plano para liberar mais.");
              return;
            }else if(planId == "4" && raffles.length == 10){
              toast.warning("Não é possível adicionar mais campanhas. Altere seu plano para liberar mais.");
              return;
            }
            setOpenModal(true);
          }}
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Adicionar Nova Rifa
        </Button>

        <Modal
  open={openModal}
  onClose={() => setOpenModal(false)}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{
    timeout: 500,
  }}
>
  <Fade in={openModal}>
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 8,
        boxShadow: 24,
        p: 4,
        width: { xs: '90%', sm: 550 },
        mx: 'auto',
        mt: { xs: 2, sm: 8 },
        mb: { xs: 2, sm: 8 }, // Adiciona margem na parte inferior
        position: 'relative',
        maxHeight: '90vh', // Limita a altura máxima
        overflowY: 'auto', // Habilita scroll vertical quando necessário
        display: 'flex',
        flexDirection: 'column',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
      }}
    >
      {/* Botão de fechar com ícone (mantido no topo fixo) */}
      <IconButton
        aria-label="close"
        onClick={() => setOpenModal(false)}
        sx={{
          position: 'sticky',
          top: 8,
          right: 16,
          alignSelf: 'flex-end',
          zIndex: 1,
          color: 'text.secondary',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255, 188, 2, 0.8)',
            color: 'white',
          },
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </IconButton>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          color: '#333',
        }}
      >
        <FontAwesomeIcon icon={editingId ? faEdit : faPlusCircle} color="#FF4B2B" />
        {editingId ? 'Editar Rifa' : 'Adicionar Nova Rifa'}
      </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Título"
          name="title"
          value={currentRaffle.title}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faHeading} color="#666" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#ddd' },
              '&:hover fieldset': { borderColor: '#FF4B2B' },
            },
            '& label': {
              color: '#444',
            },
          }}
        />

        <TextField
          label="Descrição"
          name="description"
          value={currentRaffle.description}
          onChange={handleChange}
          variant="outlined"
          rows={4}
          multiline
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FontAwesomeIcon icon={faAlignLeft} color="#666" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Preço R$"
            name="price"
            type="number"
            value={currentRaffle.price}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faTag} color="#666" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Total de Números"
            name="total_Numbers"
            type="number"
            value={currentRaffle.total_Numbers}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faHashtag} color="#666" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          component="label"
          variant="outlined"
          fullWidth
          startIcon={<FontAwesomeIcon icon={faImage} />}
          sx={{
            mt: 2,
            py: 1.5,
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#FF4B2B',
              color: '#FF4B2B',
            },
          }}
        >
          Upload Imagem
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </Button>

        {currentRaffle.image_Url && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 2,
              position: 'relative',
            }}
          >
            <img
              src={currentRaffle.image_Url}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: 200,
                objectFit: 'contain',
                borderRadius: 8,
                border: '1px solid #eee',
              }}
            />
            <IconButton
              onClick={() => setCurrentRaffle({ ...currentRaffle, image_Url: '' })}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 75, 43, 0.8)',
                  color: 'white',
                },
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </IconButton>
          </Box>
        )}

        <Button
          onClick={handleAddOrUpdateRaffle}
          variant="contained"
          fullWidth
          startIcon={<FontAwesomeIcon icon={editingId ? faSave : faCheckCircle} />}
          sx={{
            mt: 3,
            py: 1.5,
            background: 'linear-gradient(90deg, #FF416C, #FF4B2B)',
            '&:hover': {
              background: 'linear-gradient(90deg, #FF4B2B, #FF416C)',
              boxShadow: '0 4px 8px rgba(255, 75, 43, 0.3)',
            },
          }}
        >
          {editingId ? 'Salvar Alterações' : 'Registrar Rifa'}
        </Button>
      </Box>
    </Box>
  </Fade>
</Modal>



<Snackbar
  open={openSnackbar}
  autoHideDuration={6000}
  onClose={() => setOpenSnackbar(false)}
  anchorOrigin={{
    vertical: 'top',    // Coloca o Snackbar no topo
    horizontal: 'right', // Coloca o Snackbar à direita
  }}
>
  <Alert
    onClose={() => setOpenSnackbar(false)}
    severity={snackbarSeverity}
    sx={{ width: '100%' }}
  >
    {snackbarMessage}
  </Alert>
</Snackbar>


    </AdminLayout>
  );
};

export default RafflesAdmin;

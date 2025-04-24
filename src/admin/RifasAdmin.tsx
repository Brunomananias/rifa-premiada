import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import apiClient from '../services/apiClient';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import './RifasAdmin.css';

interface Raffle {
  id: number;
  title: string;
  description: string;
  price: number;
  total_Numbers: number;
  image_Url: string;
}

const RafflesAdmin = () => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [currentRaffle, setCurrentRaffle] = useState<Raffle>({
    id: Date.now(),
    title: '',
    description: '',
    price: 1,
    total_Numbers: 100,
    image_Url: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Snackbar states
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Handle snackbar display
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
      const response = await apiClient.post('/api/Raffles/UploadImage', formData, {
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
      const response = await apiClient.post('/api/Raffles', {
        title: currentRaffle.title,
        description: currentRaffle.description,
        price: currentRaffle.price,
        total_Numbers: currentRaffle.total_Numbers,
        image_Url: currentRaffle.image_Url,
      });
      
      setRaffles([...raffles, response.data]);
      setCurrentRaffle({
        id: Date.now(),
        title: '',
        description: '',
        price: 1,
        total_Numbers: 100,
        image_Url: '',
      });
      handleSnackbar('Rifa registrada com sucesso!', 'success');
    } catch (error) {
      console.error('Failed to create raffle', error);
      handleSnackbar('Erro ao registrar a rifa. Tente novamente.', 'error');
    }
  };

  const handleDeleteRaffle = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja deletar esta rifa?')) return;
    try {
      await apiClient.delete(`/api/Raffles/${id}`);
      setRaffles(raffles.filter((r) => r.id !== id));
      handleSnackbar('Rifa deletada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar rifa', error);
      handleSnackbar('Erro ao deletar a rifa. Tente novamente.', 'error');
    }
  };

  const loadRaffles = async () => {
    const response = await apiClient.get('/api/Raffles');
    setRaffles(response.data);
  };

  useEffect(() => {
    loadRaffles();
  }, []);

  return (
    <AdminLayout>
      <Typography variant="h4" color="white">Rifas Registradas</Typography>

      <Box mt={4}>
        {raffles.map((raffle) => (
          <Box
            key={raffle.id}
            display="flex"
            alignItems="center"
            mb={2}
            bgcolor="#333"
            p={2}
            borderRadius={2}
          >
            <img
              src={raffle.image_Url}
              alt={raffle.title}
              style={{ width: '100px', marginRight: '1rem', borderRadius: '4px' }}
            />
            <Box flex={1}>
              <Typography variant="h6" color="white">
                {raffle.title}
              </Typography>
              <Typography color="white">{raffle.description}</Typography>
              <Typography color="white" variant="body2">
                Slots: {raffle.total_Numbers} | Price: R$ {raffle.price.toFixed(2)}
              </Typography>
            </Box>
            <Button
              onClick={() => {
                setCurrentRaffle(raffle);
                setEditingId(raffle.id);
              }}
              variant="contained"
              color="primary"
              sx={{ ml: 2 }}
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteRaffle(raffle.id)}
              variant="contained"
              color="secondary"
              sx={{ ml: 1 }}
            >
              Delete
            </Button>
          </Box>
        ))}
      </Box>

      <hr style={{ margin: '2rem 0', borderColor: '#444' }} />

      <Typography variant="h5" color="white">{editingId ? 'Edit Raffle' : 'Add New Raffle'}</Typography>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        maxWidth="500px"
        mx="auto"
        mt={2}
      >
        <TextField
          label="Title"
          name="title"
          value={currentRaffle.title}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            style: { color: 'white' }
          }}
          sx={{
            backgroundColor: '#444',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
            },
            color: 'white',
          }}
        />
        <TextField
          label="Description"
          name="description"
          value={currentRaffle.description}
          onChange={handleChange}
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          InputLabelProps={{
            style: { color: 'white' }
          }}
          sx={{
            backgroundColor: '#444',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
            },
            color: 'white',
          }}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={currentRaffle.price}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            style: { color: 'white' }
          }}
          sx={{
            backgroundColor: '#444',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
            },
            color: 'white',
          }}
        />
        <TextField
          label="Total Numbers"
          name="total_Numbers"
          type="number"
          value={currentRaffle.total_Numbers}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          InputLabelProps={{
            style: { color: 'white' }
          }}
          sx={{
            backgroundColor: '#444',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#555',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
            },
            color: 'white',
          }}
        />
        <Button
          component="label"
          variant="outlined"
          fullWidth
          sx={{ borderColor: '#444', mt: 2 }}
        >
          Upload Image
          <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
        </Button>

        {currentRaffle.image_Url && (
          <img
            src={currentRaffle.image_Url}
            alt="Preview"
            style={{ width: '100px', borderRadius: '6px', marginTop: '1rem' }}
          />
        )}

        <Button
          onClick={handleAddOrUpdateRaffle}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          {editingId ? 'Save Changes' : 'Register'}
        </Button>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
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

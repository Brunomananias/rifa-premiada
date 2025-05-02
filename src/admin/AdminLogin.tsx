import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/apiClient';

import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Box,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !senha) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('api/auth/login', {
        email,
        password: senha,
      });
      console.log(response.data);
      const { token, user, plan_id, planName, userName} = response.data;
      login(token, user, plan_id, planName, userName);
      navigate('/admin/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Erro ao fazer login');
      } else {
        setError('Erro desconhecido ao fazer login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
      padding={2}
    >
      <Box
        bgcolor="#fff"
        p={4}
        borderRadius={3}
        boxShadow={3}
        maxWidth={400}
        width="100%"
      >
        <Typography variant="h4" fontWeight="bold" style={{ color: 'black' }} mb={1}>
          Rifa Premiada
        </Typography>
        <Typography variant="h6" style={{ color: 'black' }} gutterBottom>
          Bem-vindo de volta!
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          Insira suas informações abaixo para entrar na sua conta
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Endereço de e-mail"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Senha"
            variant="outlined"
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
        </form>

        <Box mt={2}>
          <MuiLink href="/forgot-password" underline="hover">
            Esqueceu sua senha?
          </MuiLink>
        </Box>

        <Typography mt={1} color="primary" >
          Ainda não tem uma conta?{' '}
          <MuiLink
            component="button"
            onClick={() => navigate('/register')}
            underline="hover"
          >
            Registre-se
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLogin;

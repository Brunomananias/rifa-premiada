import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

// // Função para pegar o token do localStorage
// const getToken = () => {
//   return localStorage.getItem('jwtToken');
// };

// Criação do cliente Axios
const apiClient = axios.create({
  // baseURL: 'https://api-rifapremiada-eefc14ba94ef.herokuapp.com/',
  baseURL: 'http://localhost:5163/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const getProtectedData = async () => {
  const response = await apiClient.get('/protected-route');
  return response.data;
};


// export const getIdUsuario = () => {
//   const token = localStorage.getItem('jwtToken');
//   if (token) {
//     try {
//       const decoded: any = jwtDecode(token);
//       return decoded.usuarioId || decoded.sub || null;
//     } catch (error) {
//       console.error('Erro ao decodificar o token:', error);
//       return null;
//     }
//   }
//   return null;
// };

// export const getUsernameUsuario = () => {
//   const token = localStorage.getItem('jwtToken');
//   if (token) {
//     console.log(token);
//     try {
//       const decoded: any = jwtDecode(token);
//       return decoded.nomeUsuario || decoded.sub || null;
//     } catch (error) {
//       console.error('Erro ao decodificar o token:', error);
//       return null;
//     }
//   }
//   return null;
// };

export default apiClient;

/* eslint-disable no-useless-catch */
import axios from 'axios';

const API_URL = 'http://localhost:5163/api/auth'; // Altere para sua URL

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
/* eslint-disable no-useless-catch */
import axios from 'axios';

const API_URL = 'https://api-rifapremiada-hdf4dtama6ffgcfc.eastus2-01.azurewebsites.net/api/auth'; // Altere para sua URL

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
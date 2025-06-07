import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.15:8080';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Token inválido ou expirado. Removendo token e voltando para o login.');

      await AsyncStorage.removeItem('accessToken');
      // Aqui você poderia opcionalmente redirecionar para o login com alguma navegação global se tiver (ex.: NavigationService)
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

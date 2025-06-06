import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { applyAuthTokenInterceptor } from 'react-native-axios-jwt';

const API_URL = 'http://192.168.0.15:8080/';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const getAuthTokens = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
};

const setAuthTokens = async ({ accessToken, refreshToken }) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
};

const requestRefresh = async (refreshToken) => {
  const response = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken,
  });
  return {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };
};

applyAuthTokenInterceptor(axiosInstance, {
  requestRefresh,
  getAuthTokens,
  setAuthTokens,
});

export default axiosInstance;

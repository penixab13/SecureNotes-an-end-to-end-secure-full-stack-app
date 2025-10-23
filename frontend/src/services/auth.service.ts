import axios from 'axios';

// Define expected response structure for login
interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
}

const API_URL = '/api/auth/';

const register = (username: string, password: string) => {
  return axios.post(API_URL + 'signup', { username, password });
};

const login = (username: string, password: string) => {
  return axios.post<LoginResponse>(API_URL + 'signin', { username, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = (): LoginResponse | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      localStorage.removeItem('user'); // Clear corrupted data
      return null;
    }
  }
  return null;
};

export default { register, login, logout, getCurrentUser };

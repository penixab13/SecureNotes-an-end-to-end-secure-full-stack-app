import axios from 'axios';

const API_URL = '/api/auth/';

interface LoginResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  encryptionKey: string; // The user's password serves as the encryption key
}

const register = (username: string, password: string) => {
    // We register the user and then log them in automatically
    return axios.post<LoginResponse>(API_URL + 'signup', { username, password });
};

const login = (username: string, password: string): Promise<LoginResponse> => {
    // 1. Authenticate with the backend
    return axios.post<LoginResponse>(API_URL + 'signin', { username, password })
        .then((response) => {
            if (response.data.token) {
                // 2. Add the password (key) to the user data for session use
                const userData: LoginResponse = { ...response.data, encryptionKey: password };
                localStorage.setItem('user', JSON.stringify(userData));
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
            localStorage.removeItem('user');
            return null;
        }
    }
    return null;
};

// Pas d'export de deriveKey ou fetchSalt
export default { register, login, logout, getCurrentUser };

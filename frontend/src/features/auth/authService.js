import api from '../../utils/axios';

// Register user
const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
const logout = async () => {
  await api.get('/auth/logout');
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout
};

export default authService;

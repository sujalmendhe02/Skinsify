import api from './axios';

export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

export const persistAuth = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
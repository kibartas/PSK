import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const register = (data) => Api.post('/users/register', data);

export const verify = (id) =>
  Api.post('/users/verify', null, { params: { id } });

export const authenticate = (email, password) =>
  Api.post('/users/authentication', null, { params: { email, password } });

export const sendForgotPasswordEmail = (email) =>
  Api.post('/users/forgot-password', null, { params: { email } });

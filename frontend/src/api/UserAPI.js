import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
  },
});
// eslint-disable-next-line
export const updateCredentials = (credentials) =>
  Api.put('/users/update-credentials', credentials);

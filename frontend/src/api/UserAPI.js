import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

//  should be removed after more endpoint will be created
export default Api;

export const updateCredentials = (credentials) =>
  Api.put('/users/update-credentials', credentials);

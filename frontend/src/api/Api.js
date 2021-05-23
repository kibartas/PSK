import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Cache-control': 'no-cache',
    Pragma: 'no-cache',
  },
});

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default Api;

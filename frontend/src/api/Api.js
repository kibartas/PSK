import axios from 'axios';

let baseUri;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseUri = 'http://localhost:61346/api';
} else {
  baseUri = 'http://13.81.9.144/api';
}

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

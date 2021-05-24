import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Cache-control': 'no-cache',
    Pragma: 'no-cache',
  },
});

export default Api;

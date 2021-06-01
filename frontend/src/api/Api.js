import axios from 'axios';

let baseUri;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseUri = 'https://localhost:5000/api';
} else {
  baseUri = 'https://playlist-destroyer.co/api';
}

const Api = axios.create({
  baseURL: baseUri,
});

export default Api;

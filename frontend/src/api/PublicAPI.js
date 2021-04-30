import axios from 'axios';

const baseUri = 'https://localhost:44344/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;

export const register = (data) => (
  Api.post("/users/register", data)
)

export const verify = (id) => (
  Api.post("/users/verify", null, { params: { id } })
)

export const authenticate = (email, password) => (
  Api.get("/users/authentication", { params: { email, password } })
)

export const getCurrentUser = (token) => (
  Api.get("/users/currentuser", { headers: { Authorization: `Bearer ${token}` } })
)
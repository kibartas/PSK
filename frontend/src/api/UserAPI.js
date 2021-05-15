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
export const updateCredentials = (id, credentials) => {
  return Api.patch(`/users/${id}`, credentials);
};

export const getAllVideos = () => Api.get('/videos/all');

export const getVideoThumbnail = (videoId) =>
  Api.get('/videos/thumbnail/', { params: { videoId }, responseType: 'blob' });

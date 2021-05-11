import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

// eslint-disable-next-line
export const uploadVideo = async (formData) => (
    Api.post("/Videos/UploadVideo/", formData)
);

// onUploadProgress: ProgressEvent => {
//   setProgressHook(ProgressEvent.loaded / ProgressEvent.total * 100);
// }
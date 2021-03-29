import axios from 'axios';

const baseUri = 'https://localhost:44344/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

export default Api;

// example file upload
// export const UploadFiles = async (files) => {
//     try {
//         const response = await Api.post("/Users/upload-files/", files);
//         return response.data;
//     } catch(error) {
//         console.log(error);
//     }
// };

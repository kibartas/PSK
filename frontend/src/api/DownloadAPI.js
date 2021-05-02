import axios from 'axios';

const baseUri = 'https://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  responseType: 'blob',
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

export default Api;

// example file download
// export const DownloadVideo = async (id) => {
//     try {
//         const response = await Api.get(`/videos/download/${id}`);
//         const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement('a');
//
//         link.href = downloadUrl;
//         link.setAttribute('download', "video.mp4"); //any other extension
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//     } catch (error) {
//         console.log(error);
//     }
// };

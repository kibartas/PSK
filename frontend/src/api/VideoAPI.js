import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

export const uploadChunk = async (chunkNumber, videoFileName, chunk, cancelTokenSource) => (
  Api.post(
    "/Videos/UploadChunks",
    chunk,
    {
      params: {
        chunkNumber,
        fileName: videoFileName
      },
      headers: { 'Content-Type': 'application/json' },
      cancelToken: cancelTokenSource.token
    }
  )
);

export const finishUpload = async (videoFileName, cancelTokenSource) => (
  Api.post(
    "/Videos/UploadComplete",
    null,
    { 
      params: { fileName: videoFileName }, 
      cancelToken: cancelTokenSource.token 
    }
  )
);

export const deleteChunks = async (videoFileName) => (
  Api.delete(
    "/Videos/DeleteChunks",
    {
      params: { fileName: videoFileName }
    }
  )
);

export const changeTitle = async (videoId, newTitle) => (
  Api.patch("/Videos", null, { params: { id: videoId, newTitle }})
);

export const deleteVideos = async (videoIds) =>
  Api.delete(`/Videos`, { data: videoIds });

export const getVideoDetails = (videoId) =>
  Api.get('/Videos/', { params: { videoId } });

export const getAllVideos = () => Api.get('/videos/all');

export const getVideoThumbnail = (videoId) =>
  Api.get('/videos/thumbnail/', { params: { videoId }, responseType: 'blob' });

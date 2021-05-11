import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

export const uploadChunk = async (chunkNumber, videoFileName, chunk) => (
  Api.post(
    "/Videos/UploadChunks",
    chunk,
    {
      params: {
        chunkNumber,
        fileName: videoFileName
      },
      headers: { 'Content-Type': 'application/json' }
      // cancelToken: new axios.CancelToken(cancelExecutor), // TODO
    }
  )
);

export const finishUpload = async (videoFileName) => (
  Api.post("/Videos/UploadComplete", { params: { fileName: videoFileName }})
);

export const deleteChunks = async (videoFileName) => {
  Api.delete("/Videos/DeleteChunks", { params: { fileName: videoFileName }})
};

export const changeTitle = async (videoId, newTitle) => (
  Api.patch("/Videos/ChangeTitle", null, { params: { id: videoId, newTitle }})
);

export const deleteVideo = async (videoId) => (
  Api.delete(`/Videos/${videoId}`)
);

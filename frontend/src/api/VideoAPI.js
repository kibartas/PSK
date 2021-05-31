import Api from './Api';

Api.defaults.headers = {
  Authorization: `Bearer ${window.localStorage.getItem('token')}`,
};

export const uploadChunk = async (
  base64BlockId,
  videoId,
  chunk,
  cancelTokenSource,
) =>
  Api.post('/Videos/UploadChunks', chunk, {
    params: {
      base64BlockId,
      videoId,
    },
    headers: { 'Content-Type': 'application/json' },
    cancelToken: cancelTokenSource.token,
  });

export const finishUpload = (
  videoFileName,
  base64BlockIds,
  videoId,
  cancelTokenSource,
) =>
  Api.post('/Videos/UploadComplete', base64BlockIds, {
    params: { fileName: videoFileName, videoId },
    cancelToken: cancelTokenSource.token,
  });

export const deleteChunks = (videoFileName) =>
  Api.delete('/Videos/DeleteChunks', {
    params: { fileName: videoFileName },
  });

export const changeTitle = (videoId, newTitle, rowVersion) =>
  Api.patch('/Videos/title', null, {
    params: { id: videoId, newTitle, rowVersion },
  });

export const deleteVideos = (videoIds) =>
  Api.delete(`/Videos`, { data: videoIds });

export const markForDeletion = (videoIds) =>
  Api.patch('/Videos/markForDeletion', videoIds);

export const getVideoDetails = (videoId) =>
  Api.get('/Videos/', { params: { videoId } });

export const getAllVideos = () => Api.get('/videos/all');

export const downloadVideos = (videosIds) =>
  Api.post('/Videos/download', videosIds, { responseType: 'blob' });

export const getRecycledVideos = () => Api.get('/videos/recycled');

export const restoreVideos = (videoIds) =>
  Api.patch('/videos/restore', videoIds);

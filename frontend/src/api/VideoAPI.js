import Api from './Api';

Api.defaults.headers = {
  Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
};

export const uploadChunk = async (
  chunkNumber,
  videoFileName,
  chunk,
  cancelTokenSource,
) =>
  Api.post('/Videos/UploadChunks', chunk, {
    params: {
      chunkNumber,
      fileName: videoFileName,
    },
    headers: { 'Content-Type': 'application/json' },
    cancelToken: cancelTokenSource.token,
  });

export const finishUpload = async (videoFileName, cancelTokenSource) =>
  Api.post('/Videos/UploadComplete', null, {
    params: { fileName: videoFileName },
    cancelToken: cancelTokenSource.token,
  });

export const deleteChunks = async (videoFileName) =>
  Api.delete('/Videos/DeleteChunks', {
    params: { fileName: videoFileName },
  });

export const changeTitle = async (videoId, newTitle) =>
  Api.patch('/Videos/title', null, { params: { id: videoId, newTitle } });

export const deleteVideos = async (videoIds) =>
  Api.delete(`/Videos`, { data: videoIds });

export const markForDeletion = async (videoIds) =>
  Api.patch('/Videos/markForDeletion', videoIds);

export const getVideoDetails = (videoId) =>
  Api.get('/Videos/', { params: { videoId } });

export const getAllVideos = () => Api.get('/videos/all');

export const getVideoThumbnail = (videoId) =>
  Api.get('/Videos/thumbnail/', { params: { videoId }, responseType: 'blob' });

export const downloadVideo = (videoId, userId) =>
  Api.get('/Videos/stream/', {
    params: { videoId, userId },
    responseType: 'blob',
  });

export const downloadMultipleVideos = (videosIds) =>
  Api.post('/Videos/downloadMultiple', videosIds, { responseType: 'blob' });

export const getRecycledVideos = () => Api.get('/videos/recycled');

export const restoreVideos = (videoIds) =>
  Api.patch('/videos/restore', videoIds);

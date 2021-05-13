import { CHUNK_SIZE } from "../constants";

const getChunkCount = (video) => (
  video.size % CHUNK_SIZE === 0
      ? video.size / CHUNK_SIZE
      : Math.floor(video.size / CHUNK_SIZE) + 1
);

// eslint-disable-next-line import/prefer-default-export
export { getChunkCount } ;

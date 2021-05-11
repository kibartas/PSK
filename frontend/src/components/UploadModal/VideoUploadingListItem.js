import React, { useState, useEffect } from 'react';
import { ListItem, LinearProgress, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { CHUNK_SIZE } from '../../constants';
import { finishUpload, uploadChunk, deleteChunks } from '../../api/VideoAPI';

export default function VideoUploadingListItem({ videoToBeUploaded, onUploadCancel, onUploadFinish }) {
  const chunkCount = videoToBeUploaded.size % CHUNK_SIZE === 0 ? videoToBeUploaded.size / CHUNK_SIZE : Math.floor(videoToBeUploaded.size / CHUNK_SIZE) + 1;

  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(CHUNK_SIZE);
  const [chunkCounter, setChunkCounter] = useState(1);
  const [progress, setProgress] = useState(0);

  const [cancelToken, setCancelToken] = useState({});

  const finishVideoUpload = () => {
    finishUpload(videoToBeUploaded.name).then((video) => {
      setProgress(100);
      onUploadFinish(video);
    }).catch(() => {
      deleteChunks(videoToBeUploaded.name);
      onUploadCancel(true);
    });
  }

  const uploadNextChunk = (chunk) => {
    uploadChunk(videoToBeUploaded.name, chunkCounter, chunk).then(() => {
      console.log("hey")
      if (chunkCounter === chunkCount) {
        finishVideoUpload();
      } else {
        setBeginingOfTheChunk(endOfTheChunk);
        setEndOfTheChunk(endOfTheChunk + CHUNK_SIZE);
        const percentage = (chunkCounter / chunkCount) * 100;
        setProgress(percentage);
      }
    }).catch(() => {
      console.log("oops")
      deleteChunks(videoToBeUploaded.name);
      onUploadCancel(true);
    });
  }

  const handleOnUploadCancel = () => {
    // cancelToken(); //TODO
    deleteChunks(videoToBeUploaded.name);
    onUploadCancel();
  };

  useEffect(() => {
    setChunkCounter(chunkCounter + 1);
    if (chunkCounter <= chunkCount) {
      const chunk = videoToBeUploaded.slice(beginingOfTheChunk, endOfTheChunk);
      uploadNextChunk(chunk)
    }
  }, [progress]);

  return (
    <ListItem key={videoToBeUploaded.name}>
      <LinearProgress variant='determinate' value={progress} />
      <IconButton onClick={handleOnUploadCancel}>
        <CancelIcon />
      </IconButton>
    </ListItem>
  )
}
import React, { useState, useEffect } from 'react';
import {
  ListItem,
  LinearProgress,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { CHUNK_SIZE } from '../../constants';
import { finishUpload, uploadChunk, deleteChunks } from '../../api/VideoAPI';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function VideoUploadingListItem({
  videoToBeUploaded,
  onUploadCancel,
  onUploadFinish,
}) {
  const chunkCount =
    videoToBeUploaded.size % CHUNK_SIZE === 0
      ? videoToBeUploaded.size / CHUNK_SIZE
      : Math.floor(videoToBeUploaded.size / CHUNK_SIZE) + 1;

  const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0);
  const [endOfTheChunk, setEndOfTheChunk] = useState(CHUNK_SIZE);
  const [chunkCounter, setChunkCounter] = useState(1);
  const [progress, setProgress] = useState(0);

  const [cancelToken, setCancelToken] = useState({});

  const classes = useStyles();

  const finishVideoUpload = () => {
    finishUpload(videoToBeUploaded.name)
      .then((response) => {
        setProgress(100);
        onUploadFinish(response.data);
      })
      .catch(() => {
        deleteChunks(videoToBeUploaded.name);
        onUploadCancel(true);
      });
  };

  const uploadNextChunk = (chunk) => {
    uploadChunk(chunkCounter, videoToBeUploaded.name, chunk)
      .then(() => {
        if (chunkCounter === chunkCount) {
          finishVideoUpload();
        } else {
          setBeginingOfTheChunk(endOfTheChunk);
          setEndOfTheChunk(endOfTheChunk + CHUNK_SIZE);
          const percentage = (chunkCounter / chunkCount) * 100;
          setProgress(percentage);
        }
      })
      .catch(() => {
        deleteChunks(videoToBeUploaded.name);
        onUploadCancel(true);
      });
  };

  const handleOnUploadCancel = () => {
    // cancelToken(); //TODO
    deleteChunks(videoToBeUploaded.name);
    onUploadCancel();
  };

  useEffect(() => {
    setChunkCounter(chunkCounter + 1);
    if (chunkCounter <= chunkCount) {
      const chunk = videoToBeUploaded.slice(beginingOfTheChunk, endOfTheChunk);
      uploadNextChunk(chunk);
    }
  }, [progress]);

  return (
    <ListItem key={videoToBeUploaded.name}>
      <div className={classes.root}>
        <LinearProgress variant="determinate" value={progress} />
      </div>
      <IconButton onClick={handleOnUploadCancel}>
        <CancelIcon />
      </IconButton>
    </ListItem>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Grid,
  Paper,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';
import { CancelToken, isCancel } from 'axios';
import './styles.css';
import { uploadChunk, finishUpload, deleteChunks, changeTitle, deleteVideo } from '../../api/VideoAPI';
import { getChunkCount } from '../../util';
import InUploadVideoItem from './InUploadVideoItem';
import StyledDropzone from './StyledDropzone';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import { CHUNK_SIZE } from '../../constants';
import UploadedVideosList from './UploadedVideosList';

export default function UploadModal({ show, onClose }) {
  const [videosToUpload, setVideosToUpload] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]); // Stores video entities from BE

  const [isMultipleUpload, setIsMultipleUpload] = useState(false);
  const [areTitlesMissing, setAreTitlesMissing] = useState(false);

  const videoInUpload = useRef(undefined);
  const totalChunkCount = useRef(undefined);
  const chunkIndex = useRef(1);
  const chunkStart = useRef(0);
  const chunkEnd = useRef(CHUNK_SIZE);
  const [progress, setProgress] = useState(0);

  const cancelTokenSource = useRef(undefined);

  const [showSnackbar, setShowSnackbar] = useState({
    noVideoAttached: false,
    uploadInProgress: false,
    videoTitleMissing: false,
    uploadError: false,
    serverError: false,
  });

  const handleAdd = (acceptedVideoFiles) => {
    if (acceptedVideoFiles.length > 1) {
      setIsMultipleUpload(true);
    }
    setVideosToUpload([...acceptedVideoFiles]);
  };

  const handleClose = () => {
    window.location.reload();
    onClose();
  }

  const handleCancel = () => {
    if (videoInUpload.current !== undefined) {
      if (cancelTokenSource.current !== undefined) {
        cancelTokenSource.current.cancel();
      }
      deleteChunks(videoInUpload.current.name);
    } 
    if (uploadedVideos.length > 0) {
      uploadedVideos.forEach(video => deleteVideo(video.id));
    }
    handleClose();
  }

  const handleSubmit = () => {
    if (videosToUpload.length === 0 && uploadedVideos.length === 0 && videoInUpload.current === undefined) {
      setShowSnackbar({ ...showSnackbar, noVideoAttached: true });
    } else if (videoInUpload.current !== undefined || videosToUpload.length > 0) {
      setShowSnackbar({ ...showSnackbar, uploadInProgress: true });
    } else if (areTitlesMissing) {
      setShowSnackbar({ ...showSnackbar, videoTitleMissing: true });
    } else {
      handleClose();
    }
  };

  const resetUploadState = () => {
    videoInUpload.current = undefined;
    totalChunkCount.current = undefined;
    chunkIndex.current = 1;
    chunkStart.current = 0;
    chunkEnd.current = CHUNK_SIZE;
    setProgress(0);
    setVideosToUpload([...videosToUpload.slice(1)]);
  }

  const handleUploadInterruption = (requestCancelled) => {
    if (!requestCancelled) {
      setShowSnackbar({ ...showSnackbar, uploadError: true })
    }
    deleteChunks(videoInUpload.current.name);
    resetUploadState();
  };

  const finishVideoUpload = () => {
    cancelTokenSource.current = CancelToken.source();
    finishUpload(videoInUpload.current.name, cancelTokenSource.current)
      .then((response) => {
        setProgress(100);
        resetUploadState();
        setUploadedVideos([...uploadedVideos, response.data]);
      }).catch(error => handleUploadInterruption(isCancel(error)));
  };

  const uploadNextChunk = (chunk) => {
    cancelTokenSource.current = CancelToken.source();
    uploadChunk(chunkIndex.current, videoInUpload.current.name, chunk, cancelTokenSource.current)
      .then(() => {
        if (chunkIndex.current >= totalChunkCount.current) {
          finishVideoUpload();
        } else {
          chunkStart.current = chunkEnd.current;
          chunkEnd.current += CHUNK_SIZE;
          const percentage = (chunkIndex.current / totalChunkCount.current) * 100;
          chunkIndex.current += 1
          setProgress(percentage);
        }
      }).catch(error => handleUploadInterruption(isCancel(error)));
  };

  useEffect(() => {
    if (videosToUpload.length > 0) {
      // eslint-disable-next-line prefer-destructuring
      videoInUpload.current = videosToUpload[0];
      totalChunkCount.current = getChunkCount(videoInUpload.current);
      setProgress(1);
    }
  }, [videosToUpload]);

  useEffect(() => {
    if (chunkIndex.current <= totalChunkCount.current && 
        videoInUpload.current !== undefined && progress !== 100) {
      const chunk = videoInUpload.current.slice(chunkStart.current, chunkEnd.current);
      uploadNextChunk(chunk);
    }
  }, [progress]);

  const handleUploadCancel = () => {
    if (cancelTokenSource.current !== undefined) {
      cancelTokenSource.current.cancel();
    }
  };

  const handleVideoTitleChange = (videoId) => (newTitle) => {
    if (newTitle === '') {
      setAreTitlesMissing(true);
      return;
    }
    setAreTitlesMissing(false);
    changeTitle(videoId, newTitle)
      .then((response) => {
        const index = uploadedVideos.findIndex((video) => video.id === videoId);
        const uploadedVideosCopy = uploadedVideos.slice();
        uploadedVideosCopy.splice(index, 1, response.data);
        setUploadedVideos([...uploadedVideosCopy]);
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: false }));
  };

  const handleVideoDeletion = (videoId) => () => (
    deleteVideo(videoId).then(() => (
      setUploadedVideos([...uploadedVideos.filter(video => video.id !== videoId)])
    )).catch(() => setShowSnackbar({ ...showSnackbar, serverError: true }))
  )

  const renderSnackbars = () => {
    if (showSnackbar.uploadError) {
      return (
        <CustomSnackbar
          message="Something wrong happened :/ Video was not uploaded"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, uploadError: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.serverError) {
      return (
        <CustomSnackbar
          message="Oops... Something wrong happened :/"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, serverError: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.videoTitleMissing) {
      return (
        <CustomSnackbar
          message="Please enter a title for the uploaded video"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, videoTitleMissing: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.noVideoAttached) {
      return (
        <CustomSnackbar
          message="Please attach a video before submitting"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, noVideoAttached: false })
          }
          severity="info"
        />
      );
    }
    if (showSnackbar.uploadInProgress) {
      return (
        <CustomSnackbar
          message="Please wait until your video will be uploaded"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, uploadInProgress: false })
          }
          severity="info"
        />
      );
    }

    return null;
  };

  const shouldRenderDropzone = () => (
    videosToUpload.length === 0 && videoInUpload.current === undefined && uploadedVideos.length === 0
  );

  const renderModalTitle = () => {
    let title = null;
    if (videosToUpload.length > 0) {
      title = isMultipleUpload ? "Your videos are being uploaded..." : "Your video is being uploaded...";
    } else if (uploadedVideos.length > 0 && videosToUpload.length === 0) {
      title = isMultipleUpload ? "Your videos have been successfully uploaded": "Your video has been successfully uploaded" 
    }
    if (title !== null) {
      return (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {title}
          </Typography>
        </Grid>
      );
    } 
    return null;
  };

  return (
    <>
      {renderSnackbars()}
      <Modal
        className="modal"
        open={show}
        onClose={handleCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        disableBackdropClick
      >
        <Fade in={show}>
          <Paper className='modal__paper'>
            <CardContent>
              <Grid container direction="column" spacing={2}>
                {shouldRenderDropzone() && 
                  <Grid item xs={12}>
                    <StyledDropzone
                      onAdd={handleAdd}
                    />
                  </Grid>
                }
                {renderModalTitle()}
                {videosToUpload.length > 0 && 
                  <Grid item xs={12}>
                    <InUploadVideoItem
                      progress={progress}
                      onUploadCancel={handleUploadCancel}
                    />
                  </Grid>
                }
                {uploadedVideos.length > 0 &&
                  <Grid item xs={12}>
                    <UploadedVideosList
                      videos={uploadedVideos}
                      onVideoTitleChange={handleVideoTitleChange}
                      onVideoDeletion={handleVideoDeletion}
                    />
                  </Grid>
                }
                <Grid item container spacing={1} justify="flex-end">
                  <Grid item>
                    <Button variant="outlined" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
}

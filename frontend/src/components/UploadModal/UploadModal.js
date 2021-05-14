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
import {
  uploadChunk,
  finishUpload,
  deleteChunks,
  changeTitle,
  deleteVideo,
} from '../../api/VideoAPI';
import { getChunkCount } from '../../util';
import InUploadVideoItem from './InUploadVideoItem';
import UploadedVideoItem from './UploadedVideoItem';
import StyledDropzone from './StyledDropzone';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import { CHUNK_SIZE } from '../../constants';

export default function UploadModal({ show, onClose }) {
  const [videoToUpload, setVideoToUpload] = useState(undefined);
  const [uploadedVideo, setUploadedVideo] = useState(undefined); // Video entity from BE
  const [isTitleMissing, setIsTitleMissing] = useState(false);

  const [totalChunkCount, setTotalChunkCount] = useState(undefined);
  const [chunkIndex, setChunkIndex] = useState(1);
  const [chunkStart, setChunkStart] = useState(0);
  const [chunkEnd, setChunkEnd] = useState(CHUNK_SIZE);
  const [progress, setProgress] = useState(0);

  const cancelTokenSource = useRef(CancelToken.source());

  const [showSnackbar, setShowSnackbar] = useState({
    noVideoAttached: false,
    uploadInProgress: false,
    videoTitleMissing: false,
    uploadError: false,
    serverError: false,
  });

  const handleAdd = (acceptedVideoFiles) => {
    const videoFile = acceptedVideoFiles[0];
    setTotalChunkCount(getChunkCount(videoFile));
    setVideoToUpload(videoFile);
  };

  const handleClose = () => {
    window.location.reload();
    onClose();
  };

  const handleCancel = () => {
    if (videoToUpload !== undefined) {
      cancelTokenSource.current.cancel();
      deleteChunks(videoToUpload.name).then(() => handleClose());
    } else if (uploadedVideo !== undefined) {
      deleteVideo(uploadedVideo.id).then(() => handleClose());
    }
  };

  const handleSubmit = () => {
    if (videoToUpload === undefined && uploadedVideo === undefined) {
      setShowSnackbar({ ...showSnackbar, noVideoAttached: true });
    } else if (uploadedVideo === undefined) {
      setShowSnackbar({ ...showSnackbar, uploadInProgress: true });
    } else if (isTitleMissing) {
      setShowSnackbar({ ...showSnackbar, videoTitleMissing: true });
    } else {
      handleClose();
    }
  };

  const handleUploadError = () => {
    setShowSnackbar({ ...showSnackbar, uploadError: true });
    deleteChunks(videoToUpload.name);
    handleClose();
  };

  const finishVideoUpload = () => {
    finishUpload(videoToUpload.name, cancelTokenSource.current)
      .then((response) => {
        setProgress(100);
        setVideoToUpload(undefined);
        setUploadedVideo(response.data);
      })
      .catch((error) => {
        if (!isCancel(error)) {
          handleUploadError();
        }
      });
  };

  const uploadNextChunk = (chunk) => {
    uploadChunk(
      chunkIndex,
      videoToUpload.name,
      chunk,
      cancelTokenSource.current,
    )
      .then(() => {
        if (chunkIndex >= totalChunkCount) {
          finishVideoUpload();
        } else {
          setChunkStart(chunkEnd);
          setChunkEnd(chunkEnd + CHUNK_SIZE);
          setChunkIndex(chunkIndex + 1);
          const percentage = (chunkIndex / totalChunkCount) * 100;
          setProgress(percentage);
        }
      })
      .catch((error) => {
        if (!isCancel(error)) {
          handleUploadError();
        }
      });
  };

  useEffect(() => {
    if (
      chunkIndex <= totalChunkCount &&
      videoToUpload !== undefined &&
      progress !== 100
    ) {
      const chunk = videoToUpload.slice(chunkStart, chunkEnd);
      uploadNextChunk(chunk);
    }
  }, [videoToUpload, progress]);

  const handleVideoTitleChange = (newTitle) => {
    if (newTitle === '') {
      setIsTitleMissing(true);
      return;
    }
    setShowSnackbar({ ...showSnackbar, videoTitleMissing: false });
    setIsTitleMissing(false);
    changeTitle(uploadedVideo.id, newTitle)
      .then((response) => {
        setUploadedVideo(response.data);
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: false }));
  };

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
          <Paper className="modal__paper">
            <CardContent>
              <Grid container direction="column" spacing={2}>
                {videoToUpload === undefined && uploadedVideo === undefined && (
                  <Grid item xs={12}>
                    <StyledDropzone onAdd={handleAdd} />
                  </Grid>
                )}
                {videoToUpload !== undefined && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        Your video is being uploaded...
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <InUploadVideoItem progress={progress} />
                    </Grid>
                  </>
                )}
                {uploadedVideo !== undefined && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        Your video has been successfully uploaded
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <UploadedVideoItem
                        video={uploadedVideo}
                        onVideoTitleChange={handleVideoTitleChange}
                      />
                    </Grid>
                  </>
                )}
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

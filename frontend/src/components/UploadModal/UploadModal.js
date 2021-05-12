import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Grid,
  Paper,
  CardContent,
  Button,
} from '@material-ui/core';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import './styles.css';
import StyledDropzone from './StyledDropzone';
import VideosList from './VideosList';
import { changeTitle, deleteVideo } from '../../api/VideoAPI';
import { FILENAME_WITHOUT_EXTENSION_REGEX } from '../../constants';

export default function UploadModal({ show, onClose }) {
  const [videosToBeUploaded, setVideosToBeUploaded] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]); // Video entities from BE
  const [someTitlesAreEmpty, setSomeTitlesAreEmpty] = useState(false);

  const [showSnackbar, setShowSnackbar] = useState({
    incorrectFileType: false,
    videoTitleMissing: false,
    uploadError: false,
    serverError: false,
    videosAlreadyAttached: false,
  });

  const handleAdd = (acceptedVideos) => {
    const filteredAcceptedVideos = acceptedVideos.filter(acceptedVideo => 
      !videosToBeUploaded.some(video => video.name === acceptedVideo.name) &&
        !uploadedVideos.some(video => video.title === acceptedVideo.name.match(FILENAME_WITHOUT_EXTENSION_REGEX)[1])
    )
    if (filteredAcceptedVideos.length !== acceptedVideos.length) {
      setShowSnackbar({ ...showSnackbar, videosAlreadyAttached: true });
    }
    setVideosToBeUploaded([...videosToBeUploaded, ...filteredAcceptedVideos]);
  };

  const handleRejection = () => {
    setShowSnackbar({ ...showSnackbar, incorrectFileType: true });
  };

  const handleCancelUpload = (videoFileName) => (showUploadError) => {
    const index = videosToBeUploaded.findIndex(
      (videoFile) => videoFile.name === videoFileName,
    );
    setVideosToBeUploaded([
      ...videosToBeUploaded.slice(0, index),
      ...videosToBeUploaded.slice(index + 1),
    ]);
    if (showUploadError) {
      setShowSnackbar({ ...showSnackbar, uploadError: true });
    }
  };

  const handleUploadFinish = (videoFileName) => (video) => {
    const index = videosToBeUploaded.findIndex(
      (videoFile) => videoFile.name === videoFileName,
    );
    setVideosToBeUploaded([
      ...videosToBeUploaded.slice(0, index),
      ...videosToBeUploaded.slice(index + 1),
    ]);
    setUploadedVideos([...uploadedVideos, video]);
  };

  const handleChangeVideoTitle = (videoId) => (newTitle) => {
    if (newTitle === '') {
      setSomeTitlesAreEmpty(true);
      return;
    }

    setShowSnackbar({ ...showSnackbar, videoTitleMissing: false });
    setSomeTitlesAreEmpty(false);

    changeTitle(videoId, newTitle)
      .then((response) => {
        const video = response.data;
        const index = uploadedVideos.findIndex(
          (uploadedVideo) => uploadedVideo.id === videoId,
        );
        setUploadedVideos([
          ...uploadedVideos.slice(0, index),
          video,
          ...uploadedVideos.slice(index + 1),
        ]);
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: false }));
  };

  const handleDeleteVideo = (videoId) => () => {
    deleteVideo(videoId)
      .then(() => {
        const index = uploadedVideos.findIndex(
          (uploadedVideo) => uploadedVideo.id === videoId,
        );
        setUploadedVideos([
          ...uploadedVideos.slice(0, index),
          ...uploadedVideos.slice(index + 1),
        ]);
      })
      .catch(() => setShowSnackbar({ ...showSnackbar, serverError: false }));
  };

  const handleClose = () => {
    setVideosToBeUploaded([]);
    setUploadedVideos([]);
    onClose();
  };

  const handleCancel = () => {
    uploadedVideos.forEach((video) => handleDeleteVideo(video.id)());
    handleClose();
  };

  const handleSubmit = () => {
    if (someTitlesAreEmpty) {
      setShowSnackbar({ ...showSnackbar, videoTitleMissing: true });
      return;
    }
    handleClose();
    window.location.reload();
  };

  const renderSnackbars = () => {
    if (showSnackbar.incorrectFileType) {
      return (
        <CustomSnackbar
          message="Only video type files can be uploaded"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, incorrectFileType: false })
          }
          severity="error"
        />
      );
    }
    if (showSnackbar.videoTitleMissing) {
      return (
        <CustomSnackbar
          message="Please enter a title for each attached video"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, videoTitleMissing: false })
          }
          severity="info"
        />
      );
    }
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
    if (showSnackbar.videosAlreadyAttached) {
      return (
        <CustomSnackbar
          message="Some videos were rejected, because they are already attached"
          onClose={() =>
            setShowSnackbar({ ...showSnackbar, videosAlreadyAttached: false })
          }
          severity="warning"
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
          <Paper>
            <CardContent>
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <StyledDropzone
                    onAdd={handleAdd}
                    onRejection={handleRejection}
                  />
                </Grid>
                {(videosToBeUploaded.length > 0 ||
                  uploadedVideos.length > 0) && (
                  <Grid item xs={12}>
                    <VideosList
                      videosToBeUploaded={videosToBeUploaded}
                      onUploadCancel={handleCancelUpload}
                      onUploadFinish={handleUploadFinish}
                      uploadedVideos={uploadedVideos}
                      onVideoTitleChange={handleChangeVideoTitle}
                      onVideoDelete={handleDeleteVideo}
                    />
                  </Grid>
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

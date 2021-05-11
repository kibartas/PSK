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
import { uploadVideo } from '../../api/UploadAPI';

export default function UploadModal({ show, onClose }) {
  const [inProgressUploadRequests, setInProgressUploadRequests] = useState([]);
  const [uploadProgresses, setUploadProgresses] = useState([]);
  const [uploadedVideos, setUploadedVideos] = useState([]); // Video entities from BE

  const [showSnackbar, setShowSnackbar] = useState({
    incorrectFileType: false,
    videoNameMissing: false,
    uploadError: false,
  });

  const handleAdd = (acceptedVideos) => {
    const video = acceptedVideos[0];
    const formData = new FormData();
    formData.append('videoFile', video, video.name);
  
    uploadVideo(formData).then(() => console.log('success'));
  };

  const handleRejection = () => {
    setShowSnackbar({ ...showSnackbar, incorrectFileType: true });
  }

  const handleCancelUpload = (request) => (
    () => {
      // [TM]: TODO cancel Upload request here and remove it from state
    }
  );

  const handleDeleteVideo = (videoId) => (
    () => {
      // [TM]: TODO make API request to delete uploaded video and remove it from uploadedVideos state
    }
  )

  const handleCancel = () => {
    inProgressUploadRequests.forEach(request => handleCancelUpload(request)());
    uploadedVideos.forEach(video => handleDeleteVideo(video.id)());
    setInProgressUploadRequests([]);
    setUploadProgresses([]);
    setUploadedVideos([]);
    onClose();
  };

  const handleChangeVideoTitle = (videoId) => (
    (event) => {
      const newTitle = event.target.value;
      // [TM]: TODO using lodash debounce make API request to change video title and update it in the state if necessary
      setShowSnackbar({ ...showSnackbar, videoNameMissing: false });
    }
  );

  const handleSubmit = () => {
    if (uploadedVideos.some(video => video.title === '')) {
      setShowSnackbar({ ...showSnackbar, videoNameMissing: true });
      return;
    }
    handleClose();
    window.location.reload();
  }

  const renderSnackbars = () => {
    if (showSnackbar.incorrectFileType) {
      return (
        <CustomSnackbar
          message="Only video type files can be uploaded"
          onClose={() => setShowSnackbar({ ...showSnackbar, incorrectFileType: false })}
          severity="error"
        />
      );
    }
    if (showSnackbar.videoNameMissing) {
      return (
        <CustomSnackbar
          message="Please enter a name for all attached videos"
          onClose={() => setShowSnackbar({ ...showSnackbar, videoNameMissing: false })}
          severity="info"
        />
      );
    }
    if (showSnackbar.uploadError) {
      return (
        <CustomSnackbar
          message="Something wrong happened :/ Videos were not uploaded"
          onClose={() => setShowSnackbar({ ...showSnackbar, uploadError: false })}
          severity="error"
        />
      );
    }

    return null;
  };

  return (
    <>
      {renderSnackbars()}
      <Modal
        className='modal'
        open={show}
        onClose={handleCancel}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={show}>
          <Paper>
            <CardContent>
              <Grid container direction='column' spacing={2}>
                <Grid item xs={12}>
                  <StyledDropzone onAdd={handleAdd} onRejection={handleRejection} />
                </Grid>
                {(inProgressUploadRequests.length > 0 || uploadedVideos.length > 0) &&
                  <Grid item xs={12}>
                    <VideosList
                      inProgressUploadRequests={inProgressUploadRequests}
                      uploadProgresses={uploadProgresses}
                      onUploadCancel={handleCancelUpload}
                      uploadedVideos={uploadedVideos}
                      onVideoTitleChange={handleChangeVideoTitle}
                      onVideoDelete={handleDeleteVideo}
                    />
                  </Grid>
                }
                <Grid 
                  item
                  container
                  spacing={1}
                  justify='flex-end'
                >
                   <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                    >
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

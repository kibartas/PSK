import React, { useState } from 'react';
import { Modal, Fade, Backdrop, Grid, Paper, CardContent, Button, List, ListItem, TextField } from '@material-ui/core';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import './styles.css';

export default function UploadModal({ show, onUpload, onClose }) {
  const [addedVideos, setAddedVideos] = useState([]);
  const [videoNames, setVideoNames] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState({
    noVideosAdded: false,
    videoNameMissing: false,
  });

  const handleClose = () => {
    setAddedVideos([]);
    setVideoNames([]);
    onClose();
  };

  const handleUpload = () => {
    if (addedVideos.length === 0) {
      setShowSnackbar({ ...showSnackbar, noVideosAdded: true });
      return;
    }
    if (videoNames.some(name => name === '')) {
      setShowSnackbar({ ...showSnackbar, videoNameMissing: true });
      return;
    }
    onUpload(addedVideos, videoNames);
    handleClose();
  }

  const handleAddVideo = (videos) => {
    setShowSnackbar({ ...showSnackbar, noVideosAdded: false });
    setAddedVideos([...addedVideos, ...videos]);
    setVideoNames([...videoNames, ...videos.map(video => /[^.]*/.exec(video.file.name)[0])]);
  }

  const getVideoAddedMessage = (videoName) => (
    `Video ${videoName} was successfully added`
  );

  const handleChangeVideoName = (videoIndex) => (
    (event) => {
      const videoNamesCopy = videoNames.slice();
      videoNamesCopy.splice(videoIndex, 1, event.target.value);
      setVideoNames([...videoNamesCopy]);
      setShowSnackbar({ ...showSnackbar, videoNameMissing: false });
    }
  );

  const renderAddedVideosList = () => {
    const listItems = addedVideos.map((video, index) => {
      const videoName = videoNames[index];
      return (<ListItem key={video.file.name + index.toString()} dense>
        <TextField
          error={videoName === ''}
          helperText={
            videoName === '' ? 'Please enter a name for this video' : ''
          }
          fullWidth
          value={videoName}
          onChange={handleChangeVideoName(index)}
        />
        {/* Add size and remove icon and reduce list item width */}
      </ListItem>);
    });
    return (
      <List>
        {listItems}
      </List>
    );
  }

  return (
    <>
      {showSnackbar.noVideosAdded &&
        <CustomSnackbar
          message="Please attach videos which you want to upload"
          onClose={() => setShowSnackbar({ ...showSnackbar, noVideosAdded: false })}
          severity="info"
        />
      }
      {showSnackbar.videoNameMissing &&
        <CustomSnackbar
          message="Please enter a name for all attached videos"
          onClose={() => setShowSnackbar({ ...showSnackbar, videoNameMissing: false })}
          severity="info"
        />
      }
      <Modal
        className='modal'
        open={show}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={show}>
          <Paper>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DropzoneAreaBase
                    clearOnUnmount
                    dropzoneText="Drag and drop video here or click"
                    acceptedFiles={['video/*']}
                    onAdd={handleAddVideo}
                    maxFileSize={Infinity}
                    getFileAddedMessage={getVideoAddedMessage}
                  />
                </Grid>
                {addedVideos.length > 0 &&
                  <Grid item xs={12}>
                    {renderAddedVideosList()}
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
                      variant="contained"
                      color="primary"
                      onClick={handleUpload}
                    >
                      Upload
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleClose}
                    >
                      Cancel
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

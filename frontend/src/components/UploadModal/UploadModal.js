import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Grid,
  Paper,
  CardContent,
  Button,
  List,
  ListItem,
  TextField,
  InputAdornment,
  IconButton
} from '@material-ui/core';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import CustomSnackbar from '../CustomSnackbar/CustomSnackbar';
import './styles.css';
import { RemoveIcon } from '../../assets';
import { formatBytesToString } from '../../util';

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

  const handleRemoveVideo = (videoIndex) => (
    () => {
      const videoNamesCopy = videoNames.slice();
      videoNamesCopy.splice(videoIndex, 1);
      const addedVideosCopy = addedVideos.slice();
      addedVideosCopy.splice(videoIndex, 1);
      setVideoNames([...videoNamesCopy]);
      setAddedVideos([...addedVideosCopy]);
    }
  )

  const renderAddedVideosList = () => {
    const listItems = addedVideos.map((video, index) => {
      const videoName = videoNames[index];
      return (
        <ListItem key={video.file.name + index.toString()}>
          <TextField
            fullWidth
            error={videoName === ''}
            helperText={
              videoName === '' ? 'Please enter a name for this video' : ''
            }
            value={videoName}
            onChange={handleChangeVideoName(index)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formatBytesToString(video.file.size)}
                  <IconButton onClick={handleRemoveVideo(index)}>
                    <RemoveIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </ListItem>
      );
    });

    return (
      <List>
        {listItems}
      </List>
    );
  }

  const renderSnackbarsIfNeeded = () => {
    if (showSnackbar.noVideosAdded) {
      return (
        <CustomSnackbar
          message="Please attach videos which you want to upload"
          onClose={() => setShowSnackbar({ ...showSnackbar, noVideosAdded: false })}
          severity="info"
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
    return null;
  };

  return (
    <>
      {renderSnackbarsIfNeeded()}
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
              <Grid container direction='column' spacing={2}>
                <Grid item xs={12}>
                  <DropzoneAreaBase
                    clearOnUnmount
                    dropzoneText="&nbsp;&nbsp;Drag and drop videos here or click&nbsp;&nbsp;"
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

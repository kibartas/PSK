import React, { useState } from 'react';
import { Modal, Fade, Backdrop, Grid, Paper, CardContent, Button } from '@material-ui/core';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import './styles.css';
import AddedVideosList from './AddedVideosList';

export default function UploadModal({ show, onClose }) {
  const [addedVideos, setAddedVideos] = useState([]);

  const handleClose = () => {
    onClose();
  };

  const handleAddVideo = (videos) => {
    setAddedVideos([...addedVideos, ...videos]);
  }

  return (
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
                  dropzoneText="Drag and drop video here or click"
                  showFileNames
                  useChipsForPreview
                  acceptedFiles={['video/*']}
                  onAdd={handleAddVideo}
                  maxFileSize={Infinity}
                />
              </Grid>
              <Grid item xs={12}>
                <AddedVideosList addedVideos={addedVideos} />
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Upload
                </Button>
              </Grid>
              <Grid 
                item
                xs={6}
                container
                direction='column'
                alignItems='flex-end'
              >
                <Button
                  variant="outlined"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </Fade>
    </Modal>
  );
}

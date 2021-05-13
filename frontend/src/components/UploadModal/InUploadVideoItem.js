import React from 'react';
import { Grid, IconButton, LinearProgress, Tooltip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import './styles.css';

const InUploadVideoItem = ({
  progress,
  onUploadCancel
}) => (
  <Grid container direction='row' alignItems='center' justify='center'>
    <Grid item xs={11}>
      <LinearProgress
        className='modal__progressBar'
        variant="determinate"
        value={progress}
      />
    </Grid>
    <Grid item xs={1}>
      <Tooltip title="Cancel">
        <IconButton onClick={onUploadCancel}>
          <CancelIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  </Grid>
);

export default InUploadVideoItem;

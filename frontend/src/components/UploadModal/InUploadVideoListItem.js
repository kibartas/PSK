import React from 'react';
import { Grid, IconButton, LinearProgress, ListItem, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import './styles.css';
import { getFileNameWithoutExtension } from '../../util';

export default function InUploadVideoListItem({
  videoName,
  progress,
  onUploadCancel
}) {
  return (
    <ListItem key={videoName}>
      <Grid
        container
        direction='row'
        alignItems='center'
        justify='space-evenly'
      >
        <Grid
          item
          xs
          container
          direction='row'
          alignItems='center'
          justify='center'
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography variant='caption' noWrap>
              {getFileNameWithoutExtension(videoName)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <LinearProgress
              className='modal__progressBar'
              variant="determinate"
              value={progress}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onUploadCancel}>
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}

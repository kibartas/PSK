import React from 'react';
import { Grid, IconButton, LinearProgress, ListItem, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import './styles.css';

export default function InUploadVideoListItem({
  videoName, // TODO WITHOUT EXTENSION
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
          justify='space-evenly'
          spacing={1}
        >
          <Grid item xs={4}>
            <Typography noWrap>
              {videoName}
            </Typography>
          </Grid>
          <Grid item xs>
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

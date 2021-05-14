import React from 'react';
import { Grid, IconButton, LinearProgress, ListItem, Typography } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import './styles.css';

export default function VideoToUploadListItem({
  index,
  videoName,
  onRemoveVideoToUpload,
}) {
  return (
    <ListItem key={videoName + index.toString()}>
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
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onRemoveVideoToUpload}>
            <CancelIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}

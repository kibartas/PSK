import React from 'react';
import { Grid, IconButton, LinearProgress, ListItem, Typography } from '@material-ui/core';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import './styles.css';
import { getFileNameWithoutExtension } from '../../util';

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
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onRemoveVideoToUpload}>
            <CancelOutlinedIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}

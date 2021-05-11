import React from 'react';
import { List, ListItem, TextField, InputAdornment, IconButton, LinearProgress } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { RemoveIcon } from '../../assets';
import { formatBytesToString } from '../../util';

export default function VideosList({ 
  uploadRequests,
  uploadProgresses, // [TM]: TODO put uploadRequests and  uploadProgresses into dict?
  onUploadCancel,
  uploadedVideos,
  onVideoTitleChange,
  onVideoDelete 
}) {
  const inUploadVideosListItems =
    uploadRequests.map((request, index) => (
      <ListItem key={index.toString()}>
        <LinearProgress variant='determinate' progress={uploadProgresses[index]} />
        <IconButton onClick={onUploadCancel(request)}>
          <CancelIcon />
        </IconButton>
      </ListItem>
    ));

  const uploadedVideosListItems =
    uploadedVideos.map((video, index) => (
      <ListItem key={video.title + index.toString()}>
        <TextField
          fullWidth
          error={video.title === ''}
          helperText={
            video.title === '' ? 'Please enter a name for this video' : ''
          }
          value={video.title ?? ''}
          onChange={onVideoTitleChange(video.id)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {formatBytesToString(video.size)}
                <IconButton onClick={onVideoDelete(video.id)}>
                  <RemoveIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </ListItem>
  ));

  return (
    <List>
      {inUploadVideosListItems}
      {uploadedVideosListItems}
    </List>
  );
}
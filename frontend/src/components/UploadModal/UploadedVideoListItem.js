import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import {
  Grid,
  TextField,
  InputAdornment,
  ListItem,
  IconButton,
} from '@material-ui/core';
import { formatBytesToString } from '../../util';

export default function UploadedVideoListItem({
  video,
  onVideoTitleChange,
  onVideoDeletion,
}) {
  const [title, setTitle] = useState(video.title);

  const handleTitleChange = (newTitle) => {
    onVideoTitleChange(newTitle, video.rowVersion);
  };

  const debouncedHandleTitleChange = useCallback(
    debounce(handleTitleChange, 500),
    [],
  );

  const delayedHandleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);

    debouncedHandleTitleChange.cancel();
    debouncedHandleTitleChange(newTitle);
  };

  return (
    <ListItem key={video.id}>
      <Grid
        container
        direction="row"
        alignItems="center"
        justify="space-evenly"
      >
        <Grid item xs>
          <TextField
            fullWidth
            error={title === ''}
            helperText={
              title === '' ? 'Please enter a name for this video' : ''
            }
            value={title}
            onChange={delayedHandleTitleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formatBytesToString(video.size)}
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton onClick={onVideoDeletion}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Grid>
      </Grid>
    </ListItem>
  );
}

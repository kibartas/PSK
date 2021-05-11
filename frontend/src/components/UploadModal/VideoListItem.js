import React, { useState } from 'react';
import { debounce } from 'lodash';
import { ListItem, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { RemoveIcon } from '../../assets';

export default function VideoListItem({ video, onVideoDelete, onVideoTitleChange }) {
  const [ title, setTitle ] = useState(video.title);

  handleTitleChange = (newTitle) => {
    onVideoTitleChange(video.id, newTitle);
  };

  debouncedHandleTitleChange = debounce(handleTitleChange, 600);

  delayedHandleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);

    debouncedHandleTitleChange(newTitle);
  };

  return (
    <ListItem key={video.id}>
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
              <IconButton onClick={onVideoDelete(video.id)}>
                <RemoveIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </ListItem>
  );
}
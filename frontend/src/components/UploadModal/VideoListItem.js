import React, { useState } from 'react';
import { debounce } from 'lodash';
import { ListItem, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { RemoveIcon } from '../../assets';
import { formatBytesToString } from '../../util';

export default function VideoListItem({ video, onVideoDelete, onVideoTitleChange }) {
  const [ title, setTitle ] = useState(video.title);

  const handleTitleChange = (newTitle) => {
    onVideoTitleChange(newTitle);
  };

  const debouncedHandleTitleChange = debounce(handleTitleChange, 600);

  const delayedHandleTitleChange = (event) => {
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
              <IconButton onClick={onVideoDelete}>
                <RemoveIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </ListItem>
  );
}

import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { TextField, InputAdornment } from '@material-ui/core';
import { formatBytesToString } from '../../util';

export default function UploadedVideoItem({ video, onVideoTitleChange }) {
  const [ title, setTitle ] = useState(video.title);

  const handleTitleChange = (newTitle) => {
    onVideoTitleChange(newTitle);
  };

  const debouncedHandleTitleChange = useCallback(debounce(handleTitleChange, 300), []);

  const delayedHandleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);

    debouncedHandleTitleChange.cancel();
    debouncedHandleTitleChange(newTitle);
  };

  return (
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
  );
}

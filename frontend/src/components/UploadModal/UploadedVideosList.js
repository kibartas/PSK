import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { TextField, InputAdornment, List, ListItem, IconButton, Tooltip } from '@material-ui/core';
import { formatBytesToString } from '../../util';

const UploadedVideoListItem = ({
  video,
  onVideoTitleChange,
  onVideoDeletion
}) => {
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
              <Tooltip title="Delete">
                <IconButton onClick={onVideoDeletion}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </ListItem>
  );
}

export default function UploadedVideosList({
  videos,
  onVideoTitleChange,
  onVideoDeletion
}) {
  const getUploadedVideosListItems = () => (
    videos.map((video) => 
      <UploadedVideoListItem
        key={video.id}
        video={video}
        onVideoTitleChange={onVideoTitleChange(video.id)}
        onVideoDeletion={onVideoDeletion(video.id)}
      />
    )
  );

  return (
    <List>
      {getUploadedVideosListItems()}
    </List>
  );
}

import React, { useState, useRef } from 'react';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@material-ui/core';
import { SdCard, Schedule, Movie, Crop, Close } from '@material-ui/icons';
import { formatBytesToString } from '../../util';

export default function InformationDrawer({
  open,
  onOpen,
  onClose,
  videoTitle = '',
  videoDuration = '',
  videoSize = '',
  videoResolution = '',
  videoFormat = '',
  onVideoTitleChange,
}) {
  const [title, setTitle] = useState(videoTitle);

  const handleTitleChange = (newTitle) => {
    onVideoTitleChange(newTitle);
  };

  const debouncedHandleTitleChange = useCallback(
    debounce(handleTitleChange, 300),
    [],
  );

  const delayedHandleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);

    debouncedHandleTitleChange.cancel();
    debouncedHandleTitleChange(newTitle);
  };

  const videoInformation = useRef(
    new Map([
      [videoDuration, { icon: <Schedule /> }],
      [videoSize, { icon: <SdCard /> }],
      [videoResolution, { icon: <Crop /> }],
      [videoFormat, { icon: <Movie /> }],
    ]),
  );

  const renderSidebarTitle = () => (
    <ListItem>
      <ListItemIcon onClick={onClose}>
        <Close />
      </ListItemIcon>
      <ListItemText>
        <Typography variant="h6">Information</Typography>
      </ListItemText>
    </ListItem>
  );

  const renderVideoTitleTextfield = () => (
    <ListItem>
      <TextField
        autoFocus
        value={title}
        error={title.length === 0}
        helperText={
          title.length === 0 ? 'Please enter a name for this video' : ''
        }
        onChange={delayedHandleTitleChange}
        variant="outlined"
        style={{ width: '100%' }}
      />
    </ListItem>
  );

  const renderInformationItems = () => {
    const listItems = [];
    videoInformation.current.forEach((value, key) => {
      listItems.push(
        <ListItem key={key.toString()}>
          <ListItemIcon>{value.icon}</ListItemIcon>
          <ListItemText primary={key} />
        </ListItem>,
      );
    });
    return listItems;
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <List style={{ width: '40vh', height: '100%', position: 'relative' }}>
        {renderSidebarTitle()}
        {renderVideoTitleTextfield()}
        {renderInformationItems()}
      </List>
    </SwipeableDrawer>
  );
}

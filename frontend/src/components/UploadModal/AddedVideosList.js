import React from 'react';
import { List, ListItem } from '@material-ui/core';

export default function AddedVideosList({ addedVideos }) {

  const renderAddedVideosListItems = () => 
    addedVideos.map((video) => (
      <ListItem>{video.file.name}</ListItem>
  ));

  return (
    <List>
      {renderAddedVideosListItems()}
    </List>
  );
};

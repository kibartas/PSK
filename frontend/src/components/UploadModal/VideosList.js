import React from 'react';
import { List } from '@material-ui/core';
import VideoUploadingListItem from './VideoUploadingListItem';
import VideoListItem from './VideoListItem';

export default function VideosList({ 
  videosToBeUploaded,
  onUploadCancel,
  onUploadFinish,
  uploadedVideos,
  onVideoTitleChange,
  onVideoDelete
}) {
  const videoUploadingListItems =
    videosToBeUploaded.map((video) => (
      <VideoUploadingListItem
        key={video.name}
        videoToBeUploaded={video}
        onUploadCancel={onUploadCancel(video.name)}
        onUploadFinish={onUploadFinish(video.name)}
      />
    ));

  const videoListItems =
    uploadedVideos.map((video) => (
      <VideoListItem
        key={video.id}
        video={video}
        onVideoTitleChange={onVideoTitleChange(video.id)}
        onVideoDelete={onVideoDelete(video.id)}
      />
  ));

  return (
    <List>
      {videoUploadingListItems}
      {videoListItems}
    </List>
  );
}
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
    videosToBeUploaded.map((video, index) => (
      <VideoUploadingListItem
        key={video.name + index.toString()}
        videoToBeUploaded={video}
        onUploadCancel={onUploadCancel(index)}
        onUploadFinish={onUploadFinish(index)}
      />
    ));

  const videoListItems =
    uploadedVideos.map((video, index) => (
      <VideoListItem
        key={video.id}
        video={video}
        onVideoTitleChange={onVideoTitleChange(video.id, index)}
        onVideoDelete={onVideoDelete(video.id, index)}
      />
  ));

  return (
    <List>
      {videoUploadingListItems}
      {videoListItems}
    </List>
  );
}
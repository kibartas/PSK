import { Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import VideoCard from '../VideoCard/VideoCard';

const VideoCardsByDate = ({ videoCards, onSelect, selectedCards }) => (
  <Grid container item direction="column">
    <Grid item>
      <Typography variant="h6">{videoCards[0].date}</Typography>
      <Divider />
    </Grid>
    <Grid container item direction="row" spacing={5} style={{ marginTop: 0 }}>
      {videoCards.map(({ title, thumbnail, id }) => (
        <Grid item key={id}>
          <VideoCard
            id={id}
            title={title}
            onSelect={onSelect}
            thumbnail={thumbnail}
            isSelected={
              selectedCards
                ? selectedCards.find((cardId) => cardId === id)
                : false
            }
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default VideoCardsByDate;

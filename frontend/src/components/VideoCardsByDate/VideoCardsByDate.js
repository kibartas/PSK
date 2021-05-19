import { Checkbox, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import VideoCard from '../VideoCard/VideoCard';
import './styles.css';

const VideoCardsByDate = ({
  videoCards,
  onSelect,
  selectedCards,
  onSelectDate,
}) => (
  <Grid container item direction="column">
    <Grid item container alignItems="center">
      <Grid item>
        <Checkbox
          checked={videoCards
            .map((card) => card.id)
            .every((id) => selectedCards.includes(id))}
          onChange={() => onSelectDate(videoCards.map((card) => card.id))}
        />
      </Grid>
      <Grid item>
        <Typography variant="h6">{videoCards[0].uploadDate}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
    <Grid container item direction="row" spacing={5} style={{ marginTop: 0 }}>
      {videoCards.map(({ title, id }) => (
        <Grid item className="card_grid" key={id}>
          <VideoCard
            id={id}
            title={title}
            onSelect={onSelect}
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

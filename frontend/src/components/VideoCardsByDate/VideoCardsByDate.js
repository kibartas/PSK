import { Checkbox, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import VideoCard from '../VideoCard/VideoCard';
import './styles.css';

const VideoCardsByDate = ({
  videosInformation,
  onSelect,
  selectedCardIds,
  onSelectDate,
}) => (
  <Grid container item direction="column">
    <Grid item container alignItems="center">
      <Grid item>
        <Checkbox
          checked={videosInformation
            .map((card) => card.id)
            .every((id) => selectedCardIds.includes(id))}
          onChange={() =>
            onSelectDate(videosInformation.map((card) => card.id))
          }
        />
      </Grid>
      <Grid item>
        <Typography variant="h6">{videosInformation[0].uploadDate}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
    <Grid container item direction="row" spacing={5} style={{ marginTop: 0 }}>
      {videosInformation.map(({ title, id }) => (
        <Grid item className="card_grid" key={id}>
          <VideoCard
            id={id}
            title={title}
            onSelect={onSelect}
            isSelected={
              selectedCardIds
                ? selectedCardIds.find((cardId) => cardId === id)
                : false
            }
          />
        </Grid>
      ))}
    </Grid>
  </Grid>
);

export default VideoCardsByDate;

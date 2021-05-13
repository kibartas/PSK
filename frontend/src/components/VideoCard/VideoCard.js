import React from 'react';
import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardMedia,
  Grid,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { missingImageIcon } from '../../assets';
import './styles.css';

const VideoCard = ({ title, thumbnail, onSelect, id, isSelected }) => (
  <Card
    className="card"
    variant="outlined"
    style={{ border: `${isSelected ? '0.5px solid blue' : ''}` }}
  >
    <CardHeader
      classes={{
        content: 'card_content',
      }}
      disableTypography
      title={
        <Typography noWrap gutterBottom variant="h6">
          {title}
        </Typography>
      }
      action={
        <Grid item>
          <IconButton onClick={() => onSelect(id)}>
            <CheckCircleIcon color={isSelected ? 'primary' : 'inherit'} />
          </IconButton>
        </Grid>
      }
    />
    <CardMedia
      component="img"
      className="card_image"
      src={thumbnail || missingImageIcon}
    />
  </Card>
);

export default VideoCard;

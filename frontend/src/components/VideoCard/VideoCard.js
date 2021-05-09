import React, { useState } from 'react';
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

const VideoCard = ({ title, thumbnail, onSelect, id }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Card
      className="card"
      variant="outlined"
      style={{ border: `${isSelected ? '0.5px solid blue' : ''}` }}
    >
      <CardHeader
        classes={{
          content: 'content',
        }}
        disableTypography
        title={
          <Grid item>
            <Typography noWrap gutterBottom variant="h6">
              {title}
            </Typography>
          </Grid>
        }
        action={
          <Grid item>
            <IconButton
              onClick={() => {
                onSelect(id, isSelected);
                setIsSelected(!isSelected);
              }}
            >
              <CheckCircleIcon color={isSelected ? 'primary' : 'inherit'} />
            </IconButton>
          </Grid>
        }
      />
      <CardMedia
        component="img"
        style={{
          backgroundColor: 'rgba(0,0,0,0.12)',
          flexGrow: 1,
        }}
        src={thumbnail || missingImageIcon}
      />
    </Card>
  );
};

export default VideoCard;

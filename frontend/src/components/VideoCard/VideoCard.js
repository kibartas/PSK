import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardMedia,
  Grid,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './styles.css';
import { getVideoThumbnail } from '../../api/UserAPI';
import { missingImageIcon } from '../../assets';

const VideoCard = ({ title, onSelect, id, isSelected }) => {
  const [thumbnail, setThumbnail] = useState(undefined);
  useEffect(() => {
    getVideoThumbnail(id)
      .then((response) => setThumbnail(URL.createObjectURL(response.data)))
      .catch(() => setThumbnail(missingImageIcon));
  }, []);
  const handleClick = () => {
    window.location.href = `/player/${id}`;
  };
  return (
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
        onClick={handleClick}
        component="img"
        className="card_image"
        src={thumbnail}
      />
    </Card>
  );
};

export default VideoCard;

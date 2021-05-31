import React, { useRef } from 'react';
import {
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardMedia,
  Grid,
} from '@material-ui/core';
import HoverVideoPlayer from 'react-hover-video-player';
import { useHistory } from 'react-router-dom';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import './styles.css';
import { spinner } from '../../assets';

const VideoCard = ({ title, onSelect, id, isSelected }) => {
  const history = useHistory();
  const url = useRef(`http://localhost:61346/api/Videos/stream?videoId=${id}&token=${localStorage.getItem('token')}`);

  const handleClick = () => {
    history.push(`/player/${id}`);
  };

  return (
    <Card
      className="card"
      variant="outlined"
      style={{ border: `${isSelected ? '0.5px solid blue' : ''}` }}
    >
      <CardHeader
        classes={{
          content: 'card__content',
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
        className='card__media'
        onClick={handleClick}
      >
        <HoverVideoPlayer
          videoSrc={url.current}
          preload="metadata"
          restartOnPaused
          loadingOverlay={<img style={{ width: '100%', height: '100%' }} src={spinner} alt="Loading spinner" />}
          loadingStateTimeout={0}
        />
      </CardMedia>
    </Card>
  );
};

export default VideoCard;

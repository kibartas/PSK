import React, { useState } from 'react';
import {
  CardContent,
  Paper,
  Card,
  CardHeader,
  IconButton,
  Typography,
  CardMedia,
  Grid,
} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { missingImageIcon, visibilityOffIcon } from '../../assets';

const VideoCard = ({ title }) => {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <Card variant="outlined" style={{ width: '300px', height: '300px' }}>
      <CardHeader
        disableTypography
        title={
          <Typography gutterBottom variant="h6">
            {title}
          </Typography>
        }
        action={
          <IconButton onClick={() => setIsSelected(!isSelected)}>
            <CheckCircleIcon color={isSelected ? 'primary' : ''} />
          </IconButton>
        }
      />
      <CardContent
        style={{
          height: '75%',
          backgroundColor: 'rgba(0,0,0,0.12)',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          style={{ height: '15vw', weight: '15vw' }}
          src={missingImageIcon}
          alt="Bla"
        />
      </CardContent>
    </Card>
  );
};

export default VideoCard;

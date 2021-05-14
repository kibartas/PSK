import React from 'react';
import { LinearProgress } from '@material-ui/core';
import './styles.css';

const InUploadVideoItem = ({
  progress
}) => (
  <LinearProgress
    variant="determinate"
    value={progress}
  />
);

export default InUploadVideoItem;

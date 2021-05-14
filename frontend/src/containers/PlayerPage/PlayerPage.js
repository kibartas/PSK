import React from 'react';
import { Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
import TopBar from '../../components/TopBar/TopBar';
import {
  confirmEmailDrawing,
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
} from '../../assets';
import './styles.css';

class PlayerPage extends React.Component {
  render() {
    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };
    return (
      <div className="root">
        <div>
          <TopBar
            darkMode
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
            title="Video title"
            showArrow
            onActionIconClick={handleArrowBackClick}
            iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
          />
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video autoPlay controls width="100%" height="100%">
            <source
              src="https://localhost:44344/api/Videos/stream?videoId=45b7ceea-3fc8-4149-afc8-2b38cd0cdbd0"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    );
  }
}

export default PlayerPage;

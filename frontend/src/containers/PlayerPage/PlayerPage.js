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
        <TopBar
          darkMode
          firstName={window.sessionStorage.getItem('firstName')}
          lastName={window.sessionStorage.getItem('lastName')}
          title="Video title"
          showArrow
          onActionIconClick={handleArrowBackClick}
          iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
        />
        <div style={{ width: '90%', height: '90%' }}>
          <ReactPlayer
            url="https://vimeo.com/121131664"
            width="100%"
            height="100%"
            controls
          />
        </div>
      </div>
    );
  }
}

export default PlayerPage;

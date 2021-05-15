import React from 'react';
import { Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import TopBar from '../../components/TopBar/TopBar';
import { DeleteIcon, DownloadIcon, InfoIcon } from '../../assets';
import './styles.css';

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const id = match.params.videoId;
    const url = `http://localhost:61346/api/Videos/stream?videoId=${id}`;
    this.setState({ url });
  }

  render() {
    const { url } = this.state;
    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };
    return (
      <Grid
        className="container"
        style={{ heigth: '100vh' }}
        justify="center"
        container
      >
        <Grid item className="video-wrapper">
          <TopBar
            darkMode
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
            title="Video title"
            showArrow
            onActionIconClick={handleArrowBackClick}
            iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
          />
        </Grid>
        <Grid item container xs={10} alignItems="center" justify="center">
          <ReactPlayer
            playing
            className="react-player"
            width="90%"
            height="90%"
            url={url}
            controls
            controlsList="nodownload"
          />
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(PlayerPage);

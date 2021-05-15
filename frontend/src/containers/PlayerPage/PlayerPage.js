import React from 'react';
import { Grid } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import TopBar from '../../components/TopBar/TopBar';
import { DeleteIcon, DownloadIcon, InfoIcon } from '../../assets';
import './styles.css';
import { getVideoDetails } from '../../api/VideoAPI';

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      video: undefined,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { videoId } = match.params;
    getVideoDetails(videoId).then((response) => {
      const userId = window.sessionStorage.getItem('id');
      const url = `http://localhost:61346/api/Videos/stream?videoId=${videoId}&userId=${userId}`;
      this.setState({ url, video: response.data });
    });
  }

  render() {
    const { url, video } = this.state;
    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };

    return (
      <Grid className="container" justify="center" container>
        {video === undefined ? null : (
          <>
            <Grid item>
              <TopBar
                darkMode
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                title={video.title}
                showArrow
                onActionIconClick={handleArrowBackClick}
                iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
              />
            </Grid>
            <Grid item xs={9}>
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
          </>
        )}
      </Grid>
    );
  }
}

export default withRouter(PlayerPage);
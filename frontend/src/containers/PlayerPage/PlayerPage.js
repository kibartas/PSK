import React from 'react';
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
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    const { match } = this.props;
    const { videoId } = match.params;
    getVideoDetails(videoId).then((response) => {
      const userId = window.sessionStorage.getItem('id');
      const url = `http://localhost:61346/api/Videos/stream?videoId=${videoId}&userId=${userId}`;
      this.setState({ 
        url,
        video: response.data,
      });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => (
    this.setState({ 
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    })
  )

  render() {
    const { url, video, screenWidth, screenHeight } = this.state;

    const topBarHeight = screenWidth > 600 ? 64 : 56; // These values are from Material UI AppBar source code

    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };

    return (
      <div className='.root'>
        {video === undefined ? null : (
          <>
            <div>
              <TopBar
                darkMode
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                title={video.title}
                showArrow
                onActionIconClick={handleArrowBackClick}
                iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
              />
            </div>
            <div className="player-wrapper">
              <ReactPlayer
                playing
                width={screenWidth}
                height={screenHeight - topBarHeight}
                url={url}
                controls
                controlsList="nodownload"
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(PlayerPage);

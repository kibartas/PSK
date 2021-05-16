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
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    const { match } = this.props;
    const { videoId } = match.params;
    getVideoDetails(videoId).then((response) => {
      const userId = window.sessionStorage.getItem('id');
      const url = `http://localhost:61346/api/Videos/stream?videoId=${videoId}&userId=${userId}`;
      this.setState({ url, video: response.data });
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () => (
    this.setState({ width: window.innerWidth })
  )

  render() {
    const { url, video, width } = this.state;

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
                width="100%"
                height={width >= 600 ? "91.5vh" : "92.3vh"}
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

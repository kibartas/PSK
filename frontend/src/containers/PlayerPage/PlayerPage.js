import React from 'react';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import TopBar from '../../components/TopBar/TopBar';
import { DeleteIcon, DownloadIcon, InfoIcon } from '../../assets';
import './styles.css';
import { getVideoDetails, deleteVideos } from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      video: undefined,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      showDeletionDialog: false,
      playbackErrorShowing: false,
      deletionErrorShowing: false,
    };
    this.topBarRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);

    const { match } = this.props;
    const { videoId } = match.params;

    getVideoDetails(videoId)
      .then((response) => {
        const userId = window.sessionStorage.getItem('id');
        const url = `http://localhost:61346/api/Videos/stream?videoId=${videoId}&userId=${userId}`;
        this.setState({ url, video: response.data });
      })
      .catch(() => this.setState({ playbackErrorShowing: true }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions = () =>
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });

  handleArrowBackClick = () => {
    window.location.href = '/library';
  };

  handleVideoDeletion = () => {
    const { video } = this.state;
    deleteVideos([video.id])
      .then(() => this.handleArrowBackClick())
      .catch(() => this.setState({ deletionErrorShowing: true }));
  }

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  }

  hideDeletionError = () => {
    this.setState({ deletionErrorShowing: false });
  }

  hidePlaybackError = () => {
    this.setState({ playbackErrorShowing: false });
    this.handleArrowBackClick();
  };

  render() {
    const {
      url,
      video,
      screenWidth,
      screenHeight,
      showDeletionDialog,
      playbackErrorShowing,
      deletionErrorShowing
    } = this.state;

    // This fallback height is needed, since TopBar is not rendered until video information is fetched, so ref will be null
    const fallBackTopBarHeight = screenWidth > 600 ? 64 : 56; // These values are from Material UI AppBar source code
    const topBarHeight =
      this.topBarRef.current !== null
        ? this.topBarRef.current.clientHeight
        : fallBackTopBarHeight;

    return (
      <div className=".root">
        {video === undefined ? (
          playbackErrorShowing && (
            <CustomSnackbar
              topCenter
              message="A playback error has occured. Please try again later"
              onClose={this.hidePlaybackError}
              severity="error"
            />
          )
        ) : (
          <>
            <DeleteConfirmationDialog 
              open={showDeletionDialog}
              onConfirm={this.handleVideoDeletion}
              onCancel={this.toggleDeletionDialog}
            />
            {deletionErrorShowing &&
              <CustomSnackbar
                message="Oops... Something wrong happened, we could not delete your video"
                onClose={this.hideDeletionError}
                severity="error"
              />
            }
            <div ref={this.topBarRef}>
              <TopBar
                darkMode
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                title={video.title}
                showArrow
                onActionIconClick={this.handleArrowBackClick}
                iconsToShow={[InfoIcon, DownloadIcon, DeleteIcon]}
                onIconsClick={[
                  () => {},
                  () => {},
                  this.toggleDeletionDialog
                ]}
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

import React from 'react';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import fileDownload from 'js-file-download';
import TopBar from '../../components/TopBar/TopBar';
import { DeleteIcon, DownloadIcon, InfoIcon } from '../../assets';
import './styles.css';
import {
  downloadVideo,
  getVideoDetails,
  markDeleted,
} from '../../api/VideoAPI';
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
      showPlaybackError: false,
      showDownloadError: false,
      showDownloadInProgress: false,
      showDownloadSuccess: false,
      showDeletionDialog: false,
      showDeletionError: false,
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
      .catch(() => this.setState({ showPlaybackError: true }));
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

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  };

  handleVideoDeletion = () => {
    const { video } = this.state;
    markDeleted([video.id])
      .then(() => this.handleArrowBackClick())
      .catch(() => {
        this.setState({ showDeletionError: true });
        this.toggleDeletionDialog();
      });
  };

  hideDeletionError = () => {
    this.setState({ showDeletionError: false });
  };

  hidePlaybackError = () => {
    this.setState({ showPlaybackError: false });
    this.handleArrowBackClick();
  };

  render() {
    const {
      url,
      video,
      screenWidth,
      screenHeight,
      showPlaybackError,
      showDownloadError,
      showDownloadInProgress,
      showDownloadSuccess,
      showDeletionDialog,
      showDeletionError,
    } = this.state;

    // This fallback height is needed, since TopBar is not rendered until video information is fetched, so ref will be null
    const fallBackTopBarHeight = screenWidth > 600 ? 64 : 56; // These values are from Material UI AppBar source code
    const topBarHeight =
      this.topBarRef.current !== null
        ? this.topBarRef.current.clientHeight
        : fallBackTopBarHeight;

    const toggleVideoInformation = () => {
      // WDB-118
    };

    const handleVideoDownload = () => {
      const userId = window.sessionStorage.getItem('id');
      this.setState({ showDownloadInProgress: true });
      downloadVideo(video.id, userId)
        .then((response) => {
          const contentDisposition = response.headers['content-disposition'];
          let filename = contentDisposition.split(';')[1].replaceAll('"', '');
          if (filename.includes('=')) {
            filename = filename.replace('filename=', '');
          }
          fileDownload(response.data, filename);
          this.setState({
            showDownloadInProgress: false,
            showDownloadSuccess: true,
          });
        })
        .catch(() =>
          this.setState({
            showDownloadInProgress: false,
            showDownloadError: true,
          }),
        );
    };

    const renderDownloadSnackbars = () => {
      if (showDownloadError) {
        return (
          <CustomSnackbar
            message="Ooops.. Something wrong happened. Please try again later"
            onClose={() => this.setState({ showDownloadError: false })}
            severity="error"
          />
        );
      }
      if (showDownloadInProgress) {
        return (
          <CustomSnackbar
            message="We are crunhing the video for you"
            severity="info"
          />
        );
      }
      if (showDownloadSuccess) {
        return (
          <CustomSnackbar
            message="Video is ready to be downloaded"
            onClose={() => this.setState({ showDownloadSuccess: false })}
            severity="success"
          />
        );
      }
      return null;
    };

    return (
      <div className=".root">
        {video === undefined ? (
          showPlaybackError && (
            <CustomSnackbar
              topCenter
              message="A playback error has occured. Please try again later"
              onClose={this.hidePlaybackError}
              severity="error"
            />
          )
        ) : (
          <>
            {renderDownloadSnackbars()}
            <DeleteConfirmationDialog
              open={showDeletionDialog}
              onConfirm={this.handleVideoDeletion}
              onCancel={this.toggleDeletionDialog}
            />
            {showDeletionError && (
              <CustomSnackbar
                message="Oops... Something wrong happened, we could not delete your video"
                onClose={this.hideDeletionError}
                severity="error"
              />
            )}
            <div ref={this.topBarRef}>
              <TopBar
                darkMode
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                title={video.title}
                showArrow
                onIconsClick={[
                  toggleVideoInformation,
                  handleVideoDownload,
                  this.toggleDeletionDialog,
                ]}
                onActionIconClick={this.handleArrowBackClick}
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

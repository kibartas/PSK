import React from 'react';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import fileDownload from 'js-file-download';
import TopBar from '../../components/TopBar/TopBar';
import { DeleteIcon, DownloadIcon, InfoIcon, RestoreIcon } from '../../assets';
import './styles.css';
import {
  changeTitle,
  deleteVideos,
  downloadVideo,
  getVideoDetails,
  markForDeletion,
  restoreVideos,
} from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import InformationDrawer from '../../components/InformationDrawer/InformationDrawer';
import { formatBytesToString, secondsToHms } from '../../util';

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
      showInformationDrawer: false,
      showVideoRestorationError: false,
    };
    this.topBarRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    const { match } = this.props;
    const { videoId } = match.params;

    getVideoDetails(videoId)
      .then((response) => {
        const token = sessionStorage.getItem('token');
        const url = `http://localhost:61346/api/Videos/stream?videoId=${videoId}&token=${token}`;

        const video = this.transformVideo(response.data);
        this.setState({ url, video });
      })
      .catch(() => this.setState({ showPlaybackError: true }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  transformVideo = (source) => {
    const size = formatBytesToString(source.size);
    const resolution = `${source.width}x${source.height}`;
    const duration = secondsToHms(source.duration);
    const output = {
      id: source.id,
      title: source.title,
      format: source.format,
      duration,
      resolution,
      size,
    };
    return output;
  };

  updateWindowDimensions = () =>
    this.setState({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });

  handleArrowBackClick = () => {
    const { history } = this.props;
    history.goBack();
  };

  handleRestore = () => {
    const { video } = this.state;
    restoreVideos([video.id])
      .then(() => {
        this.handleArrowBackClick();
      })
      .catch(() => {
        this.setState({ showVideoRestorationError: true });
      });
  };

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  };

  handleVideoMarkForDeletion = () => {
    const { video } = this.state;
    markForDeletion([video.id])
      .then(() => this.handleArrowBackClick())
      .catch(() => {
        this.setState({ showDeletionError: true });
        this.toggleDeletionDialog();
      });
  };

  handleVideoDeletion = () => {
    const { video } = this.state;
    deleteVideos([video.id])
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

  toggleInformationDrawer = () => {
    const { showInformationDrawer } = this.state;
    this.setState({ showInformationDrawer: !showInformationDrawer });
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
      showInformationDrawer,
      showVideoRestorationError,
    } = this.state;
    const { location } = this.props;
    const { isFromBin } = location.state;

    // This fallback height is needed, since TopBar is not rendered until video information is fetched, so ref will be null
    const fallBackTopBarHeight = screenWidth > 600 ? 64 : 56; // These values are from Material UI AppBar source code
    const topBarHeight =
      this.topBarRef.current !== null
        ? this.topBarRef.current.clientHeight
        : fallBackTopBarHeight;

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

    const handleVideoTitleChange = (title) => {
      changeTitle(video.id, title).then(() => {
        video.title = title;
        this.setState({ video });
      });
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
            message="We are crunching the video for you"
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
      <div className="root">
        {video === undefined ? (
          showPlaybackError && (
            <CustomSnackbar
              topCenter
              message="A playback error has occurred. Please try again later"
              onClose={this.hidePlaybackError}
              severity="error"
            />
          )
        ) : (
          <>
            {renderDownloadSnackbars()}
            <DeleteConfirmationDialog
              open={showDeletionDialog}
              onConfirm={
                isFromBin
                  ? this.handleVideoDeletion
                  : this.handleVideoMarkForDeletion
              }
              onCancel={this.toggleDeletionDialog}
              deleteForever={isFromBin}
            />
            {showDeletionError && (
              <CustomSnackbar
                message="Oops... Something wrong happened, we could not delete your video"
                onClose={this.hideDeletionError}
                severity="error"
              />
            )}
            {showVideoRestorationError && (
              <CustomSnackbar
                message="Oops... Something wrong happened, we could not restore your video"
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
                onIconsClick={
                  !isFromBin
                    ? [
                        this.toggleInformationDrawer,
                        handleVideoDownload,
                        this.toggleDeletionDialog,
                      ]
                    : [
                        this.toggleInformationDrawer,
                        this.handleRestore,
                        this.toggleDeletionDialog,
                      ]
                }
                onActionIconClick={this.handleArrowBackClick}
                iconsToShow={
                  !isFromBin
                    ? [InfoIcon, DownloadIcon, DeleteIcon]
                    : [InfoIcon, RestoreIcon, DeleteIcon]
                }
              />
            </div>
            <InformationDrawer
              open={showInformationDrawer}
              onOpen={this.toggleInformationDrawer}
              onClose={this.toggleInformationDrawer}
              videoTitle={video.title}
              videoDuration={video.duration}
              videoSize={video.size}
              videoFormat={video.format}
              videoResolution={video.resolution}
              onVideoTitleChange={handleVideoTitleChange}
            />
            <div className="player-wrapper">
              <ReactPlayer
                playing
                width={screenWidth}
                height={screenHeight - topBarHeight}
                url={url}
                controls
                config={{
                  file: {
                    attributes: {
                      oncontextmenu: (e) => e.preventDefault(),
                      controlsList: 'nodownload',
                    },
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withRouter(PlayerPage);

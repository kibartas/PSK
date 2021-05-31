import React from 'react';
import ReactPlayer from 'react-player';
import { withRouter } from 'react-router';
import fileDownload from 'js-file-download';
import TopBar from '../../components/TopBar/TopBar';
import {
  DeleteIcon,
  DownloadIcon,
  InfoIcon,
  RestoreIcon,
  DeleteForeverIcon,
} from '../../assets';
import './styles.css';
import {
  changeTitle,
  deleteVideos,
  downloadVideos,
  getVideoDetails,
  markForDeletion,
  restoreVideos,
} from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import InformationDrawer from '../../components/InformationDrawer/InformationDrawer';
import { formatBytesToString, secondsToHms } from '../../util';
import OverwriteTitleDialog from '../../components/OverwriteTitleDialog/OverwriteTitleDialog';

class PlayerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      video: undefined,
      resolution: undefined,
      duration: undefined,
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
      showChangeTitleError: false,
      showChangeTitleConflict: false,
      oldTitle: '',
      informationDrawerTitle: '',
    };
    this.setResolutionAndDuration = this.setResolutionAndDuration.bind(this);
    this.topBarRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDimensions);
    const { match } = this.props;
    const { videoId } = match.params;

    getVideoDetails(videoId)
      .then((response) => {
        const token = localStorage.getItem('token');
        const url = `http://13.81.9.144/api/Videos/stream?videoId=${videoId}&token=${token}`;
        const video = this.transformVideo(response.data);
        this.setState({ url, video, informationDrawerTitle: video.title });

        const videoElement = document.getElementsByTagName('video')[0];
        videoElement.addEventListener(
          'loadedmetadata',
          this.setResolutionAndDuration(videoElement),
        );
      })
      .catch(() => this.setState({ showPlaybackError: true }));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    const videoElement = document.getElementsByTagName('video')[0];
    videoElement.removeEventListener(
      'loadedmetadata',
      this.setResolutionAndDuration(videoElement),
    );
  }

  transformVideo = (source) => {
    const size = formatBytesToString(source.size);
    const isFromBin = !!source?.deleteDate;
    return {
      id: source.id,
      title: source.title,
      format: source.format,
      size,
      isFromBin,
      rowVersion: source.rowVersion,
    };
  };

  setResolutionAndDuration = (videoElement) => () => {
    const resolution = `${videoElement.videoWidth}x${videoElement.videoHeight}`;
    const duration = secondsToHms(videoElement.duration);
    this.setState({
      resolution,
      duration,
    });
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

  handleVideoTitleChange = (title) => {
    const { video } = this.state;
    this.setState({ showChangeTitleError: false });
    this.setState({ showChangeTitleConflict: false });
    changeTitle(video.id, title, video.rowVersion)
      .then(({ data }) => {
        video.title = data.title;
        video.rowVersion = data.rowVersion;
        this.setState({ video });
      })
      .catch((error) => {
        if (error === undefined) {
          this.setState({ showChangeTitleError: true });
        }
        if (error.response.status === 409) {
          const { data } = error.response;
          video.title = data.title;
          video.rowVersion = data.rowVersion;
          this.setState({
            oldTitle: data.oldTitle,
            video,
            showChangeTitleConflict: true,
          });
        }
      });
  };

  handleInformationDrawerTitleChange = (newTitle) => {
    this.setState({ informationDrawerTitle: newTitle });
  };

  handleVideoDownload = () => {
    const { video } = this.state;
    this.setState({ showDownloadInProgress: true });
    downloadVideos([video.id])
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

  renderDownloadSnackbars = () => {
    const {
      showDownloadError,
      showDownloadInProgress,
      showDownloadSuccess,
    } = this.state;

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

  handleOverwriteTitleDialogCancel = () => {
    const { video, oldTitle } = this.state;
    video.title = oldTitle;
    this.setState({
      showChangeTitleConflict: false,
      video,
      informationDrawerTitle: oldTitle,
    });
  };

  handleOverwriteTitleDialogConfirm = () => {
    const { informationDrawerTitle } = this.state;
    this.setState({ showChangeTitleConflict: false });
    this.handleVideoTitleChange(informationDrawerTitle);
  };

  render() {
    const {
      url,
      video,
      resolution,
      duration,
      screenWidth,
      screenHeight,
      showPlaybackError,
      showDeletionDialog,
      showDeletionError,
      showInformationDrawer,
      showVideoRestorationError,
      showChangeTitleError,
      showChangeTitleConflict,
      oldTitle,
      informationDrawerTitle,
    } = this.state;

    const isFromBin = video ? video.isFromBin : false;
    const shouldRenderInfoDrawer = video && duration && resolution;

    // This fallback height is needed, since TopBar is not rendered until video information is fetched, so ref will be null
    const fallBackTopBarHeight = screenWidth > 600 ? 64 : 56; // These values are from Material UI AppBar source code
    const topBarHeight =
      this.topBarRef.current !== null
        ? this.topBarRef.current.clientHeight
        : fallBackTopBarHeight;
    console.log(url);
    return (
      <div className="root">
        <OverwriteTitleDialog
          open={showChangeTitleConflict}
          oldTitle={oldTitle}
          newTitle={video?.title}
          onCancel={this.handleOverwriteTitleDialogCancel}
          onConfirm={this.handleOverwriteTitleDialogConfirm}
        />
        {showPlaybackError && (
          <CustomSnackbar
            topCenter
            message="A playback error has occurred. Please try again later"
            onClose={this.hidePlaybackError}
            severity="error"
          />
        )}
        {this.renderDownloadSnackbars()}
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
        {showChangeTitleError && (
          <CustomSnackbar
            message="Oops... Something wrong happened, we could not restore your video"
            onClose={this.hideDeletionError}
            severity="error"
          />
        )}
        <div ref={this.topBarRef}>
          <TopBar
            darkMode
            firstName={window.localStorage.getItem('firstName')}
            lastName={window.localStorage.getItem('lastName')}
            title={video ? video.title : ''}
            showArrow
            onIconsClick={
              !isFromBin
                ? [
                    this.toggleInformationDrawer,
                    this.handleVideoDownload,
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
                : [InfoIcon, RestoreIcon, DeleteForeverIcon]
            }
          />
        </div>
        {shouldRenderInfoDrawer && (
          <InformationDrawer
            open={showInformationDrawer}
            onOpen={this.toggleInformationDrawer}
            onClose={this.toggleInformationDrawer}
            title={informationDrawerTitle}
            setTitle={this.handleInformationDrawerTitleChange}
            videoDuration={duration}
            videoSize={video.size}
            videoFormat={video.format}
            videoResolution={resolution}
            onVideoTitleChange={this.handleVideoTitleChange}
            disableTextField={showChangeTitleConflict}
          />
        )}
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
                  onContextMenu: (e) => e.preventDefault(),
                  controlsList: 'nodownload',
                },
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(PlayerPage);

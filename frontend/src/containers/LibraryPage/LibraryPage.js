import { Grid } from '@material-ui/core';
import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import fileDownload from 'js-file-download';
import SelectAllIcon from '../../assets/generic/SelectAllIcon';
import { DeleteIcon, DownloadIcon, UploadIcon } from '../../assets';
import EmptyLibraryContent from '../../components/EmptyLibraryContent/EmptyLibraryContent';
import TopBar from '../../components/TopBar/TopBar';
import UploadModal from '../../components/UploadModal/UploadModal';
import './styles.css';
import VideoCardsByDate from '../../components/VideoCardsByDate/VideoCardsByDate';
import NavDrawer from '../../components/NavDrawer/NavDrawer';
import {
  downloadMultipleVideos,
  getAllVideos,
  markForDeletion,
} from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getUserVideosSize } from '../../api/UserAPI';

const transformCards = (cards) => {
  const transformedCards = cards.reduce((acc, val) => {
    if (!acc[val.uploadDate]) {
      acc[val.uploadDate] = [];
    }
    acc[val.uploadDate].push(val);
    return acc;
  }, {});
  return { transformedCards };
};

const sortCardDates = (cards, ascending = true) =>
  Object.keys(cards).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (ascending) {
      if (dateA.getTime() < dateB.getTime()) return 1;
      if (dateA.getTime() === dateB.getTime()) return 0;
      return -1;
    }
    if (dateA.getTime() < dateB.getTime()) return -1;
    if (dateA.getTime() === dateB.getTime()) return 0;
    return 1;
  });

class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCards: [],
      size: 0,
      sortedVideoCardDates: [],
      selectedCards: [],
      showUploadModal: false,
      showNavDrawer: false,
      showDeletionDialog: false,
      showDeletionError: false,
      sortAscending: false,
      showDownloadError: false,
      showDownloadSuccess: false,
      showDownloadInProgress: false,
      showVideoRetrievalError: false,
    };
  }

  componentDidMount() {
    getAllVideos()
      .then((response) => {
        if (response.data.length !== 0) {
          const { transformedCards } = transformCards(response.data);
          const sortedDates = sortCardDates(transformedCards);
          this.setState({
            videoCards: transformedCards,
            sortedVideoCardDates: sortedDates,
          });
        } else {
          this.setState({
            videoCards: [],
          });
        }
      })
      .catch(() => {
        this.setState({ showVideoRetrievalError: true });
      });
    getUserVideosSize()
      .then((response) => this.setState({ size: response.data }))
      .catch(() => {
        this.setState({ size: 0 });
      });
  }

  toggleSort = () => {
    const { sortAscending, videoCards } = this.state;
    this.setState({
      sortAscending: !sortAscending,
      sortedVideoCardDates: sortCardDates(videoCards, sortAscending),
    });
  };

  toggleSelectAll = () => {
    const { videoCards } = this.state;
    if (Object.values(videoCards).length === 0) return;
    const allCards = Object.values(videoCards)
      .reduce((acc, val) => acc.concat(val), [])
      .map((val) => val.id);
    this.setState({ selectedCards: allCards });
  };

  toggleNavDrawer = () => {
    const { showNavDrawer } = this.state;
    this.setState({ showNavDrawer: !showNavDrawer });
  };

  toggleUploadModal = () => {
    const { showUploadModal } = this.state;
    this.setState({ showUploadModal: !showUploadModal });
  };

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  };

  handleVideoDeletion = () => {
    const { selectedCards } = this.state;
    markForDeletion(selectedCards)
      .then(() => window.location.reload())
      .catch(() => this.setState({ showDeletionError: true }));
  };

  hideDeletionError = () => {
    this.setState({ showDeletionError: false });
    window.location.reload();
  };

  handleVideosDownload = () => {
    const { selectedCards } = this.state;
    this.setState({ showDownloadInProgress: true });
    downloadMultipleVideos(selectedCards)
      .then((response) => {
        const contentDisposition = response.headers['content-disposition'];
        const filename = contentDisposition.split(';')[1].split('filename=')[1];
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
      )
      .finally(() => this.setState({ selectedCards: [] }));
  };

  render() {
    const {
      showUploadModal,
      showNavDrawer,
      showDeletionDialog,
      showDeletionError,
      videoCards,
      size,
      sortedVideoCardDates,
      selectedCards,
      showDownloadError,
      showDownloadInProgress,
      showDownloadSuccess,
      showVideoRetrievalError,
    } = this.state;

    const handleSelect = (id) => {
      if (selectedCards.find((cardId) => cardId === id)) {
        const newSelectedCards = selectedCards.filter(
          (cardId) => cardId !== id,
        );
        this.setState({ selectedCards: newSelectedCards });
      } else {
        this.setState({ selectedCards: [...selectedCards, id] });
      }
    };

    const handleDateSelect = (ids) => {
      if (ids.every((id) => selectedCards.includes(id))) {
        const newSelectedCards = selectedCards.filter(
          (id) => !ids.includes(id),
        );
        this.setState({ selectedCards: newSelectedCards });
      } else {
        const newSelectedCards = selectedCards.slice();
        ids.forEach((id) => {
          if (!selectedCards.includes(id)) newSelectedCards.push(id);
        });
        this.setState({ selectedCards: newSelectedCards });
      }
    };

    const renderSnackbars = () => {
      if (showDownloadError) {
        return (
          <CustomSnackbar
            message="Ooops.. Something wrong happened. Please try again later"
            onClose={() => this.setState({ showDownloadError: false })}
            severity="error"
          />
        );
      }
      if (showVideoRetrievalError) {
        return (
          <CustomSnackbar
            message="There was an error retrieving your videos. Please try again later"
            onClose={() => this.setState({ showVideoRetrievalError: false })}
            severity="error"
          />
        );
      }
      if (showDownloadInProgress) {
        return (
          <CustomSnackbar
            message={
              selectedCards.length === 1
                ? 'Please wait. We are crunching your video'
                : 'Please wait. We are crunching the videos for you'
            }
            severity="info"
          />
        );
      }
      if (showDownloadSuccess) {
        return (
          <CustomSnackbar
            message={
              selectedCards.length === 1
                ? 'Video is ready to be downloaded'
                : 'Videos are ready to be downloaded'
            }
            onClose={() => this.setState({ showDownloadSuccess: false })}
            severity="success"
          />
        );
      }
      return null;
    };

    return (
      <>
        {renderSnackbars()}
        <Grid
          className="root"
          style={{ height: videoCards.length === 0 ? '100vh' : 'auto' }}
          container
          direction="column"
        >
          <NavDrawer
            open={showNavDrawer}
            onOpen={this.toggleNavDrawer}
            onClose={this.toggleNavDrawer}
            spaceTaken={size}
          />
          <UploadModal
            show={showUploadModal}
            onClose={this.toggleUploadModal}
          />
          <DeleteConfirmationDialog
            open={showDeletionDialog}
            onConfirm={this.handleVideoDeletion}
            onCancel={this.toggleDeletionDialog}
            multipleVideos={selectedCards.length > 1}
          />
          {showDeletionError && (
            <CustomSnackbar
              message={
                selectedCards.length === 1
                  ? 'Oops... Something wrong happened. We could not delete your video'
                  : 'Oops... Something wrong happened. Some videos might not have been deleted'
              }
              onClose={this.hideDeletionError}
              severity="error"
            />
          )}
          <Grid item>
            {selectedCards.length === 0 ? (
              <TopBar
                title="Video Library"
                onActionIconClick={this.toggleNavDrawer}
                showAvatarAndLogout
                firstName={window.localStorage.getItem('firstName')}
                lastName={window.localStorage.getItem('lastName')}
                iconsToShow={[SelectAllIcon, SortIcon, UploadIcon]}
                onIconsClick={[
                  this.toggleSelectAll,
                  this.toggleSort,
                  this.toggleUploadModal,
                ]}
              />
            ) : (
              <TopBar
                title={`${selectedCards.length} ${
                  selectedCards.length === 1 ? 'video' : 'videos'
                } selected`}
                showArrow
                iconsToShow={[DownloadIcon, DeleteIcon]}
                onIconsClick={[
                  this.handleVideosDownload,
                  this.toggleDeletionDialog,
                ]}
                onActionIconClick={() => this.setState({ selectedCards: [] })}
                disableIcons={showDownloadInProgress}
              />
            )}
          </Grid>
          {videoCards.length !== 0 ? (
            <Grid
              className="card_container"
              container
              item
              direction="column"
              spacing={5}
            >
              {sortedVideoCardDates.map((uploadDate) => (
                <VideoCardsByDate
                  key={uploadDate}
                  onSelect={handleSelect}
                  videoCards={videoCards[uploadDate]}
                  onSelectDate={handleDateSelect}
                  selectedCards={selectedCards}
                />
              ))}
            </Grid>
          ) : (
            <Grid container className="flex_grow">
              <EmptyLibraryContent />
            </Grid>
          )}
        </Grid>
      </>
    );
  }
}

export default LibraryPage;

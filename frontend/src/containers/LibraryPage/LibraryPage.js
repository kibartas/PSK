import { Grid } from '@material-ui/core';
import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import fileDownload from 'js-file-download';
import { DeleteIcon, DownloadIcon, UploadIcon } from '../../assets';
import EmptyLibraryContent from '../../components/EmptyLibraryContent/EmptyLibraryContent';
import TopBar from '../../components/TopBar/TopBar';
import UploadModal from '../../components/UploadModal/UploadModal';
import './styles.css';
import VideoCardsByDate from '../../components/VideoCardsByDate/VideoCardsByDate';
import NavDrawer from '../../components/NavDrawer/NavDrawer';
import { downloadMultipleVideos, getAllVideos } from '../../api/VideoAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';

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
      sortedVideoCardDates: [],
      selectedCards: [],
      showUploadModal: false,
      showNavDrawer: false,
      sortAscending: false,
      showDownloadError: false,
      showDownloadSuccess: false,
      showDownloadInProgress: false,
    };
  }

  componentDidMount() {
    getAllVideos().then((response) => {
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
    });
  }

  toggleSort = () => {
    const { sortAscending, videoCards } = this.state;
    this.setState({
      sortAscending: !sortAscending,
      sortedVideoCardDates: sortCardDates(videoCards, sortAscending),
    });
  };

  toggleNavDrawer = () => {
    const { showNavDrawer } = this.state;
    this.setState({ showNavDrawer: !showNavDrawer });
  };

  toggleUploadModal = () => {
    const { showUploadModal } = this.state;
    this.setState({ showUploadModal: !showUploadModal });
  };

  handleUploadModalClose = () => {
    this.toggleUploadModal();
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
      videoCards,
      sortedVideoCardDates,
      selectedCards,
      showDownloadError,
      showDownloadInProgress,
      showDownloadSuccess,
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

    const renderDownloadSnackbars = () => {
      if (showDownloadError) {
        return (
          <CustomSnackbar
            message="Ooops.. Something wrong happened. Please try again later"
            onClose={() => this.setState({ showDownloadError: false })}
            severity="error"
            topCenter
          />
        );
      }
      if (showDownloadInProgress) {
        return (
          <CustomSnackbar
            message="Please wait. We are crunching the videos for you"
            severity="info"
            topCenter
          />
        );
      }
      if (showDownloadSuccess) {
        return (
          <CustomSnackbar
            message="Videos downloaded successfully"
            onClose={() => this.setState({ showDownloadSuccess: false })}
            severity="success"
            topCenter
          />
        );
      }
      return null;
    };

    return (
      <>
        {renderDownloadSnackbars()}
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
            spaceTaken={100000000} // [TM]: TODO WDB-122 fetch space taken in LibraryPage componentDidMount and save it in state
          />
          <UploadModal
            show={showUploadModal}
            onClose={this.toggleUploadModal}
          />
          <Grid item>
            {selectedCards.length === 0 ? (
              <TopBar
                title="Video Library"
                onActionIconClick={this.toggleNavDrawer}
                showAvatarAndLogout
                firstName={window.sessionStorage.getItem('firstName')}
                lastName={window.sessionStorage.getItem('lastName')}
                iconsToShow={[SortIcon, UploadIcon]}
                onIconsClick={[this.toggleSort, this.toggleUploadModal]}
              />
            ) : (
              <TopBar
                title={`${selectedCards.length} ${
                  selectedCards.length === 1 ? 'video' : 'videos'
                } selected`}
                showArrow
                iconsToShow={[DownloadIcon, DeleteIcon]}
                onIconsClick={[this.handleVideosDownload]}
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

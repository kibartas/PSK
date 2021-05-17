import { Grid } from '@material-ui/core';
import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import { UploadIcon, DownloadIcon, DeleteIcon } from '../../assets';
import EmptyLibraryContent from '../../components/EmptyLibraryContent/EmptyLibraryContent';
import TopBar from '../../components/TopBar/TopBar';
import UploadModal from '../../components/UploadModal/UploadModal';
import './styles.css';
import VideoCardsByDate from '../../components/VideoCardsByDate/VideoCardsByDate';
import NavDrawer from '../../components/NavDrawer/NavDrawer';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog/DeleteConfirmationDialog';
import { getAllVideos, deleteVideos } from '../../api/VideoAPI';

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
      showDeletionDialog: false, 
      showDeletionError: false,
      sortAscending: false,
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
  }

  toggleUploadModal = () => {
    const { showUploadModal } = this.state;
    this.setState({ showUploadModal: !showUploadModal });
  };

  toggleDeletionDialog = () => {
    const { showDeletionDialog } = this.state;
    this.setState({ showDeletionDialog: !showDeletionDialog });
  }

  handleVideoDeletion = () => {
    const { selectedCards } = this.state;
    deleteVideos(selectedCards)
      .then(() => window.location.reload())
      .catch(() => this.setState({ showDeletionError: true }));
  }

  hideDeletionError = () => {
    this.setState({ showDeletionError: false });
    window.location.reload();
  }

  render() {
    const {
      showUploadModal,
      showNavDrawer,
      showDeletionDialog,
      videoCards,
      sortedVideoCardDates,
      selectedCards,
      showDeletionError,
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

    return (
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
        <DeleteConfirmationDialog
          open={showDeletionDialog}
          onConfirm={this.handleVideoDeletion}
          onCancel={this.toggleDeletionDialog}
          multipleVideos={selectedCards.length > 1}
        />
        {showDeletionError &&
          <CustomSnackbar
            message={selectedCards.length === 1 ? 
              "Oops... Something wrong happened. We could not delete your video" :
              "Oops... Something wrong happened. Some videos might not have been deleted"
            }
            onClose={this.hideDeletionError}
            severity="error"
          />
        }
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
              onActionIconClick={() => this.setState({ selectedCards: [] })}
              iconsToShow={[DownloadIcon, DeleteIcon]}
              onIconsClick={[
                () => {},
                this.toggleDeletionDialog
              ]}
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
    );
  }
}

export default LibraryPage;

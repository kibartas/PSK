import { Grid } from '@material-ui/core';
import React from 'react';
import SortIcon from '@material-ui/icons/Sort';
import { UploadIcon, emptyLibraryDrawing, McRideScreaming } from '../../assets';
import EmptyLibraryContent from '../../components/EmptyLibraryContent/EmptyLibraryContent';
import TopBar from '../../components/TopBar/TopBar';
import UploadModal from '../../components/UploadModal/UploadModal';
import './styles.css';
import VideoCardsByDate from '../../components/VideoCardsByDate/VideoCardsByDate';

const mockedCards = [
  {
    id: '12',
    title: 'Screaming guy',
    uploadDate: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '11',
    title: 'Some other title #2',
    uploadDate: '2020-11-23',
    thumbnail: emptyLibraryDrawing,
  },
  {
    id: '0',
    title: 'Another title',
    uploadDate: '2020-09-30',
  },
  {
    id: '2',
    title: 'Screaming guy',
    uploadDate: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '3',
    title: 'Screaming guy',
    uploadDate: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '4',
    title: 'Screaming guy',
    uploadDate: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '5',
    title: 'Screaming guy',
    uploadDate: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '22',
    title: 'Screaming guy',
    date: '2020-11-25',
    thumbnail: McRideScreaming,
  },
  {
    id: '23',
    title: 'Screaming guy',
    date: '2020-11-25',
    thumbnail: McRideScreaming,
  },
  {
    id: '24',
    title: 'Screaming guy',
    date: '2020-11-25',
    thumbnail: McRideScreaming,
  },
  {
    id: '26',
    title: 'Screaming guy',
    date: '2020-11-26',
    thumbnail: McRideScreaming,
  },
];

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
  Object.keys(cards).sort((a, b) =>
    ascending ? new Date(a) < new Date(b) : new Date(a) > new Date(b),
  );

class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCards: [],
      sortedVideoCardDates: [],
      selectedCards: [],
      showUploadModal: false,
      sortAscending: false,
    };
  }

  componentDidMount() {
    /* [JR]: TODO WDB-104 */
    const { transformedCards } = transformCards(mockedCards); // should be info from backend
    const sortedDates = sortCardDates(transformedCards);
    this.setState({
      videoCards: transformedCards,
      sortedVideoCardDates: sortedDates,
    });
  }

  toggleSort = () => {
    const { sortAscending, videoCards } = this.state;
    this.setState({
      sortAscending: !sortAscending,
      sortedVideoCardDates: sortCardDates(videoCards, sortAscending),
    });
  };

  toggleUploadModal = () => {
    const { showUploadModal } = this.state;
    this.setState({ showUploadModal: !showUploadModal });
  };

  // eslint-disable-next-line no-unused-vars
  handleUpload = (addedVideos, videoNames) => {
    // [TM]: TODO WDB-104
  };

  handleUploadModalClose = () => {
    this.toggleUploadModal();
  };

  render() {
    const {
      showUploadModal,
      videoCards,
      sortedVideoCardDates,
      selectedCards,
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
        <UploadModal
          show={showUploadModal}
          onUpload={this.handleUpload}
          onClose={this.handleUploadModalClose}
        />
        <Grid item className="flexGrow">
          {selectedCards.length === 0 ? (
            <TopBar
              title="Video Library"
              onActionIconClick={() => {
                /* [TM:] TODO WDB-29 */
              }}
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

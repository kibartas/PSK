import { Grid } from '@material-ui/core';
import React from 'react';
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
    date: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '11',
    title: 'Some other title #2',
    date: '2020-11-23',
    thumbnail: emptyLibraryDrawing,
  },
  {
    id: '0',
    title: 'Another title',
    date: '2020-09-30',
  },
  {
    id: '2',
    title: 'Screaming guy',
    date: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '3',
    title: 'Screaming guy',
    date: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '4',
    title: 'Screaming guy',
    date: '2020-11-23',
    thumbnail: McRideScreaming,
  },
  {
    id: '5',
    title: 'Screaming guy',
    date: '2020-11-23',
    thumbnail: McRideScreaming,
  },
];

const transformCards = (cards) => {
  const transformedCards = cards.reduce((acc, val) => {
    if (!acc[val.date]) {
      acc[val.date] = [];
    }
    acc[val.date].push(val);
    return acc;
  }, {});
  const sortedDates = Object.keys(transformedCards).sort(
    (a, b) => new Date(a) < new Date(b),
  );
  return { transformedCards, sortedDates };
};

class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCards: [],
      sortedVideoCardDates: [],
      selectedCards: [],
      showUploadModal: false,
    };
  }

  componentDidMount() {
    /* [JR]: TODO WDB-104 */
    const { transformedCards, sortedDates } = transformCards(mockedCards); // should be info from backend
    this.setState({
      videoCards: transformedCards,
      sortedVideoCardDates: sortedDates,
    });
  }

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

    const handleSelect = (id, isSelected) => {
      if (isSelected) {
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
          <TopBar
            title="Video Library"
            onActionIconClick={() => {
              /* [TM:] TODO WDB-29 */
            }}
            showAvatarAndLogout
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
            iconsToShow={[UploadIcon]}
            onIconsClick={[this.toggleUploadModal]}
          />
        </Grid>
        {videoCards.length !== 0 ? (
          <Grid
            className="cardContainer"
            container
            item
            direction="column"
            spacing={5}
          >
            {sortedVideoCardDates.map((date) => (
              <VideoCardsByDate
                key={date}
                onSelect={handleSelect}
                videoCards={videoCards[date]}
              />
            ))}
          </Grid>
        ) : (
          <Grid container className="flexGrow">
            <EmptyLibraryContent />
          </Grid>
        )}
      </Grid>
    );
  }
}

export default LibraryPage;

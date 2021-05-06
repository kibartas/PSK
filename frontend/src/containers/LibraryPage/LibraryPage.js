import { Grid } from '@material-ui/core';
import React from 'react';
import { UploadIcon } from '../../assets';
import TopBar from '../../components/TopBar/TopBar';
import UploadModal from '../../components/UploadModal/UploadModal';

class LibraryPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUploadModal: false
    };
  }

  toggleUploadModal = () => {
    const { showUploadModal } = this.state;
    this.setState({ showUploadModal: !showUploadModal });
  }

  // eslint-disable-next-line no-unused-vars
  handleUpload = (addedVideos, videoNames) => {
    // [TM]: TODO WDB-104
  }

  handeUploadModalClose = () => {
    this.toggleUploadModal();
  }

  render() {
    const { showUploadModal } = this.state;

    return (
      <Grid container>
        <UploadModal
          show={showUploadModal}
          onUpload={this.handleUpload}
          onClose={this.handeUploadModalClose}
        />
        <Grid item>
          <TopBar
            title="Video Library"
            onActionIconClick={() => {
              /* [TM:] TODO WDB-29 */
            }}
            showAvatarAndLogout
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
            iconsToShow={[UploadIcon]}
            onIconsClick={[
              this.toggleUploadModal,
            ]}
          />
        </Grid>
      </Grid>
    );
  }
}

export default LibraryPage;

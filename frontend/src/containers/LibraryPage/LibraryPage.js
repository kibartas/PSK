import { Grid } from '@material-ui/core';
import React from 'react';
import { UploadIcon } from '../../assets';
import TopBar from '../../components/TopBar/TopBar';

class LibraryPage extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item>
          <TopBar
            title="Video Library"
            showAvatarAndLogout
            firstName="Juris"
            lastName="Jurgaitis"
            iconsToShow={[
              UploadIcon
            ]}
            onIconsClick={[
              () => { "[TM]: TODO WDB-5" }
            ]}
          />
        </Grid>
      </Grid>
    )
  }
}

export default LibraryPage;

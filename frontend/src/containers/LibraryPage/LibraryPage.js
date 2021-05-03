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
            onActionIconClick={() => {
              /* [TM:] TODO WDB-29 */
            }}
            showAvatarAndLogout
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
            iconsToShow={[UploadIcon]}
            onIconsClick={[
              () => {
                /* [TM]: TODO WDB-5 */
              },
            ]}
          />
        </Grid>
      </Grid>
    );
  }
}

export default LibraryPage;

import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import { UploadIcon, emptyLibraryDrawing } from '../../assets';
import TopBar from '../../components/TopBar/TopBar';
import './styles.css';

class LibraryPage extends React.Component {
  render() {
    return (
      <Grid container direction="column" style={{ height: '100vh' }}>
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
        <Grid
          style={{ height: '100vh' }}
          direction="column"
          item
          container
          justify="center"
          alignItems="center"
          spacing={3}
        >
          <Grid item>
            <img
              id="empty-library"
              src={emptyLibraryDrawing}
              alt="Two friendly people standing"
            />
          </Grid>
          <Grid item container direction="column" alignItems="center">
            <Grid item>
              <Typography align="center" id="empty-primary-text" variant="h3">
                It feels empty here...
              </Typography>
            </Grid>
            <Grid item>
              <Typography align="center" id="empty-secondary-text" variant="h5">
                Upload a video by clicking the upload icon on the top
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default LibraryPage;

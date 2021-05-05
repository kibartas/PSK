import { Grid } from '@material-ui/core';
import React from 'react';
import { UploadIcon } from '../../assets';
import EmptyLibrarySubPage from '../../components/EmptyLibrarySubPage/EmptyLibrarySubPage';
import TopBar from '../../components/TopBar/TopBar';
import './styles.css';

class LibraryPage extends React.Component {
  render() {
    return (
      <Grid className='root' container direction='column'>
        <Grid item>
          <TopBar
            title='Video Library'
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
        <Grid item style={{ flexGrow: 1 }}>
          <EmptyLibrarySubPage />
        </Grid>
      </Grid>
    );
  }
}

export default LibraryPage;

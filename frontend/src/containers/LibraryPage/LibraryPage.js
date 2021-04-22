import { Grid } from '@material-ui/core';
import React from 'react';
import TopBar from '../../components/TopBar/TopBar';

class LibraryPage extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item>
          <TopBar
            title="Video Library"
            firstName="Juris"
            lastName="Jurgaitis"
            showIcons={{
              upload: true,
            }}
          />
        </Grid>
      </Grid>
    )
  }
}

export default LibraryPage;

import React from 'react';
import { Grid } from '@material-ui/core';
import NavDrawer from '../../components/NavDrawer/NavDrawer';
import TopBar from '../../components/TopBar/TopBar';
import './styles.css';
import EmptyRecylingBinContent from '../../components/EmptyRecyclingBinContent/EmptyRecyclingBinContent';

class RecyclingBinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNavDrawer: false,
    };
  }

  toggleNavDrawer = () => {
    const { showNavDrawer } = this.state;
    this.setState({ showNavDrawer: !showNavDrawer });
  }

  render() {
    const {
      showNavDrawer,
    } = this.state;

    return (
      <Grid
        className="root"
        container
        direction="column"
      >
        <NavDrawer
          open={showNavDrawer}
          onOpen={this.toggleNavDrawer}
          onClose={this.toggleNavDrawer}
          spaceTaken={100000000} // [TM]: TODO WDB-122 fetch space taken in RecyclingBinPage componentDidMount and save it in state
        />
        <Grid item>
          <TopBar
            title="Recycling Bin"
            onActionIconClick={this.toggleNavDrawer}
            showAvatarAndLogout
            firstName={window.sessionStorage.getItem('firstName')}
            lastName={window.sessionStorage.getItem('lastName')}
          />
        </Grid>
        <Grid item className='flexGrow'>
          <EmptyRecylingBinContent />
        </Grid>
      </Grid>
    );
  }
}

export default RecyclingBinPage;

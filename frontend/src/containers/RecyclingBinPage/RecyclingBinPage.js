import React from 'react';
import { Grid } from '@material-ui/core';
import NavDrawer from '../../components/NavDrawer/NavDrawer';
import TopBar from '../../components/TopBar/TopBar';
import './styles.css';
import EmptyRecyclingBinContent from '../../components/EmptyRecyclingBinContent/EmptyRecyclingBinContent';
import { getUserVideosSize } from '../../api/UserAPI';

class RecyclingBinPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNavDrawer: false,
      size: 0,
    };
  }

  componentDidMount() {
    getUserVideosSize().then((response) =>
      this.setState({ size: response.data }),
    );
  }

  toggleNavDrawer = () => {
    const { showNavDrawer } = this.state;
    this.setState({ showNavDrawer: !showNavDrawer });
  };

  render() {
    const { showNavDrawer, size } = this.state;

    return (
      <Grid className="root" container direction="column">
        <NavDrawer
          open={showNavDrawer}
          onOpen={this.toggleNavDrawer}
          onClose={this.toggleNavDrawer}
          spaceTaken={size}
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
        <Grid item className="flexGrow">
          <EmptyRecyclingBinContent />
        </Grid>
      </Grid>
    );
  }
}

export default RecyclingBinPage;

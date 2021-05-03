import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import ChangeProfileForm from '../../components/ChangeProfileForm/ChangeProfileForm';
import TopBar from '../../components/TopBar/TopBar';

class ProfilePage extends React.Component {
  render() {
    const firstName = window.sessionStorage.getItem('firstName');
    const lastName = window.sessionStorage.getItem('lastName');
    const email = window.sessionStorage.getItem('email');

    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };

    return (
      <Grid container>
        <Grid item>
          <TopBar
            showArrow
            title="Profile page"
            onActionIconClick={handleArrowBackClick}
            showAvatarAndLogout
            firstName={firstName}
            lastName={lastName}
          />
        </Grid>
        <Grid container className="root" alignItems="center" justify="center">
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <ChangeProfileForm
              firstName={firstName}
              lastName={lastName}
              mail={email}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default ProfilePage;

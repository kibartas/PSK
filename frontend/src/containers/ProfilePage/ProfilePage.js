import { Grid } from '@material-ui/core';
import React from 'react';
import { updateCredentials } from '../../api/UserAPI';
import ChangeProfileForm from '../../components/ChangeProfileForm/ChangeProfileForm';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import TopBar from '../../components/TopBar/TopBar';

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showGeneralError: false,
      showConflictError: false,
      showSuccess: false,
    };
  }

  render() {
    const firstName = window.sessionStorage.getItem('firstName');
    const lastName = window.sessionStorage.getItem('lastName');
    const email = window.sessionStorage.getItem('email');
    const { showSuccess, showConflictError, showGeneralError } = this.state;

    const handleArrowBackClick = () => {
      window.location.href = '/library';
    };

    const hideGeneralError = () => {
      this.setState({ showGeneralError: false });
    };

    const hideConflictError = () => {
      this.setState({ showConflictError: false });
    };

    const hideSuccess = () => {
      this.setState({ showSuccess: false });
    };

    const handleSaveChanges = (mail, password) => {
      const credentials = {
        email: mail,
        password,
      };
      updateCredentials(credentials)
        .then(() => {
          window.sessionStorage.setItem('email', mail);
          this.setState({ showSuccess: true });
        })
        .catch((ex) => {
          if (ex.response === undefined) {
            this.setState({ showConflictError: true });
            return;
          }
          const { status } = ex.response;
          if (status === 409) this.setState({ showConflictError: true });
          else this.setState({ showGeneralError: true });
        });
    };

    return (
      <>
        {showGeneralError && (
          <CustomSnackbar
            topCenter
            message="A server error has occured. Please try again later"
            onClose={hideGeneralError}
            severity="error"
          />
        )}
        {showConflictError && (
          <CustomSnackbar
            topCenter
            message="User with the email you specified already exists"
            onClose={hideConflictError}
            severity="error"
          />
        )}
        {showSuccess && (
          <CustomSnackbar
            topCenter
            message="Credentials changed successfuly"
            onClose={hideSuccess}
            severity="success"
          />
        )}
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
            <Grid item xs={11} sm={6} md={4} lg={3}>
              <ChangeProfileForm
                firstName={firstName}
                lastName={lastName}
                mail={email}
                onSaveChanges={handleSaveChanges}
              />
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ProfilePage;

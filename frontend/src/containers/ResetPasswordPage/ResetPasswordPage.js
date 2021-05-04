import React from 'react';
import { withRouter } from 'react-router';
import { Grid } from '@material-ui/core';
import { resetPassword, verify } from '../../api/PublicAPI';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import ResetPasswordCard from '../../components/ResetPasswordCard/ResetPasswordCard';

class ResetPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSuccess: false,
      showVerificationError: false,
      token: null,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { token } = match.params;
    this.setState({ token });
  }

  onSend = (password) => {
    const { token } = this.state;
    resetPassword(token, password)
      .then(() => this.setState({ showSuccess: true }))
      .catch(() => this.setState({ showVerificationError: true }));
  };

  render() {
    const { showSuccess, showVerificationError } = this.state;

    const hideVerificationError = () => {
      this.setState({ showVerificationError: false });
    };

    const hideSuccess = () => {
      this.setState({ showSuccess: false });
    };

    return (
      <>
        {showSuccess && (
          <CustomSnackbar
            topCenter
            message="Your password has been changed successfully"
            onClose={hideSuccess}
            severity="success"
          />
        )}
        {showVerificationError && (
          <CustomSnackbar
            topCenter
            message="A server error has occurred. Please try later"
            onClose={hideVerificationError}
            severity="error"
          />
        )}
        <Grid
          container
          className="root"
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <ResetPasswordCard onSend={this.onSend} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(ResetPasswordPage);

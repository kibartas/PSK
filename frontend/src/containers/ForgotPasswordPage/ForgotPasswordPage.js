import React from 'react';
import { Grid } from '@material-ui/core';
import ForgotPasswordCard from '../../components/ForgotPasswordCard/ForgotPasswordCard';
import CustomSnackbar from '../../components/CustomSnackbar/CustomSnackbar';
import { sendForgotPasswordEmail } from '../../api/PublicAPI';

class ForgotPasswordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showServerError: false,
      showSuccessMessage: false,
    };
  }

  handleSendClick = (email) => {
    sendForgotPasswordEmail(email)
      .then((response) => {
        if (response.status !== 200) {
          this.setState({ showServerError: true });
        } else {
          this.setState({ showSuccessMessage: true });
        }
      })
      .catch(() => {
        this.setState({ showServerError: true });
      });
  };

  render() {
    const { showServerError, showSuccessMessage } = this.state;

    return (
      <>
        {showServerError && (
          <CustomSnackbar
            topCenter
            message="A server error has occurred"
            onClose={() => this.setState({ showServerError: false })}
            severity="error"
          />
        )}
        {showSuccessMessage && (
          <CustomSnackbar
            topCenter
            message="Email has been sent"
            onClose={() => this.setState({ showSuccessMessage: false })}
            severity="success"
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
            <ForgotPasswordCard onSend={this.handleSendClick} />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ForgotPasswordPage;

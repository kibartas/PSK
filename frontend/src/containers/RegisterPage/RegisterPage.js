import { Grid } from '@material-ui/core';
import React from 'react';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

class RegisterPage extends React.Component {

  // [TM]: TODO WDB-28 also delete line below
  // eslint-disable-next-line no-unused-vars 
  handleRegister = (firstName, lastName, email, password) => {
    // Call to BE
    // After successful registration reroute to confirm email
    const { history } = this.props;
    history.push('/confirm-email');
  }

  render() {
    return (
      <Grid
        container
        className="root"
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Grid item xs={10} sm={6} md={4}>
          <RegistrationForm onRegister={this.handleRegister} />
        </Grid>
      </Grid>
    );
  }
}

export default RegisterPage;

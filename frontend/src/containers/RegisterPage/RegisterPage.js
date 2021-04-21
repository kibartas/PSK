import { Grid } from '@material-ui/core';
import React from 'react';
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm';

class RegisterPage extends React.Component {
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
          <RegistrationForm />
        </Grid>
      </Grid>
    )
  }
}

export default RegisterPage;

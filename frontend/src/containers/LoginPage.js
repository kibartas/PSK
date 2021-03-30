import React from 'react';
import { Grid } from '@material-ui/core';
import LoginForm from '../components/LoginForm/LoginForm';
import sideImage from '../assets/LoginPage/side-image.svg';

class LoginPage extends React.Component {
  render() {
    return (
      <Grid
        container
        justify="space-around"
        style={{ height: '100vh' }}
        direction="row"
        alignItems="center"
      >
        <Grid item />
        <Grid item>
          <img
            src={sideImage}
            alt="Two people looking at their smart devices in front of a video screen"
          />
        </Grid>
        <Grid item>
          <LoginForm />
        </Grid>
        <Grid item />
      </Grid>
    );
  }
}

export default LoginPage;

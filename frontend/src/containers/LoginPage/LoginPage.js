import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import LoginForm from '../../components/LoginForm/LoginForm';
import { videoTimeDrawing } from '../../assets';
import './styles.css';

class LoginPage extends React.Component {
  render() {
    return (
      <Grid
        container
        className="root"
        justify="space-evenly"
        direction="row"
        alignItems="center"
      >
        <Hidden smDown>
          <Grid item>
            <img
              src={videoTimeDrawing}
              alt="Two people looking at their smart devices in front of a video screen"
            />
          </Grid>
        </Hidden>
        <Grid item xs={10} sm={6} md={3}>
          <LoginForm />
        </Grid>
      </Grid>
    );
  }
}

export default LoginPage;

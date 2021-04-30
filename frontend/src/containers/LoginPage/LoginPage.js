import React from 'react';
import { Grid, Hidden } from '@material-ui/core';
import LoginForm from '../../components/LoginForm/LoginForm';
import sideImage from '../../assets/LoginPage/side-image.svg';
import './styles.css';
import { authenticate } from '../../api/PublicAPI';

class LoginPage extends React.Component {

  handleLogin = (email, password) => {
    authenticate(email, password).then(response => console.log(response))
  }

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
              src={sideImage}
              alt="Two people looking at their smart devices in front of a video screen"
            />
          </Grid>
        </Hidden>
        <Grid item xs={10} sm={6} md={3}>
          <LoginForm
            onLogin={this.handleLogin} />
        </Grid>
      </Grid>
    );
  }
}



export default LoginPage;

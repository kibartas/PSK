import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import ConfirmEmailPage from './containers/ConfirmEmailPage';
import LibraryPage from './containers/LibraryPage';
import TrashBinPage from './containers/TrashBinPage';
import ProfilePage from './containers/ProfilePage';
import ForgotPasswordPage from './containers/ForgotPasswordPage';
import ResetPasswordPage from './containers/ResetPasswordPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      {!window.sessionStorage.getItem('token') ? (
        <Switch>
          <Route exact path="/">
            <LoginPage />
          </Route>
          <Route exact path="/forgot-password">
            <ForgotPasswordPage />
          </Route>
          <Route exact path="/reset-password">
            <ResetPasswordPage />
            <Route exact path="/confirm-email">
              <ConfirmEmailPage />
            </Route>
          </Route>
          <Route exact path="/register">
            <RegisterPage />
          </Route>
          <Route path="*">
            <Redirect to="/">
              <LoginPage />
            </Redirect>
          </Route>
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/bin">
            <TrashBinPage />
          </Route>
          <Route exact path="/profile">
            <ProfilePage />
          </Route>
          <Route exact path="/library">
            <LibraryPage />
          </Route>
          <Route path="*">
            <Redirect to="/library">
              <LibraryPage />
            </Redirect>
          </Route>
        </Switch>
      )}
    </Router>
  );
}

export default App;

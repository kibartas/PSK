import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import LibraryPage from './containers/LibraryPage';
import TrashBinPage from './containers/TrashBinPage';
import ProfilePage from './containers/ProfilePage';
import ForgotPasswordPage from './containers/ForgotPasswordPage';
import ResetPasswordPage from './containers/ResetPasswordPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LibraryPage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/bin">
          <TrashBinPage />
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route exact path="/forgot-password">
          <ForgotPasswordPage />
        </Route>
        <Route exact path="/reset-password">
          <ResetPasswordPage />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import {
  Button,
  CardContent,
  IconButton,
  InputAdornment,
  Grid,
  Paper,
  TextField,
  Typography,
  Avatar,
} from '@material-ui/core';
import { visibilityIcon, visibilityOffIcon } from '../../assets';
import { EMAIL_REGEX, PASSWORD_REGEX, SUNFLOWER } from '../../constants';

export default function ChangeProfileForm({
  firstName,
  lastName,
  mail,
  onSaveChanges,
}) {
  const [email, setEmail] = useState(mail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState({
    errorEmail: false,
    errorPassword: false,
    errorConfirmPassword: false,
  });

  const handleSaveChanges = (event) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setShowError({ ...showError, errorEmail: true });
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setShowError({ ...showError, errorPassword: true });
      return;
    }
    if (confirmPassword !== password) {
      setShowError({ ...showError, errorConfirmPassword: true });
      return;
    }
    onSaveChanges(email, password);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowError({ ...showError, errorEmail: false });
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setShowError({ ...showError, errorPassword: false });
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setShowError({ ...showError, errorConfirmPassword: false });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <Paper elevation={3}>
      <CardContent>
        <Grid item xs={12}>
          <Grid container spacing={3} justify="flex-start" alignItems="center">
            <Grid item>
              <Avatar style={{ backgroundColor: SUNFLOWER }}>
                {firstName[0] + lastName[0]}
              </Avatar>
            </Grid>
            <Grid item>
              <Typography variant="h6">{`${firstName} ${lastName}`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <form noValidate onSubmit={handleSaveChanges}>
          <Grid item xs={12}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12}>
                <TextField
                  required
                  value={email}
                  error={showError.errorEmail}
                  helperText={
                    showError.errorEmail ? 'Please enter a valid email' : ''
                  }
                  type="email"
                  id="email-field"
                  label="Email Address"
                  placeholder="email@domain.com"
                  variant="outlined"
                  fullWidth
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={showError.errorPassword}
                  helperText={
                    showError.errorPassword
                      ? 'Password must have at least 8 symbols with at least one capital letter and at least one number'
                      : ''
                  }
                  type={showPassword ? 'text' : 'password'}
                  id="password-field"
                  label="Password"
                  placeholder="**********"
                  variant="outlined"
                  fullWidth
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword}>
                          {showPassword ? (
                            <img
                              src={visibilityOffIcon}
                              alt="Password visibility icon"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <img
                              src={visibilityIcon}
                              alt="Password visibility off icon"
                              width={24}
                              height={24}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  className="form__last-text-field"
                  required
                  error={showError.errorConfirmPassword}
                  helperText={
                    showError.errorConfirmPassword
                      ? 'Passwords do not match'
                      : ''
                  }
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password-field"
                  label="Confirm Password"
                  placeholder="**********"
                  variant="outlined"
                  fullWidth
                  onChange={handleConfirmPasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowConfirmPassword}>
                          {showConfirmPassword ? (
                            <img
                              src={visibilityOffIcon}
                              alt="Password visibility icon"
                              width={24}
                              height={24}
                            />
                          ) : (
                            <img
                              src={visibilityIcon}
                              alt="Password visibility off icon"
                              width={24}
                              height={24}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" justify="flex-end" spacing={3}>
              <Grid item>
                <Button type="submit" variant="contained" color="primary">
                  Save changes
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  );
}

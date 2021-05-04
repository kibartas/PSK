import React, { useState } from 'react';
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { PASSWORD_REGEX } from '../../constants';
import {
  forgotPasswordDrawing,
  visibilityIcon,
  visibilityOffIcon,
} from '../../assets';

const ResetPasswordCard = ({ onSend }) => {
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPasswordError, setShowConfirmPasswordError] = useState(
    false,
  );
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setShowPasswordError(false);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setShowPassword(false);
  };

  const handleSendClick = async () => {
    if (!PASSWORD_REGEX.test(password)) {
      setShowPasswordError(true);
      return;
    }
    if (!PASSWORD_REGEX.test(confirmPassword)) {
      setShowConfirmPasswordError(true);
      return;
    }
    onSend(password);
  };

  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={forgotPasswordDrawing}
          alt="Illustration of a lock with a key inside"
        />
        <Typography variant="h4" gutterBottom>
          Reset password
        </Typography>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12}>
            <Typography>Enter a new password for your account</Typography>
          </Grid>
          <Grid
            item
            container
            spacing={1}
            direction="column"
            alignItems="center"
          >
            <Grid item xs={12}>
              <TextField
                value="F"
                required
                error={showPasswordError}
                helperText={
                  showPasswordError
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
                value={confirmPassword}
                required
                error={showConfirmPasswordError}
                helperText={
                  showConfirmPasswordError
                    ? 'Password must have at least 8 symbols with at least one capital letter and at least one number'
                    : ''
                }
                type={showConfirmPassword ? 'text' : 'password'}
                id="password-field"
                label="Confirm password"
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
          <Grid item container direction="row" justify="center" spacing={2}>
            <Grid item xs={4}>
              <Button
                onClick={handleSendClick}
                fullWidth
                variant="contained"
                color="primary"
              >
                Send
              </Button>
            </Grid>
            <Grid xs={4} item>
              <Button variant="outlined" fullWidth href="/login">
                Back to login
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default ResetPasswordCard;

import React, { useState } from 'react';
import {
  Button,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { forgotPasswordDrawing } from '../../assets';
import { EMAIL_REGEX } from '../../constants';

const ForgotPasswordCard = ({ onSend }) => {
  const [showEmailError, setShowEmailError] = useState(false);
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setShowEmailError(false);
  };

  const handleSendClick = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setShowEmailError(true);
      return;
    }
    onSend(email);
  };

  return (
    <Paper elevation={3}>
      <CardContent direction="column" align="center" justify="center">
        <img
          src={forgotPasswordDrawing}
          alt="Illustration of a lock with a key inside"
        />
        <Typography variant="h4" gutterBottom>
          Forgot password
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography>
                Enter an email address and we will send you a reset password
                link
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} justify="center">
            <Grid item xs={10}>
              <TextField
                required
                value={email}
                error={showEmailError}
                helperText={showEmailError ? 'Please enter a valid email' : ''}
                type="email"
                id="email-field"
                label="Email Address"
                placeholder="email@domain.com"
                variant="outlined"
                fullWidth
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid
              direction="row"
              wrap="nowrap"
              item
              container
              spacing={2}
              justify="center"
            >
              <Grid xs={5} item>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleSendClick}
                >
                  Send
                </Button>
              </Grid>
              <Grid xs={5} item>
                <Button variant="outlined" fullWidth href="/login">
                  Back to login
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Paper>
  );
};

export default ForgotPasswordCard;

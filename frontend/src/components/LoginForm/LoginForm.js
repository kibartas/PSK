import { Box, Button, Card, CardContent, Grid, Link, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import productIcon from "../../assets/generic/product-icon.svg"

export default function LoginForm(props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleOnLogin = () => {
    props.onLogin(email, password)
  }

  return (
    <Card>
      <CardContent
        align="center"
        direction="column"
        justify="center"
        fullWidth
      >
        <img
          src={productIcon}
          alt="Video library logo"
          width={50}
          height={50}
        />
        <Typography
          gutterBottom
          variant="h4"
        >
          Login
        </Typography>
        <Box pb={2}>
          <TextField
            required
            type="email"
            id="email-field"
            label="Email Address"
            placeholder="email@domain.com"
            variant="outlined"
            fullWidth
            onChange={setEmail}
          />
        </Box>
        <Box pb={1}>
          <TextField
            required
            type="password"
            id="password-field"
            label="Password"
            placeholder="**********"
            variant="outlined"
            onChange={setPassword}
          />
        </Box>
        <Box display="flex">
          <Typography gutterBottom>
            <Link href="/forgot-password" variant="body2">
              Forgot your password?
            </Link>
          </Typography>
        </Box>
        <Box display="flex">
          {/* TODO WDB-16 */}
          {/* TODO Add UI elements for remember me */}
        </Box>
        <Grid container>
          <Box width="50%" pr={1}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleOnLogin}
            >
              Login
            </Button>
          </Box>
          <Box width="50%" pl={1}>
            <Button variant="outlined" fullWidth href="/register">
              Register
            </Button>
          </Box>
        </Grid>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { 
  Button,
  CardContent,
  Checkbox,
  IconButton,
  InputAdornment,
  Grid,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import visibilityIcon from '../../assets/generic/visibility.svg';
import visibilityOffIcon from '../../assets/generic/visibility-off.svg';
import productIcon from "../../assets/generic/product-icon.svg"
import { emailRegex, passwordRegex } from "../../constants/regex"

export default function LoginForm(props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showError, setShowError] = useState({ errorEmail: false, errorPassword: false })

  const handleLogin = (event) => {
    event.preventDefault()
    if (!emailRegex.test(email)) {
      setShowError({ ...showError, errorEmail: true })
      return
    }
    if (!passwordRegex.test(password)) {
      setShowError({ ...showError, errorPassword: true })
      return
    }
    // [TM]: TODO WDB-13
    props.onLogin(email, password)
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    setShowError({ ...showError, errorEmail: false })
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setShowError({ ...showError, errorPassword: false })
  }

  const handleRememberMeCheck = (event) => {
    // [TM]: TODO WDB-16
    setRememberMe(event.target.checked)
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleMouseDownPassword = (event) => event.preventDefault()

  return (
    <Paper elevation={3}>
      <CardContent
        direction="column"
        align="center"
        justify="center"
      >
        <img
          src={productIcon}
          alt="Video library logo"
          width={50}
          height={50}
        />
        <Typography gutterBottom variant="h4">Login</Typography>
        <form noValidate onSubmit={handleLogin}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                error={showError.errorEmail}
                helperText={showError.errorEmail ? "Please enter a valid email" : ""}
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
                helperText={showError.errorPassword ? "Password must have at least 8 symbols with at least one capital letter and at least one number" : ""}
                type={showPassword ? "text" : "password"}
                id="password-field"
                label="Password"
                placeholder="**********"
                variant="outlined"
                fullWidth
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {
                            showPassword ? 
                              <img src={visibilityOffIcon} alt="Password visibility icon" width={24} height={24} />
                              : <img src={visibilityIcon} alt="Password visibility off icon" width={24} height={24} />
                          }
                        </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography align="left">
                <Link href="/forgot-password" variant="body2">
                  Forgot your password?
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} align="left">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeCheck}
                    name="remember-me-checkbox"
                    color="primary"
                  />
                }
                label="Remember me"
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant="outlined" fullWidth href="/register">
                Register
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Paper>
  )
}
import React from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography, Grid } from '@material-ui/core';
import menuIcon from '../../assets/generic/menu.svg';
import productIcon from '../../assets/generic/product-icon.svg';

export default function TopBar(props) {
  const { title } = props

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          direction="row"
          alignItems="center"
        >
          <Grid item>
            <IconButton edge="start">
              <img src={menuIcon} alt="Menu icon" width={24} height={24} />
            </IconButton>
          </Grid>
          <Grid item>
            <IconButton edge="start">
              <img src={productIcon} alt="Product icon" width={36} height={36} />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Typography variant="h6">
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained">Logout</Button>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

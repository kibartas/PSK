import React from 'react';
import {
  AppBar,
  Button,
  Toolbar,
  IconButton,
  Typography,
  Grid,
  Avatar,
  Hidden,
} from '@material-ui/core';
import { ArrowBackIcon, MenuIcon, productIcon } from '../../assets';
import { GRAY_1, GRAY_5, GRAY_6, SUNFLOWER } from '../../constants';

export default function TopBar({
  darkMode,
  showArrow,
  onActionIconClick, // For arrow back or navigation drawer icons
  title,
  iconsToShow = [], // Array of Icon Components(like in DownloadIcon.js). These icons will be shown on right side of TopBar
  onIconsClick = [], // Array of on click callbacks for each icon in iconsToShow. NOTE: order of callbacks must match order of icons
  showAvatarAndLogout,
  firstName,
  lastName,
}) {
  const backgroundColor = darkMode ? GRAY_1 : GRAY_6;
  const iconFillColor = darkMode ? GRAY_5 : GRAY_1;
  const fontColor = darkMode ? GRAY_5 : GRAY_1;

  const onLogout = () => {
    /* [TM:] TODO WDB-17 */
  };

  const renderIcons = () => {
    const iconItems = iconsToShow.map((Icon, index) =>
      <Grid item key={index.toString()}>
        <IconButton onClick={onIconsClick[index]} edge="end">
          <Icon fill={iconFillColor} />
        </IconButton>
      </Grid>
    );

    return (
      <Grid container alignItems="center" spacing={1}>
        {iconItems}
      </Grid>
    );
  };

  return (
    <AppBar
      style={{ background: backgroundColor }}
      position="fixed"
      elevation={1}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <IconButton edge="start" onClick={onActionIconClick}>
              {showArrow ? (
                <ArrowBackIcon fill={iconFillColor} />
              ) : (
                <MenuIcon fill={iconFillColor} />
              )}
            </IconButton>
          </Grid>
          {!showArrow && (
            <Grid item>
              <IconButton edge="start" href="/library">
                <img
                  src={productIcon}
                  alt="Product icon"
                  width={36}
                  height={36}
                />
              </IconButton>
            </Grid>
          )}
          <Grid item xs>
            <Hidden xsDown>
              <Typography style={{ color: fontColor }} variant="h6">
                {title}
              </Typography>
            </Hidden>
          </Grid>
          <Grid item>{renderIcons()}</Grid>
          {showAvatarAndLogout && (
            <Grid item>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <IconButton edge="end" href="/profile">
                    <Avatar style={{ backgroundColor: SUNFLOWER }}>
                      {firstName[0] + lastName[0]}
                    </Avatar>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={onLogout}>
                    Logout
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
}

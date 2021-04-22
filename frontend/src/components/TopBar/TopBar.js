import React from 'react';
import { AppBar, Button, Toolbar, IconButton, Typography, Grid, Avatar, Hidden } from '@material-ui/core';
import {
  uploadIcon,
  selectAllIcon,
  restoreIcon,
  deleteForeverIcon,
  productIcon
} from '../../assets/index';
import { ReactComponent as MenuIcon } from '../../assets/generic/menu.svg';
import { ReactComponent as ArrowBackIcon } from '../../assets/generic/arrow-back.svg';
import { ReactComponent as DownloadIcon } from '../../assets/generic/download.svg';
import { ReactComponent as DeleteIcon } from '../../assets/generic/delete.svg';
import { ReactComponent as InfoIcon } from '../../assets/generic/info.svg';
import { GRAY_1, GRAY_5 } from '../../constants/index';
import './styles.css';

export default function TopBar({ title, videoOpened, videoSelected, firstName, lastName, showIcons }) {
  const selectedState = videoOpened || videoSelected
  const iconFillColor = videoOpened ? GRAY_5 : GRAY_1

  const renderIcons = () => {
    const { 
      upload,
      download,
      moveToBin,
      information,
      selectAll,
      restore,
      deleteForever 
    } = showIcons
  
    return (
      <Grid
        container
        alignItems="center"
        spacing={1}
      >
        {
          upload &&
            <Grid item>
              <IconButton edge="end">
                <img src={uploadIcon} alt="Upload icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          download &&
            <Grid item>
              <IconButton edge="end">
                <DownloadIcon fill={iconFillColor} alt="Download icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          moveToBin &&
            <Grid item>
              <IconButton edge="end">
                <DeleteIcon fill={iconFillColor} alt="Move to bin icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          information &&
            <Grid item>
              <IconButton edge="end">
                <InfoIcon fill={GRAY_5} alt="Information icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          selectAll &&
            <Grid item>
              <IconButton edge="end">
                <img src={selectAllIcon} alt="Select all icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          restore &&
            <Grid item>
              <IconButton edge="end">
                <img src={restoreIcon} alt="Restore video icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
        {
          deleteForever &&
            <Grid item>
              <IconButton edge="end">
                <img src={deleteForeverIcon} alt="Delete forever icon" width={24} height={24} />
              </IconButton>
            </Grid>
        }
      </Grid>
    )
  }

  return (
    <AppBar className={videoOpened ? "topBar--video-opened" : "topBar"} position="fixed">
      <Toolbar>
        <Grid
          container
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <IconButton edge="start">
              {
                selectedState ?
                  <ArrowBackIcon fill={iconFillColor} alt="Arrow back icon" width={24} height={24}/>
                  :
                  <MenuIcon fill={iconFillColor} alt="Menu icon" width={24} height={24} />
              }
            </IconButton>
          </Grid>
          {
            selectedState ||
              <Grid item>
                <IconButton edge="start">
                  <img src={productIcon} alt="Product icon" width={36} height={36} />
                </IconButton>
              </Grid>
          }
          <Grid item xs>
            <Hidden xsDown>
              <Typography className={videoOpened ? "topBar--video-opened__title" : "topBar__title"} variant="h6">
                {title}
              </Typography>
            </Hidden>
          </Grid>
          <Grid item>
            {renderIcons()}
          </Grid>
          {
            selectedState ||
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <IconButton edge="end">
                      <Avatar className="topBar__avatar" alt="User's avatar">{firstName[0] + lastName[0]}</Avatar>
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">Logout</Button>
                  </Grid>
                </Grid>
              </Grid>
          }
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

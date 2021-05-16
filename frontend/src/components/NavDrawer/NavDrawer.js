import React, { useState, useRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Typography } from '@material-ui/core';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import DeleteIcon from '@material-ui/icons/Delete';
import './styles.css';
import { formatBytesToString } from '../../util';

export default function NavDrawer({
  open,
  onOpen,
  onClose,
  spaceTaken
}) {

  const tabs = useRef(new Map([
   ["Videos", { icon: <VideoLibraryIcon />, href: '/library' }],
   ["Recycling Bin", { icon: <DeleteIcon />, href: '/bin' }] 
  ]));

  const getSelectedTabKey = () => {
    let selected = null;
    tabs.current.forEach((value, key) => {
      if (window.location.href.includes(value.href)) {
        selected = key;
      }
    })
    return selected;
  };

  const [selectedTabKey, setSelectedTabKey] = useState(getSelectedTabKey());

  const handleTabClick = (key) => () => {
    setSelectedTabKey(key);
    window.location.href = tabs.current.get(key).href;
  };

  const renderTabListItems = () => {
    const listItems = [];
    tabs.current.forEach((value, key) => {
      listItems.push(
        <ListItem
          button
          key={key.toString()}
          onClick={handleTabClick(key)}
          selected={selectedTabKey === key}
        >
          <ListItemIcon>
            {value.icon}
          </ListItemIcon>
          <ListItemText primary={key} />
        </ListItem>
    )});

    return listItems;
  };

  const renderSpaceTakenListItem = () => (
    <ListItem key="SpaceTakenLabel" className="navDrawer__spaceTakenItem">
      <Typography className="navDrawer__spaceTakenLabel">
        {`Total space taken: ${formatBytesToString(spaceTaken)}`}
      </Typography>
    </ListItem>
  );

  return(
    <SwipeableDrawer
      anchor='left'
      open={open}
      onOpen={onOpen}
      onClose={onClose}
    >
      <List className='navDrawer'>
        {renderTabListItems()}
        {renderSpaceTakenListItem()}
      </List>
    </SwipeableDrawer>
  );
}

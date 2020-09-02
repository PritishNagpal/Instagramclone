import React,{ useContext } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link, useHistory } from 'react-router-dom';

import { userContext } from '../App';

const ITEM_HEIGHT = 48;

export default function LongMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const history = useHistory();
  const {state,dispatch} = useContext(userContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
          <MenuItem  onClick={handleClose}>
            <Link  to='/profile'> Profile </Link>
          </MenuItem>
          <MenuItem  onClick={handleClose}>
           <Link   to='/create'>Create Post </Link>
          </MenuItem>
          <MenuItem   onClick={handleClose}>
           <Link  to='/followerpost'>Follower Posts </Link>
          </MenuItem>
          <MenuItem   onClick={() => {
              handleClose()
                localStorage.clear();
                dispatch({'type': 'CLEAR'});
                history.push('/signin')
              }}>
           <Link  to='/profile'>Sign Out</Link>
          </MenuItem>
      </Menu>
    </div>
  );
}
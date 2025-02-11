'use client';
import React, { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import NavigationList from './NavigationList';

function Navbar() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setOpenDrawer(open);
    };

  return (
    <Box id='navbar'>
      <AppBar position='fixed'>
        <Toolbar sx={{ width: '100%' }}>
          <IconButton
            onClick={toggleDrawer(true)}
            edge='start'
            color='inherit'
            aria-label='menu'
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor={'left'}
            open={openDrawer}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <NavigationList toggleDrawer={toggleDrawer} />
          </SwipeableDrawer>

          <Link
            href='/'
            sx={{
              //  flexGrow: 1,
              color: '#fff',
            }}
          >
            Калькуляция{' '}
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;

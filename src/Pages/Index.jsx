import React from 'react';
import { Box } from '@mui/material';
import Header from '../Components/Drawer/Header';
import { Outlet } from 'react-router-dom';
import DrawerProvider from '../Context/DrawerProvider';

function Index() {
  return (
    <Box>
      <DrawerProvider>
        <Header />
        <Box sx={{ position: 'relative' }}>
          <Outlet />
        </Box>
      </DrawerProvider>
    </Box>
  );
}

export default Index;

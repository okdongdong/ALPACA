import React from 'react';
import { AppBar, Toolbar, styled } from '@mui/material';

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.main,
}));

function NavBar() {
  return (
    <AppBar position="static">
      <CustomToolbar>dd</CustomToolbar>
    </AppBar>
  );
}

export default NavBar;

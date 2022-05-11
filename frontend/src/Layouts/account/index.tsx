import React from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { BrowserView, MobileView } from 'react-device-detect';
const RootStyle = styled('div')({
  height: '100%',
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

function AccountLayout() {
  return (
    <>
      <BrowserView style={{ width: '100%', height: '100%' }}>
        <RootStyle>
          <Outlet />
        </RootStyle>
      </BrowserView>
      <MobileView>
        <Outlet />
      </MobileView>
    </>
  );
}

export default AccountLayout;

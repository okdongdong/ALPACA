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
      <BrowserView>
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

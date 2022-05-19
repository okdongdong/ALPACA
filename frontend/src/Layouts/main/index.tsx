import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import SideBar from '../../Components/Bars/SideBar';
import NavBar from '../../Components/Bars/NavBar';
import { BrowserView, MobileView } from 'react-device-detect';

const APP_BAR_DESKTOP = 15;
const APP_BAR_MOBILE = 56;
const RootStyle = styled('div')({
  height: '100%',
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
});

const MainStyle = styled('div')(({ theme }) => ({
  minHeight: '50%',
  height: '100%',
  width: '100%',
  padding: APP_BAR_DESKTOP,
}));

const MainDiv = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  background: theme.palette.bg,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const MMainDiv = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  background: theme.palette.bg,
  paddingTop: APP_BAR_MOBILE + 4,
}));

function MainLayout() {
  const { pathname } = useLocation();
  return (
    <>
      <BrowserView style={{ width: '100%', height: '100%' }}>
        <RootStyle>
          {pathname === '/404' ? null : <SideBar />}
          <MainStyle>
            <MainDiv className="scroll-box">
              <Outlet />
            </MainDiv>
          </MainStyle>
        </RootStyle>
      </BrowserView>
      <MobileView style={{ width: '100%', height: '100%' }}>
        {pathname === '/404' ? null : <NavBar />}
        <MMainDiv className="scroll-box">
          <Outlet />
        </MMainDiv>
      </MobileView>
    </>
  );
}

export default MainLayout;

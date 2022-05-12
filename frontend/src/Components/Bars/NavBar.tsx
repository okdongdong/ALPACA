import React, { useState } from 'react';
import {
  Button,
  AppBar,
  Toolbar,
  styled,
  IconButton,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@mui/material';
import Logo_White from '../../Assets/Img/Logo_White.png';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  Home,
  Logout,
  Assignment,
  Notifications,
  Settings,
  Person,
} from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../../Hooks/useLogout';

type iconObjType = {
  [index: string]: { icon: React.ReactNode; onClick: Function; text: string };
};

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.main,
  position: 'relative',
}));

const CustomDrawer = styled(Drawer)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiDrawer-paper': {
    background: theme.palette.main,
    color: theme.palette.icon,
  },
}));

function NavBar() {
  const theme = useTheme();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const myTheme = useSelector((state: any) => state.theme.themeType);
  const logout = useLogout();

  const [leftOpen, setLeftOpen] = useState<boolean>(false);
  const [rightOpen, setRightOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<'left' | 'right'>('right');

  const clickHome = () => {
    if (params.roomId !== undefined) {
      navigate(`room/${params.roomId}`);
    }
  };
  const clickProblem = () => {
    if (params.roomId !== undefined) {
      navigate(`room/${params.roomId}/problem-manage`);
    }
  };
  const clickLogout = () => {
    logout();
  };
  const clickNotification = () => {};
  const clickSettings = () => {};

  const handleLeftOpen = () => {
    setLeftOpen(true);
    setRightOpen(false);
    setAnchor('left');
  };

  const handleRightOpen = () => {
    setRightOpen(true);
    setLeftOpen(false);
    setAnchor('right');
  };

  const handleClose = () => {
    setLeftOpen(false);
    setRightOpen(false);
  };

  const icon: iconObjType = {
    Home: { icon: <Home />, onClick: clickHome, text: '홈' },
    Problem: { icon: <Assignment />, onClick: clickProblem, text: '문제조회' },
    Logout: { icon: <Logout />, onClick: clickLogout, text: '로그아웃' },
    Noti: { icon: <Notifications />, onClick: clickNotification, text: '알림' },
    Settings: { icon: <Settings />, onClick: clickSettings, text: '설정' },
  };

  const iconList =
    pathname.indexOf('room') === -1
      ? ['Logout', 'Noti']
      : ['Home', 'Problem', 'Logout', 'Noti', 'Settings'];
  const drawer = {
    left: <>left</>,
    right: (
      <List>
        {iconList.map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={() => {
              icon[text].onClick();
            }}>
            <ListItemIcon sx={{ color: theme.palette.icon }}>{icon[text].icon}</ListItemIcon>
            <ListItemText primary={icon[text].text} />
          </ListItem>
        ))}
      </List>
    ),
  };

  return (
    <>
      <AppBar>
        <CustomToolbar>
          {pathname.indexOf('room') !== -1 && (
            <IconButton
              style={{
                position: 'absolute',
                left: '1vw',
                top: '50%',
                transform: 'translate(0, -50%)',
              }}
              onClick={() => {
                handleLeftOpen();
              }}>
              <Person sx={{ color: theme.palette.icon }} />
            </IconButton>
          )}
          <Button
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
            <img style={{ height: 30 }} src={Logo_White} alt="" />
          </Button>
          <IconButton
            style={{
              position: 'absolute',
              right: '1vw',
              top: '50%',
              transform: 'translate(0, -50%)',
            }}
            onClick={() => {
              handleRightOpen();
            }}>
            <Menu sx={{ color: theme.palette.icon }} />
          </IconButton>
        </CustomToolbar>
      </AppBar>
      <CustomDrawer anchor={anchor} open={rightOpen || leftOpen} onClose={handleClose}>
        {drawer[anchor]}
      </CustomDrawer>
    </>
  );
}

export default NavBar;

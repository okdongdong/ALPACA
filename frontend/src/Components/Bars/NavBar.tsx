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
  Box,
  Badge,
} from '@mui/material';
import Logo_White from '../../Assets/Img/Logo_White.png';
import { useSelector, useDispatch } from 'react-redux';
import { settingOn } from '../../Redux/roomReducer';
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
import RoomMainIntroduction from '../Room/Main/RoomMainIntroduction';
import MemberInvite from '../Dialogs/MemberInvite';
import NotificationDialog from '../Dialogs/NotificationDialog';

type iconObjType = {
  [index: string]: { icon: React.ReactNode; onClick: Function; text: string };
};

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
  background: theme.palette.main,
  position: 'relative',
}));

const CustomBadge = styled(Badge)(({ theme }) => ({
  color: theme.palette.icon,
  '& .MuiBadge-badge': {
    background: theme.palette.component_accent,
  },
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

const MBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  width: '190px',
  marginTop: '2vh',
  marginLeft: '5px',
  marginRight: '5px',
}));
const MBtn = styled(Button)(({ theme }) => ({
  background: theme.palette.component,
  color: theme.palette.txt,
  marginTop: '24px',
}));

function NavBar() {
  const theme = useTheme();
  const params = useParams();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const myTheme = useSelector((state: any) => state.theme.themeType);
  const logout = useLogout();

  const [newNotiCount, setNewNotiCount] = useState<number>(0);
  const [notiAnchorEl, setNotiAnchorEl] = useState<HTMLElement | null>(null);
  const [leftOpen, setLeftOpen] = useState<boolean>(false);
  const [rightOpen, setRightOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<'left' | 'right'>('right');

  const [open, setOpen] = useState<boolean>(false);

  const clickHome = () => {
    if (params.roomId !== undefined) {
      navigate(`room/${params.roomId}`);
    }
    setRightOpen(false);
  };
  const clickProblem = () => {
    if (params.roomId !== undefined) {
      navigate(`room/${params.roomId}/problem-manage`);
    }
    setRightOpen(false);
  };

  const clickLogout = () => {
    setRightOpen(false);
    logout();
  };
  const clickNotification = (event: React.MouseEvent<HTMLElement>) => {
    setNewNotiCount(0);
    setNotiAnchorEl(event.currentTarget);
  };

  const clickSettings = () => {
    dispatch(settingOn());
  };

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
    Home: { icon: <Home />, onClick: clickHome, text: '스터디 홈' },
    Problem: { icon: <Assignment />, onClick: clickProblem, text: '문제조회' },
    Logout: { icon: <Logout />, onClick: clickLogout, text: '로그아웃' },
    Settings: { icon: <Settings />, onClick: clickSettings, text: '설정' },
  };

  const iconList =
    pathname.indexOf('room') === -1 ? ['Logout'] : ['Home', 'Problem', 'Logout', 'Settings'];
  const drawer = {
    left: (
      <MBox>
        <RoomMainIntroduction />
      </MBox>
    ),
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
            }}
            onClick={() => {
              navigate('/');
            }}>
            <img style={{ height: 30 }} src={Logo_White} alt="" />
          </Button>
          <div
            style={{
              position: 'absolute',
              right: '1vw',
              top: '50%',
              transform: 'translate(0, -50%)',
            }}>
            <IconButton
              onClick={(event) => {
                clickNotification(event);
              }}>
              <CustomBadge badgeContent={newNotiCount} max={99}>
                <Notifications sx={{ color: theme.palette.icon }} />
              </CustomBadge>
            </IconButton>
            <IconButton
              onClick={() => {
                handleRightOpen();
              }}>
              <Menu sx={{ color: theme.palette.icon }} />
            </IconButton>
          </div>
        </CustomToolbar>
      </AppBar>
      <CustomDrawer anchor={anchor} open={rightOpen || leftOpen} onClose={handleClose}>
        {drawer[anchor]}
      </CustomDrawer>
      <NotificationDialog
        setNewNotiCount={setNewNotiCount}
        anchorEl={notiAnchorEl}
        setAnchorEl={setNotiAnchorEl}
      />
    </>
  );
}

export default NavBar;

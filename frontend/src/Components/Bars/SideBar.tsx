import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, List, ListItemButton, ListItemIcon, Button, Badge } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import Logo_White from '../../Assets/Img/Logo_White.png';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { settingOn } from '../../Redux/roomReducer';
import styles from './SideBar.module.css';

import { Home, Logout, Assignment, Notifications, Settings } from '@mui/icons-material';
import useLogout from '../../Hooks/useLogout';
import NotificationDialog from '../Dialogs/NotificationDialog';

type iconObjType = {
  [index: string]: { icon: React.ReactNode; onClick: Function };
};

const CustomBadge = styled(Badge)(({ theme }) => ({
  color: theme.palette.icon,
  '& .MuiBadge-badge': {
    background: theme.palette.component_accent,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 90,
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const CustomDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: 90,
    height: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '& .MuiDrawer-paper': {
      background: theme.palette.bg,
    },
  }),
);

function SideBar() {
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const logout = useLogout();

  const userTheme = useSelector((state: any) => state.theme.themeType);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [newNotiCount, setNewNotiCount] = useState<number>(0);

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
  const clickNotification = (event: React.MouseEvent<HTMLElement>) => {
    setNewNotiCount(0);
    setAnchorEl(event.currentTarget);
  };

  const icon: iconObjType = {
    Home: { icon: <Home />, onClick: clickHome },
    Problem: { icon: <Assignment />, onClick: clickProblem },
    Logout: { icon: <Logout />, onClick: clickLogout },
    Noti: { icon: <Notifications />, onClick: clickNotification },
  };

  const iconList =
    pathname.indexOf('room') === -1 ? ['Logout', 'Noti'] : ['Home', 'Problem', 'Logout', 'Noti'];
  return (
    <CustomDrawer variant="permanent">
      <DrawerHeader>
        <Button>
          <img
            src={userTheme === 'dark' ? Logo_White : Logo}
            className={styles.logo}
            alt=""
            onClick={() => {
              navigate('/');
            }}
          />
        </Button>
      </DrawerHeader>
      <List
        sx={{
          height: '100%',
        }}>
        <span>
          {iconList.map((text, index) => (
            <ListItemButton
              onClick={(event) => {
                icon[text].onClick(event);
              }}
              key={text}
              sx={{
                minHeight: 48,
                justifyContent: 'center',
                alignItems: 'center',
                mx: 'auto',
                my: '10px',
                px: 2.5,
                borderRadius: '100px',
                background: theme.palette.main,
                height: '50px',
                width: '50px',
                '&:hover': {
                  background: theme.palette.main + '90',
                },
              }}>
              {text === 'Noti' ? (
                <CustomBadge badgeContent={newNotiCount} max={99}>
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: 'center',
                      color: theme.palette.icon,
                    }}>
                    {icon[text].icon}
                  </ListItemIcon>
                </CustomBadge>
              ) : (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    color: theme.palette.icon,
                  }}>
                  {icon[text].icon}
                </ListItemIcon>
              )}
            </ListItemButton>
          ))}
        </span>
      </List>
      <span>
        {pathname.indexOf('room') !== -1 && (
          <ListItemButton
            onClick={() => {}}
            key="settings"
            sx={{
              minHeight: 48,
              justifyContent: 'center',
              alignItems: 'center',
              mx: 'auto',
              mt: 'auto',
              mb: '30px',
              px: 2.5,
              borderRadius: '100px',
              background: theme.palette.main,
              height: '50px',
              width: '50px',
              '&:hover': {
                background: theme.palette.main + '90',
              },
            }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: theme.palette.icon,
              }}
              onClick={() => dispatch(settingOn())}>
              <Settings />
            </ListItemIcon>
          </ListItemButton>
        )}
      </span>
      <NotificationDialog
        setNewNotiCount={setNewNotiCount}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </CustomDrawer>
  );
}
export default SideBar;

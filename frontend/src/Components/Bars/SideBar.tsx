import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, List, ListItemButton, ListItemIcon } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../Redux/accountReducer';
import styles from './SideBar.module.css';
import SideBarBtn from './SideBarBtn';

import { Home, Logout, Assignment, Notifications } from '@mui/icons-material';

type iconObjType = {
  [index: string]: { icon: React.ReactNode; onClick: Function };
};

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const clickHome = () => {
    navigate('/');
  };
  const clickProblem = () => {
    navigate('problem-manage');
  };
  const clickLogout = () => {
    dispatch(logout());
  };
  const clickNotification = () => {};

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
        <img src={Logo} className={styles.logo} alt="" />
      </DrawerHeader>
      <List>
        {iconList.map((text, index) => (
          <ListItemButton
            onClick={() => {
              icon[text].onClick();
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
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: 'center',
                color: theme.palette.icon,
              }}>
              {icon[text].icon}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </CustomDrawer>
  );
}
export default SideBar;

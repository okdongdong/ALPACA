import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Drawer, List, ListItemButton, ListItemIcon } from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import { useLocation } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarBtn from './SideBarBtn';

import { Home, Logout, Assignment, Notifications } from '@mui/icons-material';

type iconObjType = {
  [index: string]: React.ReactNode;
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
    background: theme.palette.bg,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),
);

function SideBar() {
  const location = useLocation();
  const theme = useTheme();
  const icon: iconObjType = {
    Home: <Home />,
    Problem: <Assignment />,
    Logout: <Logout />,
    Noti: <Notifications />,
  };

  const iconList =
    location.pathname.indexOf('room') === -1
      ? ['Home', 'Problem', 'Logout', 'Noti']
      : ['Logout', 'Noti'];
  return (
    <CustomDrawer variant="permanent">
      <DrawerHeader>
        <img src={Logo} className={styles.logo} alt="" />
      </DrawerHeader>
      <List>
        {iconList.map((text, index) => (
          <ListItemButton
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
              {icon[text]}
            </ListItemIcon>
          </ListItemButton>
        ))}
      </List>
    </CustomDrawer>
  );
}
export default SideBar;

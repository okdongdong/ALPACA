import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  Button,
  Badge,
  styled,
  Tooltip,
} from '@mui/material';
import Logo from '../../Assets/Img/Logo.png';
import Logo_White from '../../Assets/Img/Logo_White.png';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { settingOn } from '../../Redux/roomReducer';
import styles from './SideBar.module.css';

import { Home, Logout, Assignment, Notifications, Settings } from '@mui/icons-material';
import useLogout from '../../Hooks/useLogout';
import useAlert from '../../Hooks/useAlert';
import NotificationDialog from '../Dialogs/NotificationDialog';

type iconObjType = {
  [index: string]: { icon: React.ReactNode; onClick: Function; tooltip: string };
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

const CListItemBtn = styled(ListItemButton)(({ theme }) => ({
  minHeight: 48,
  justifyContent: 'center',
  alignItems: 'center',
  margin: '10px auto 10px auto',
  px: 2.5,
  borderRadius: '100px',
  background: theme.palette.main,
  height: '50px',
  width: '50px',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const CListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 0,
  justifyContent: 'center',
  color: theme.palette.icon,
}));

function SideBar() {
  const { pathname } = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = useLogout();
  const cAlert = useAlert();

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
  const clickLogout = async () => {
    const ans = await cAlert.fire({
      title: '로그아웃 하시겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
      reverseButtons: true,
    });

    if (ans.isConfirmed) {
      logout();
    }
  };
  const clickNotification = (event: React.MouseEvent<HTMLElement>) => {
    setNewNotiCount(0);
    setAnchorEl(event.currentTarget);
  };

  const icon: iconObjType = {
    Home: { icon: <Home />, onClick: clickHome, tooltip: '스터디 홈' },
    Problem: { icon: <Assignment />, onClick: clickProblem, tooltip: '문제관리' },
    Logout: { icon: <Logout />, onClick: clickLogout, tooltip: '로그아웃' },
    Noti: { icon: <Notifications />, onClick: clickNotification, tooltip: '알림확인' },
  };

  const iconList =
    pathname.indexOf('room') === -1 ? ['Noti', 'Logout'] : ['Home', 'Problem', 'Noti', 'Logout'];
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
        <div>
          {iconList.map((text, index) => (
            <Tooltip key={text} title={icon[text].tooltip} placement="right" arrow>
              <CListItemBtn
                onClick={(event) => {
                  icon[text].onClick(event);
                }}>
                {text === 'Noti' ? (
                  <CustomBadge badgeContent={newNotiCount} max={99}>
                    <CListItemIcon>{icon[text].icon}</CListItemIcon>
                  </CustomBadge>
                ) : (
                  <CListItemIcon>{icon[text].icon}</CListItemIcon>
                )}
              </CListItemBtn>
            </Tooltip>
          ))}
        </div>
      </List>
      <div>
        {pathname.indexOf('room') !== -1 &&
          pathname.indexOf('live') === -1 &&
          pathname.indexOf('problem-manage') === -1 && (
            <CListItemBtn onClick={() => dispatch(settingOn())} key="settings">
              <CListItemIcon>
                <Settings />
              </CListItemIcon>
            </CListItemBtn>
          )}
      </div>
      <NotificationDialog
        setNewNotiCount={setNewNotiCount}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </CustomDrawer>
  );
}
export default SideBar;

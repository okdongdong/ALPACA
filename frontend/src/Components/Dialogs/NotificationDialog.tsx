import React, { useEffect, useRef, useState } from 'react';
import { Popover, styled, Paper, Divider, useTheme, Button } from '@mui/material';
import CBtn from '../Commons/CBtn';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type NotificationDialogType = {
  anchorEl: HTMLElement | null;
  setAnchorEl: Function;
};

type NotificationDataType = {
  type: 'invite' | 'schedule';
  studyId: number;
  title: string;
};

type NotificationItemType = {
  index: number;
  type: 'invite' | 'schedule';
  studyId: number;
  title: string;
  deleteNoti: Function;
};
const CustomPopover = styled(Popover)(({ theme }) => ({
  maxHeight: '50vh',
  '.MuiPopover-paper': {
    padding: '10px',
  },
}));
const NotiPaper = styled(Paper)(({ theme }) => ({
  maxWidth: '20vw',
  background: theme.palette.main,
  color: theme.palette.txt,
  margin: '10px',
  padding: '10px',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const CustomBtn = styled(Button)(({ theme }) => ({
  fontFamily: 'Pretendard-Regular',
  background: theme.palette.bg,
  color: theme.palette.txt,
  marginLeft: '5px',
  marginRight: '5px',
  borderRadius: '20px',
  '&:hover': {
    background: theme.palette.bg + '90',
  },
}));

function NotificationItem({ type, studyId, title, deleteNoti, index }: NotificationItemType) {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <NotiPaper>
      <div style={{ marginBottom: '10px' }}>
        {type === 'invite' ? (
          <>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '2px',
              }}>{`${title} 스터디에 초대되었습니다`}</div>
            <div style={{ textAlign: 'center' }}>수락하시겠습니까?</div>
          </>
        ) : (
          `${title} 스터디에 일정이 추가되었습니다.`
        )}
      </div>
      <div className="align_center">
        {type === 'invite' ? (
          <>
            <CustomBtn size="small" onClick={() => {}}>
              수락
            </CustomBtn>
            <Divider
              sx={{ border: `1px solid ${theme.palette.txt + '50'}` }}
              orientation="vertical"
              variant="middle"
              flexItem></Divider>
            <CustomBtn size="small" onClick={() => {}}>
              거절
            </CustomBtn>
          </>
        ) : (
          <CustomBtn
            size="small"
            onClick={() => {
              deleteNoti(index);
              navigate(`/room/${studyId}`);
            }}>
            이동
          </CustomBtn>
        )}
      </div>
    </NotiPaper>
  );
}

function NotificationDialog({ anchorEl, setAnchorEl }: NotificationDialogType) {
  const isLogin = useSelector((state: any) => state.account.isLogin);
  const [notificationList, setNotificationList] = useState<NotificationDataType[]>([
    { type: 'invite', title: '양명균과 아이들', studyId: 2 },
    { type: 'invite', title: '양명균과 아이들', studyId: 2 },
    { type: 'schedule', title: '양명균과 아이들', studyId: 2 },
    { type: 'invite', title: '양명균과 아이들', studyId: 2 },
    { type: 'invite', title: '양명균과 아이들', studyId: 2 },
    { type: 'schedule', title: '양명균과 아이들', studyId: 2 },
  ]);
  const [newNotiCount, setNewNotiCount] = useState<number>(0);
  const eventSource = useRef<EventSource | null>(null);

  useEffect(() => {
    if (isLogin) {
      console.log('open');
      connectNotification();
    } else {
      disconnectNotification();
    }

    return disconnectNotification();
  }, [isLogin]);

  useEffect(() => {});
  const addSchedule = (event: MessageEvent) => {
    setNotificationList((notifications) => {
      return [event.data, ...notifications];
    });
  };
  const addInviteStudy = (event: MessageEvent) => {
    setNotificationList((notifications) => {
      return [event.data, ...notifications];
    });
  };

  const closeEventsource = () => {
    if (eventSource.current) {
      eventSource.current.close();
    }
  };

  const connectNotification = () => {
    const subscribeUrl = `${process.env.REACT_APP_BASE_URL}/api/v1/sub/notice`;
    const jwtToken = localStorage.getItem('accessToken')?.split(' ')[1];
    eventSource.current = new EventSource(`${subscribeUrl}?token=${jwtToken}`);

    eventSource.current.addEventListener('addSchedule', addSchedule);
    eventSource.current.addEventListener('inviteStudy', addInviteStudy);
    eventSource.current.addEventListener('error', closeEventsource);
  };

  const disconnectNotification = () => {
    if (eventSource.current) {
      eventSource.current.removeEventListener('addSchedule', addSchedule);
      eventSource.current.removeEventListener('inviteStudy', addInviteStudy);
      eventSource.current.removeEventListener('error', closeEventsource);
    }
    eventSource.current = null;
  };
  const deleteNotification = (index: number) => {
    setNotificationList((notifications) => {
      return notifications.filter((notification, idx) => {
        console.log(index, idx);
        return idx !== index;
      });
    });
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <CustomPopover
      anchorOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}>
      {notificationList.map((noti, index) => {
        return (
          <NotificationItem
            key={`noti-${index}`}
            title={noti.title}
            type={noti.type}
            studyId={noti.studyId}
            index={index}
            deleteNoti={deleteNotification}
          />
        );
      })}
    </CustomPopover>
  );
}

export default NotificationDialog;

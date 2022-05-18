import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popover, styled, Paper, Divider, useTheme, Button, IconButton } from '@mui/material';
import { Close, ContactPageOutlined } from '@mui/icons-material';
import CBtn from '../Commons/CBtn';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

type NotificationDialogType = {
  anchorEl: HTMLElement | null;
  setAnchorEl: Function;
  setNewNotiCount: Function;
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
      <div style={{ marginBottom: '10px', padding: '0 10px 10px 10px', minWidth: '15vw' }}>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            size="small"
            onClick={() => {
              deleteNoti(index);
            }}>
            <Close />
          </IconButton>
        </div>
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

function NotificationDialog({ anchorEl, setAnchorEl, setNewNotiCount }: NotificationDialogType) {
  const [notificationList, setNotificationList] = useState<NotificationDataType[]>([]);
  const eventSource = useRef<EventSource | null>(null);

  useEffect(() => {
    connectNotification();
    return () => {
      disconnectNotification();
    };
  }, []);

  const addInitialNotification = (event: MessageEvent) => {
    console.log('addInitialNotification', event);
    if (!!!anchorEl) {
      setNewNotiCount((prev: number) => prev + 1);
    }
    const data = JSON.parse(event.data);
    setNotificationList((notifications) => {
      if (data?.scheduleStartedAt) {
        return [
          { type: 'schedule', studyId: data.studyId, title: data.studyTitle },
          ...notifications,
        ];
      }
      return [{ type: 'invite', studyId: data.studyId, title: data.studyTitle }, ...notifications];
    });
  };

  const addSchedule = (event: MessageEvent) => {
    console.log('addSchedule', event.data);
    console.log(!!!anchorEl, anchorEl);
    if (!!!anchorEl) {
      setNewNotiCount((prev: number) => prev + 1);
    }
    const data = JSON.parse(event.data);
    setNotificationList((notifications) => {
      return [
        { type: 'schedule', studyId: data.studyId, title: data.studyTitle },
        ...notifications,
      ];
    });
  };
  const addInviteStudy = (event: MessageEvent) => {
    console.log('addInviteStudy', event);
    if (!!!anchorEl) {
      setNewNotiCount((prev: number) => prev + 1);
    }
    const data = JSON.parse(event.data);
    setNotificationList((notifications) => {
      return [{ type: 'invite', studyId: data.studyId, title: data.studyTitle }, ...notifications];
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

    eventSource.current.addEventListener('initialNotification', addInitialNotification);
    eventSource.current.addEventListener('addSchedule', addSchedule);
    eventSource.current.addEventListener('inviteStudy', addInviteStudy);
    eventSource.current.addEventListener('error', closeEventsource);
  };

  const disconnectNotification = () => {
    eventSource.current?.close();
    // if (eventSource.current) {
    //   eventSource.current.removeEventListener('initialNotification', addInitialNotification);
    //   eventSource.current.removeEventListener('addSchedule', addSchedule);
    //   eventSource.current.removeEventListener('inviteStudy', addInviteStudy);
    //   eventSource.current.removeEventListener('error', closeEventsource);
    // }
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
      {notificationList.length > 0 ? (
        notificationList.map((noti, index) => {
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
        })
      ) : (
        <div>모든 알림을 확인했습니다.</div>
      )}
    </CustomPopover>
  );
}

export default NotificationDialog;

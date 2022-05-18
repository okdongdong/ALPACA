import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Popover, styled, Paper, Divider, useTheme, Button, IconButton } from '@mui/material';
import { Close, ContactPageOutlined } from '@mui/icons-material';
import CBtn from '../Commons/CBtn';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { customAxios } from '../../Lib/customAxios';
import useAlert from '../../Hooks/useAlert';

type NotificationDialogType = {
  anchorEl: HTMLElement | null;
  setAnchorEl: Function;
  setNewNotiCount: Function;
};

type NotificationDataType = {
  type: 'invite' | 'schedule';
  studyId: number;
  title: string;
  scheduleStartedAt?: string;
};

type NotificationItemType = {
  index: number;
  type: 'invite' | 'schedule';
  studyId: number;
  title: string;
  scheduleStartedAt?: string;
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

function NotificationItem({
  type,
  studyId,
  title,
  deleteNoti,
  index,
  scheduleStartedAt,
}: NotificationItemType) {
  const cAlert = useAlert();
  const navigate = useNavigate();
  const theme = useTheme();

  const joinStudy = async () => {
    deleteNoti(index);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study/${studyId}/join`,
      });
      cAlert
        .fire({
          title: '가입완료',
          text: `${title}에 가입되었습니다.\n 스터디로 이동하시겠습니까?`,
          icon: 'success',
        })
        .then((res) => {
          if (res.isConfirmed) {
            navigate(`/room/${studyId}`);
          }
        });
    } catch (e: any) {
      if (e.response.status === 400) {
        cAlert.fire({
          title: '가입 실패',
          text: '잘못된 접근입니다.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      } else if (e.response.status === 409) {
        cAlert.fire({
          title: '가입 실패',
          text: '이미 가입되어있는 스터디입니다.',
          icon: 'error',
          showCancelButton: false,
          timer: 1500,
        });
      }
    }
  };

  const rejectStudy = async () => {
    deleteNoti(index);
    try {
      const res = await customAxios({
        method: 'post',
        url: `/study/${studyId}/reject`,
      });
      cAlert.fire({
        title: '거절 완료',
        text: '스터디 초대 거절을 완료했습니다.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: any) {
      if (e.response.status === 400) {
        cAlert.fire({
          title: '거절 실패',
          text: '잘못된 접근입니다.',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

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
          <>
            <div>{`${title} 스터디에 일정이 추가되었습니다.`}</div>
            <div style={{ textAlign: 'center', marginTop: '2px' }}>
              {scheduleStartedAt && '스터디 일정 : ' + scheduleStartedAt.split('T')[0]}
            </div>
          </>
        )}
      </div>
      <div className="align_center">
        {type === 'invite' ? (
          <>
            <CustomBtn
              size="small"
              onClick={() => {
                joinStudy();
              }}>
              수락
            </CustomBtn>
            <Divider
              sx={{ border: `1px solid ${theme.palette.txt + '50'}` }}
              orientation="vertical"
              variant="middle"
              flexItem></Divider>
            <CustomBtn
              size="small"
              onClick={() => {
                rejectStudy();
              }}>
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
          {
            type: 'schedule',
            studyId: data.studyId,
            title: data.studyTitle,
            scheduleStartedAt: data.scheduleStartedAt,
          },
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
        {
          type: 'schedule',
          studyId: data.studyId,
          title: data.studyTitle,
          scheduleStartedAt: data.scheduleStartedAt,
        },
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
              scheduleStartedAt={noti.scheduleStartedAt}
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

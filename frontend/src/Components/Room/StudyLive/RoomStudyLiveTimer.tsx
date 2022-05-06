import React, { useEffect, useRef, useState } from 'react';
import { useTheme, styled, IconButton, Popover, InputBase } from '@mui/material';
import {
  Settings,
  KeyboardArrowUp,
  KeyboardArrowDown,
  PlayArrow,
  Stop,
  Pause,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import CBtn from '../../Commons/CBtn';
import Swal from 'sweetalert2';
const Timer = styled('div')(({ theme }) => ({
  background: theme.palette.component_accent,
  minHeight: '5.5vh',
  width: '10vw',
  borderRadius: '10px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const TimeSpan = styled(InputBase)(({ theme }) => ({
  background: theme.palette.bg,
  color: theme.palette.txt,
  width: '3vw',
  textAlign: 'center',
  borderRadius: '5px',
  '.MuiInputBase-input': {
    textAlign: 'center',
  },
}));

const TimerPaper = styled('div')(({ theme }) => ({
  background: theme.palette.component,
  color: theme.palette.txt,
  width: '13vw',
  height: '24vh',
  padding: '10px',
}));

const CustomIconButton = styled(IconButton)(({ theme }) => ({
  color:
    theme.palette.main === '#2D2D2D'
      ? '#FFFFFF'
      : theme.palette.main === '#FFC2C0'
      ? theme.palette.component_accent
      : theme.palette.main,
}));

function RoomStudyLiveTimer() {
  const theme = useTheme();
  const session = useSelector((state: any) => state.openvidu.sessionForCamera);

  const timerId = useRef<NodeJS.Timer | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [second, setSecond] = useState<number>(0);
  const [curTime, setCurTime] = useState<number | null>(null);

  useEffect(() => {
    session.on('signal:timer', (event: any) => {
      const { type, time } = JSON.parse(event.data);
      if (type === 'start') {
        handleStart(time);
      } else if (type === 'pause') {
        handleTogglePause('signal');
      } else if (type === 'stop') {
        handleStop('signal');
      }
    });
  }, [session]);

  const handleTime = () => {
    setCurTime((prev) => {
      if (typeof prev === 'number') {
        if (prev > 0) {
          return prev - 1;
        } else {
          if (timerId.current) {
            clearInterval(timerId.current);
            timerId.current = null;
          }
          Swal.fire({
            title: '타이머가 종료되었습니다.',
            icon: 'info',
            color: theme.palette.txt,
            background: theme.palette.bg,
            confirmButtonColor: theme.palette.warn,
            confirmButtonText: '확인',
            heightAuto: false,
          });
          return null;
        }
      }
      return null;
    });
  };
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHour = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 99) {
      setHour(99);
    } else if (value < 0 || isNaN(value)) {
      setHour(0);
    } else {
      setHour(value);
    }
  };
  const handleMinute = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 59) {
      setMinute(59);
    } else if (value < 0 || isNaN(value)) {
      setMinute(0);
    } else {
      setMinute(value);
    }
  };
  const handleSecond = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 59) {
      setSecond(59);
    } else if (value < 0 || isNaN(value)) {
      setSecond(0);
    } else {
      setSecond(value);
    }
  };

  const handleStop = (type?: 'signal') => {
    if (!type) {
      Swal.fire({
        title: '타이머를 정지 하시겠습니까?',
        text: '* 타이머 설정이 모든사람에게 적용됩니다.',
        icon: 'warning',
        color: theme.palette.txt,
        background: theme.palette.bg,
        showCancelButton: true,
        cancelButtonColor: theme.palette.main,
        cancelButtonText: '취소',
        confirmButtonColor: theme.palette.warn,
        confirmButtonText: '확인',
        heightAuto: false,
      }).then((res) => {
        if (res.isConfirmed) {
          session.signal({
            data: JSON.stringify({ type: 'stop', time: curTime }),
            to: [],
            type: 'timer',
          });
        }
      });
    } else {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
      timerId.current = null;
      setCurTime(null);
    }
  };

  const handleTogglePause = (type?: 'signal') => {
    if (!type) {
      Swal.fire({
        title: timerId.current
          ? `타이머를 일시정지 하시겠습니까?`
          : '타이머를 재시작 하시겠습니까?',
        text: '* 타이머 설정이 모든사람에게 적용됩니다.',
        icon: 'warning',
        color: theme.palette.txt,
        background: theme.palette.bg,
        showCancelButton: true,
        cancelButtonColor: theme.palette.main,
        cancelButtonText: '취소',
        confirmButtonColor: theme.palette.warn,
        confirmButtonText: '확인',
        heightAuto: false,
      }).then((res) => {
        if (res.isConfirmed) {
          session.signal({
            data: JSON.stringify({ type: 'pause', time: curTime }),
            to: [],
            type: 'timer',
          });
        }
      });
    } else {
      if (timerId.current) {
        clearInterval(timerId.current);
        timerId.current = null;
      } else {
        timerId.current = setInterval(handleTime, 1000);
      }
    }
  };

  const handleStart = (time?: number) => {
    if (!time) {
      if (hour + minute + second === 0) return;
      setAnchorEl(null);
      Swal.fire({
        title: `${hour}시간 ${minute}분 ${second}초\n\n타이머를 세팅하시겠습니까?`,
        text: '* 타이머 설정이 모든사람에게 적용됩니다.',
        icon: 'warning',
        color: theme.palette.txt,
        background: theme.palette.bg,
        showCancelButton: true,
        cancelButtonColor: theme.palette.main,
        cancelButtonText: '취소',
        confirmButtonColor: theme.palette.warn,
        confirmButtonText: '확인',
        heightAuto: false,
      }).then((res) => {
        if (res.isConfirmed) {
          session.signal({
            data: JSON.stringify({ type: 'start', time: hour * 3600 + minute * 60 + second }),
            to: [],
            type: 'timer',
          });
        }
      });
    } else {
      setCurTime(time);
      setAnchorEl(null);
      timerId.current = setInterval(handleTime, 1000);
      setHour(0);
      setMinute(0);
      setSecond(0);
    }
  };

  const timeFormat = (time: number | null) => {
    if (time) {
      const timeHour = Math.floor(time / 3600);
      const timeMinute = Math.floor((time % 3600) / 60);
      const timeSecond = time % 60;
      return `${String(timeHour).padStart(2, '0')}:${String(timeMinute).padStart(2, '0')}:${String(
        timeSecond,
      ).padStart(2, '0')}`;
    }
    return '00:00:00';
  };

  return (
    <span>
      <Timer>
        <span style={{ fontWeight: '600', fontSize: '1.5rem' }}>{timeFormat(curTime)}</span>
        <IconButton
          sx={{ position: 'absolute', top: '0', right: '0', color: theme.palette.icon }}
          onClick={handleOpen}
          disabled={Boolean(curTime)}>
          <Settings />
        </IconButton>
        {curTime && curTime > 0 && (
          <div>
            <IconButton
              onClick={() => {
                handleTogglePause();
              }}>
              {timerId.current ? <Pause /> : <PlayArrow />}
            </IconButton>
            <>{timerId.current}</>
            <IconButton
              onClick={() => {
                handleStop();
              }}>
              <Stop />
            </IconButton>
          </div>
        )}
      </Timer>
      <Popover
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
        <TimerPaper>
          <div>타이머 설정</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div className="align_column_center">
              <CustomIconButton
                onClick={() => {
                  setHour((hour) => (hour > 99 ? 99 : hour + 1));
                }}>
                <KeyboardArrowUp />
              </CustomIconButton>
              <TimeSpan value={hour} onChange={handleHour}></TimeSpan>
              <CustomIconButton
                onClick={() => {
                  setHour((hour) => (hour < 0 ? 0 : hour - 1));
                }}>
                <KeyboardArrowDown />
              </CustomIconButton>
            </div>
            :
            <div className="align_column_center">
              <CustomIconButton
                onClick={() => {
                  setMinute((minute) => (minute > 59 ? 59 : minute + 1));
                }}>
                <KeyboardArrowUp />
              </CustomIconButton>
              <TimeSpan value={minute} onChange={handleMinute}></TimeSpan>
              <CustomIconButton
                onClick={() => {
                  setMinute((minute) => (minute < 0 ? 0 : minute - 1));
                }}>
                <KeyboardArrowDown />
              </CustomIconButton>
            </div>
            :
            <div className="align_column_center">
              <CustomIconButton
                onClick={() => {
                  setSecond((second) => (second > 59 ? 59 : second + 1));
                }}>
                <KeyboardArrowUp />
              </CustomIconButton>
              <TimeSpan value={second} onChange={handleSecond}></TimeSpan>
              <CustomIconButton
                onClick={() => {
                  setSecond((second) => (second < 0 ? 0 : second - 1));
                }}>
                <KeyboardArrowDown />
              </CustomIconButton>
            </div>
          </div>
          <div style={{ textAlign: 'center', paddingBottom: '10px' }}>
            {hour}시간 {minute}분 {second}초
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around' }}>
            <CBtn
              onClick={() => {
                handleStart();
              }}
              width="4vw">
              저장
            </CBtn>
            <CBtn onClick={() => {}} width="4vw" backgroundColor={theme.palette.bg}>
              취소
            </CBtn>
          </div>
        </TimerPaper>
      </Popover>
    </span>
  );
}

export default RoomStudyLiveTimer;

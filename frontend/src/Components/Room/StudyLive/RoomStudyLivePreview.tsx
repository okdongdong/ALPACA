import React, { useEffect, useRef, useState } from 'react';
import {
  useTheme,
  Dialog,
  DialogTitle,
  DialogActions,
  styled,
  Button,
  ButtonGroup,
  Divider,
  Popover,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
} from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, ArrowDropDown } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setConstraints as setReduxConstraints, Constraints } from '../../../Redux/openviduReducer';
import useAlert from '../../../Hooks/useAlert';
type PropsType = React.VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};

type constraintsType = {
  audio: DeviceIdType | any;
  video: DeviceIdType | any;
};

type DeviceIdType = {
  deviceId: string;
};

type PreviewType = {
  open: boolean;
  setOpen: Function;
};

const NavBtn = styled(Button)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.icon,
  width: '5vw',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const ArrowBtn = styled(Button)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.icon,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

const CustomButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.icon,
  height: '4vh',
  marginRight: '2vw',
  '.MuiButtonGroup-grouped:not(:last-of-type)': {
    borderRight: `1px solid ${theme.palette.component_accent + '90'}`,
  },
}));

const Video = ({ srcObject, ...props }: PropsType) => {
  const refVideo = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!refVideo.current) return;
    refVideo.current.srcObject = srcObject;
  }, [srcObject]);
  return <video className="webcam-video" ref={refVideo} {...props} autoPlay />;
};

const PreviewDialog = styled(Dialog)(({ theme }) => ({
  '.MuiDialog-paper': {
    background: theme.palette.bg,
  },
}));

function RoomStudyLivePreview({ open, setOpen }: PreviewType) {
  const theme = useTheme();
  const cAlert = useAlert();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { roomId } = useParams();
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoSrc, setVideoSrc] = useState<MediaStream | null>(null);
  const [constraints, setConstraints] = useState<constraintsType>({ video: true, audio: true });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [listType, setListType] = useState<'video' | 'audio'>('video');
  const getUserDevices = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setVideoDevices(devices.filter((device) => device.kind === 'videoinput'));
      setAudioDevices(devices.filter((device) => device.kind === 'audioinput'));
    });
  };

  const getUserMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setVideoSrc(new MediaStream([mediaStream.getVideoTracks()[0]]));
    } catch (e) {
      cAlert.fire({
        icon: 'error',
        title: '미디어에 접근할 수 없습니다',
        text: '권한을 확인해주세요',
      });
    }
  };
  const stopUserMedia = () => {
    videoSrc?.getTracks()[0].stop();
    setVideoSrc(null);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handlePopoverOpen = (event: React.MouseEvent, listType: 'video' | 'audio') => {
    setAnchorEl(event.currentTarget.parentElement);
    setListType(listType);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent, deviceId: string) => {
    setConstraints((constraints) => {
      return {
        ...constraints,
        [listType]: {
          deviceId,
        },
      };
    });
    setAnchorEl(null);
  };
  const goToLive = () => {
    stopUserMedia();
    const state: Constraints = {
      audioSource: constraints.audio
        ? String(constraints.audio.deviceId || audioDevices[0].deviceId)
        : undefined,
      videoSource: constraints.video
        ? String(constraints.video.deviceId || videoDevices[0].deviceId)
        : undefined,
      publishAudio: Boolean(constraints.audio),
      publishVideo: Boolean(constraints.video),
    };
    console.log(audioDevices, videoDevices);
    dispatch(setReduxConstraints(state));
    navigate(`/room/${roomId}/live`, { state: roomId });
  };

  useEffect(() => {
    if (!open) {
      stopUserMedia();
    } else {
      getUserDevices();
      getUserMedia();
    }
  }, [open]);

  useEffect(() => {
    if (open && constraints.video !== false) {
      getUserMedia();
    } else {
      stopUserMedia();
    }
  }, [constraints]);
  return (
    <PreviewDialog maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle sx={{ color: theme.palette.txt }}>미리보기</DialogTitle>
      <div
        className="align_center"
        style={{ height: 480, width: 640, background: theme.palette.main }}>
        {videoSrc ? (
          <Video srcObject={videoSrc} />
        ) : (
          <VideocamOff sx={{ color: theme.palette.icon }} />
        )}
      </div>
      <DialogActions sx={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
          }}>
          <CustomButtonGroup variant="contained">
            <NavBtn
              onClick={() => {
                setConstraints((constraints) => {
                  return {
                    ...constraints,
                    audio: Boolean(constraints.audio)
                      ? false
                      : { deviceId: audioDevices[0].deviceId },
                  };
                });
              }}>
              {Boolean(constraints.audio) ? <Mic /> : <MicOff />}
            </NavBtn>
            <ArrowBtn
              size="small"
              onClick={(event) => {
                handlePopoverOpen(event, 'audio');
              }}>
              <ArrowDropDown />
            </ArrowBtn>
          </CustomButtonGroup>
          <CustomButtonGroup variant="contained">
            <NavBtn
              onClick={() => {
                setConstraints((constraints) => {
                  return {
                    ...constraints,
                    video: Boolean(constraints.video)
                      ? false
                      : { deviceId: videoDevices[0].deviceId },
                  };
                });
              }}>
              {Boolean(constraints.video) ? <Videocam /> : <VideocamOff />}
            </NavBtn>
            <ArrowBtn
              size="small"
              onClick={(event) => {
                handlePopoverOpen(event, 'video');
              }}>
              <ArrowDropDown />
            </ArrowBtn>
          </CustomButtonGroup>
        </div>
        <NavBtn sx={{ color: theme.palette.txt }} onClick={goToLive}>
          입장
        </NavBtn>
      </DialogActions>
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl}>
        <Paper>
          <ClickAwayListener onClickAway={handlePopoverClose}>
            <MenuList id="split-button-menu" autoFocusItem>
              {(listType === 'video' ? videoDevices : audioDevices).map((device, index) => (
                <MenuItem
                  key={device.deviceId}
                  selected={
                    typeof constraints[listType] !== 'boolean' &&
                    device.deviceId === constraints[listType]?.deviceId
                  }
                  onClick={(event) => handleMenuItemClick(event, device.deviceId)}>
                  {device.label}
                </MenuItem>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </PreviewDialog>
  );
}

export default RoomStudyLivePreview;

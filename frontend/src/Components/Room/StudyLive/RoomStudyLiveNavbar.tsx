import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  PictureInPicture,
} from '@mui/icons-material';
import UserModel from './user-model';

type navPropsType = {
  user: UserModel;
  toggleMic: Function;
  toggleCam: Function;
  screenShare: Function;
  stopScreenShare: Function;
};

const NavBtn = styled(Button)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.icon,
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

function RoomStudyLiveNavbar({
  user,
  toggleMic,
  toggleCam,
  screenShare,
  stopScreenShare,
}: navPropsType) {
  return (
    <div className="align_center">
      <NavBtn
        onClick={() => {
          toggleMic();
        }}>
        {user !== undefined && user.isAudioActive() ? <Mic /> : <MicOff />}
      </NavBtn>
      <NavBtn
        onClick={() => {
          toggleCam();
        }}>
        {user !== undefined && user.isVideoActive() ? <Videocam /> : <VideocamOff />}
      </NavBtn>
      <NavBtn>
        {user !== undefined && user.isScreenShareActive() ? <PictureInPicture /> : <ScreenShare />}
      </NavBtn>
    </div>
  );
}

export default RoomStudyLiveNavbar;

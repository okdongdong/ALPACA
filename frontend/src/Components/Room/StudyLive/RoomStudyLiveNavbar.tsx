import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  ScreenShare,
  StopScreenShare,
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
  width: '8vw',
  margin: '1vh',
  marginLeft: '4vh',
  marginRight: '4vh',
  borderRadius: '10px',
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
  useEffect(() => {
    console.log(user);
  }, [user.audioActive]);

  return (
    <div className="align_center">
      <NavBtn
        onClick={() => {
          toggleMic();
        }}>
        {user !== undefined && user.audioActive ? <Mic /> : <MicOff />}
      </NavBtn>
      <NavBtn
        onClick={() => {
          toggleCam();
        }}>
        {user !== undefined && user.videoActive ? <Videocam /> : <VideocamOff />}
      </NavBtn>
      <NavBtn
        onClick={() => {
          if (user.screenShareActive) {
            stopScreenShare();
          } else {
            screenShare();
          }
        }}>
        {user !== undefined && user.screenShareActive ? <StopScreenShare /> : <ScreenShare />}
      </NavBtn>
      {user.screenShareActive && (
        <NavBtn
          onClick={() => {
            screenShare();
          }}>
          <PictureInPicture />
        </NavBtn>
      )}
    </div>
  );
}

export default RoomStudyLiveNavbar;

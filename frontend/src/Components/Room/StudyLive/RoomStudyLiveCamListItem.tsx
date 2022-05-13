import React, { useRef, useEffect, useState } from 'react';
import { Button, useTheme, styled } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, ScreenShare } from '@mui/icons-material';
import UserModel from './user-model';
import { useSelector, useDispatch } from 'react-redux';
import { setMainUser } from '../../../Redux/openviduReducer';

type userPropsType = {
  user: UserModel;
};

const VideoButton = styled(Button)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.main + '30',
    boxShadow: 'none',
  },
  '&& .MuiTouchRipple-child': {
    backgroundColor: theme.palette.main + '70',
  },
}));

function RoomStudyLiveCamListItem({ user }: userPropsType) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSelector((state: any) => state.openvidu.sessionForCamera);
  const mainUser = useSelector((state: any) => state.openvidu.mainUser);

  // useEffect(() => {
  //   if (!user) return;
  //   user.getStreamManager().addVideoElement(videoRef.current);
  // }, []);
  useEffect(() => {
    if (!user) return;
    user.getStreamManager().addVideoElement(videoRef.current);
  }, [user]);
  return (
    <>
      <div className="align_column_center">
        <VideoButton
          sx={{ position: 'relative', width: '100%', height: '95%', gridAutoFlow: 'dense' }}
          onClick={() => {
            dispatch(setMainUser(user));
          }}>
          <video
            style={{
              borderRadius: '20px',
              width: '100%',
              height: '100%',
              maxHeight: '80vh',
              border: mainUser === user ? `3px solid ${theme.palette.component_accent}` : '',
            }}
            autoPlay={true}
            id={'video-' + user.getStreamManager().stream.streamId}
            ref={videoRef}
            // muted={this.props.mutedSound}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              background: theme.palette.main + '80',
              color: theme.palette.icon,
              borderRadius: '5px',
            }}>
            <span>
              {user !== undefined && user.screenShareActive ? <ScreenShare /> : undefined}
            </span>
            <span>{user !== undefined && user.audioActive ? <Mic /> : <MicOff />}</span>
            <span>{user !== undefined && user.videoActive ? <Videocam /> : <VideocamOff />}</span>
          </div>
        </VideoButton>

        {user.getNickname()}
      </div>
    </>
  );
}

export default RoomStudyLiveCamListItem;

import React, { useRef, useEffect, useState } from 'react';
import { Button, useTheme } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, ScreenShare } from '@mui/icons-material';
import UserModel from './user-model';
import { useSelector, useDispatch } from 'react-redux';
import { setMainUser } from '../../../Redux/openviduReducer';

type userPropsType = {
  user: UserModel;
};

function RoomStudyLiveCamListItem({ user }: userPropsType) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSelector((state: any) => state.openvidu.sessionForCamera);

  useEffect(() => {
    if (!user) return;
    user.getStreamManager().addVideoElement(videoRef.current);
    subscribeToUserChanged();
  }, []);
  useEffect(() => {
    if (!user) return;
    console.log('changed', user);
    // if (!user.isScreenShareActive()) {
    user.getStreamManager().addVideoElement(videoRef.current);
    // }
  }, [user]);
  const subscribeToUserChanged = () => {
    session.on('signal:userChanged', (event: any) => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (user.getConnectionId() === event.from.connectionId && data.isScreenShareActive === true) {
        console.log('socket changed', user);
        user.getStreamManager().addVideoElement(videoRef.current);
      }
    });
  };
  return (
    <>
      <div className="align_column_center">
        <Button
          sx={{ position: 'relative' }}
          onClick={() => {
            dispatch(setMainUser(user));
          }}>
          <video
            style={{ borderRadius: '20px', width: '100%', maxHeight: '80vh' }}
            autoPlay={true}
            id={'video-' + user.getStreamManager().stream.streamId}
            ref={videoRef}
            // muted={this.props.mutedSound}
          />
          <div style={{ position: 'absolute', bottom: 0, color: theme.palette.icon }}>
            <span>
              {user !== undefined && user.screenShareActive ? <ScreenShare /> : undefined}
            </span>
            <span>{user !== undefined && user.audioActive ? <Mic /> : <MicOff />}</span>
            <span>{user !== undefined && user.videoActive ? <Videocam /> : <VideocamOff />}</span>
          </div>
        </Button>

        {user.getNickname()}
      </div>
    </>
  );
}

export default RoomStudyLiveCamListItem;

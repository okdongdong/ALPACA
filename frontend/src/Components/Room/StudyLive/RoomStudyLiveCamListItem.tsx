import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import UserModel from './user-model';
import { useSelector } from 'react-redux';

type userPropsType = {
  user: UserModel;
};

type PropsType = React.VideoHTMLAttributes<HTMLVideoElement> & {
  srcObject: MediaStream;
};

function RoomStudyLiveCamListItem({ user }: userPropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const session = useSelector((state: any) => state.openvidu.session);

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
          onClick={() => {
            console.log(user.getStreamManager().streamId);
          }}>
          <video
            style={{ borderRadius: '20px', width: '100%', maxHeight: '80vh' }}
            autoPlay={true}
            id={'video-' + user.getStreamManager().stream.streamId}
            ref={videoRef}
            // muted={this.props.mutedSound}
          />
        </Button>

        {user.getNickname()}
      </div>
    </>
  );
}

export default RoomStudyLiveCamListItem;

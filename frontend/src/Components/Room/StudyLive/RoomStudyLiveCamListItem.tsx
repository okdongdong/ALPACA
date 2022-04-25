import React, { useRef, useEffect } from 'react';
import UserModel from './user-model';

type userPropsType = {
  user: UserModel;
};

function RoomStudyLiveCamListItem({ user }: userPropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!user) return;
  }, []);
  useEffect(() => {
    if (!user) return;
    user.getStreamManager().addVideoElement(videoRef.current);
    // user.streamManager.session.on('signal:userChanged', (event: any) => {
    //   const data = JSON.parse(event.data);
    //   if (data.isScreenShareActive !== undefined) {
    //     user.getStreamManager().addVideoElement(videoRef.current);
    //   }
    // });
  }, [user]);
  return (
    <>
      <div className="align_column_center">
        <video
          style={{ borderRadius: '20px' }}
          autoPlay={true}
          id={'video-' + user.getStreamManager().stream.streamId}
          ref={videoRef}
          // muted={this.props.mutedSound}
        />
        {user.getNickname()}
      </div>
    </>
  );
}

export default RoomStudyLiveCamListItem;

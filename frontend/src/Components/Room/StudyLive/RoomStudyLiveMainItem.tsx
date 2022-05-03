import React, { useRef } from 'react';
import UserModel from './user-model';
type userPropsType = {
  user: UserModel;
};

function RoomStudyLiveMainItem({ user }: userPropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  return (
    <div style={{ borderRadius: '20px', width: '100%', maxHeight: '80vh' }}>
      <div>
        {user.getStreamManager() && (
          <video
            style={{ borderRadius: '20px', width: '100%', maxHeight: '80vh' }}
            autoPlay={true}
            id={'video-' + user.getStreamManager().stream.streamId}
            ref={videoRef}
            // muted={this.props.mutedSound}
          />
        )}
      </div>
      <div>
        {user.getScreenStreamManager() && (
          <video
            style={{ borderRadius: '20px', width: '100%', maxHeight: '80vh' }}
            autoPlay={true}
            id={'screen-' + user.getScreenStreamManager().stream.streamId}
            ref={screenRef}
            // muted={this.props.mutedSound}
          />
        )}
      </div>
    </div>
  );
}

export default RoomStudyLiveMainItem;

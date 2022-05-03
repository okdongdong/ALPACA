import React, { useRef, useEffect, useState } from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

import UserModel from './user-model';
type userPropsType = {
  user: UserModel;
};

function RoomStudyLiveMainItem({ user }: userPropsType) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  const [radioValue, setRadioValue] = useState<string>('camera');
  useEffect(() => {
    if (user.getStreamManager()) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
    if (user.getScreenStreamManager()) {
      user.getScreenStreamManager().addVideoElement(screenRef.current);
    }
  }, []);

  useEffect(() => {
    if (!divRef.current) return;
    setHeight(divRef.current.getBoundingClientRect().width * 0.75);
  }, [divRef.current?.getBoundingClientRect()]);

  useEffect(() => {
    if (user.getScreenStreamManager()) {
      user.getScreenStreamManager().addVideoElement(screenRef.current);
    }
  }, [user.screenStreamManager]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };
  return (
    <div
      ref={divRef}
      style={{ borderRadius: '20px', width: '100%', height: height, maxHeight: '80vh' }}>
      {user.getStreamManager() && (
        <video
          style={{
            display: radioValue === 'camera' ? '' : 'none',
            borderRadius: '20px',
            width: '100%',
            height: height,
            maxHeight: '75vh',
          }}
          autoPlay={true}
          id={'video-' + user.getStreamManager().stream.streamId}
          ref={videoRef}
          // muted={this.props.mutedSound}
        />
      )}
      {user.getScreenStreamManager() && (
        <video
          style={{
            display: radioValue === 'screen' ? '' : 'none',
            borderRadius: '20px',
            width: '100%',
            height: height,
            maxHeight: '70vh',
          }}
          autoPlay={true}
          id={'screen-' + user.getScreenStreamManager().stream.streamId}
          ref={screenRef}
          // muted={this.props.mutedSound}
        />
      )}
      <FormControl>
        <RadioGroup row defaultValue={radioValue} value={radioValue} onChange={handleRadioChange}>
          {user.getStreamManager() && (
            <FormControlLabel value="camera" control={<Radio />} label="카메라" />
          )}
          {user.getScreenStreamManager() && (
            <FormControlLabel value="screen" control={<Radio />} label="스크린" />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RoomStudyLiveMainItem;

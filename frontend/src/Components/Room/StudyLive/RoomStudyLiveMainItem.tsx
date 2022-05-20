import React, { useRef, useEffect, useState } from 'react';
import { Button, Radio, RadioGroup, FormControlLabel, FormControl, styled } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setMainUser } from '../../../Redux/openviduReducer';

import UserModel from './user-model';
type userPropsType = {
  user: UserModel;
};

const CustomRadio = styled(Radio)(({ theme }) => ({
  color: theme.palette.main,
  '&.Mui-checked': {
    color: theme.palette.main,
  },
}));

function RoomStudyLiveMainItem({ user }: userPropsType) {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();
  const [radioValue, setRadioValue] = useState<string>('camera');

  const setVideoElement = () => {
    if (user.getStreamManager()) {
      user.getStreamManager().addVideoElement(videoRef.current);
    }
    if (user.getScreenStreamManager()) {
      user.getScreenStreamManager().addVideoElement(screenRef.current);
    }
  };

  useEffect(() => {
    if (!divRef.current) return;
    setHeight(divRef.current.getBoundingClientRect().width * 0.75);
    // console.log(12);
  }, [divRef.current?.getBoundingClientRect()]);

  useEffect(() => {
    if (user.getScreenStreamManager()) {
      user.getScreenStreamManager().addVideoElement(screenRef.current);
    } else {
      setRadioValue('camera');
    }
  }, [user.screenStreamManager]);

  useEffect(() => {
    setVideoElement();
  }, [user]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  };
  return (
    <div
      ref={divRef}
      style={{
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: height,
        maxHeight: '80vh',
      }}>
      <Button
        sx={{ padding: 0 }}
        onClick={() => {
          dispatch(setMainUser(undefined));
        }}>
        {user.getStreamManager() && (
          <video
            style={{
              display: radioValue === 'camera' ? '' : 'none',
              borderRadius: '20px',
              width: '100%',
              height: height,
              maxHeight: '74vh',
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
              maxHeight: '74vh',
            }}
            autoPlay={true}
            id={'screen-' + user.getScreenStreamManager().stream.streamId}
            ref={screenRef}
            // muted={this.props.mutedSound}
          />
        )}
      </Button>
      <FormControl>
        <RadioGroup row defaultValue={radioValue} value={radioValue} onChange={handleRadioChange}>
          {user.getStreamManager() && (
            <FormControlLabel value="camera" control={<CustomRadio />} label="카메라" />
          )}
          {user.getScreenStreamManager() && (
            <FormControlLabel value="screen" control={<CustomRadio />} label="스크린" />
          )}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RoomStudyLiveMainItem;

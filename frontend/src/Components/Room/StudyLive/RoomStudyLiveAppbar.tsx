import React from 'react';
import CBtn from '../../Commons/CBtn';
import { useTheme } from '@mui/material';

type LiveAppbarType = {
  exitStudyLive: Function;
};

function RoomStudyLiveAppbar({ exitStudyLive }: LiveAppbarType) {
  const theme = useTheme();
  return (
    <div>
      <span style={{ marginRight: '1rem' }}>
        <CBtn onClick={() => console.log('스터디')}>오늘의 스터디 문제</CBtn>
      </span>
      <span>
        <CBtn onClick={() => exitStudyLive()} backgroundColor={theme.palette.warn}>
          퇴장
        </CBtn>
      </span>
    </div>
  );
}

export default RoomStudyLiveAppbar;

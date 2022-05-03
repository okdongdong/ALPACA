import React from 'react';
import CBtn from '../../Commons/CBtn';
import { useTheme } from '@mui/material';
function RoomStudyLiveAppbar() {
  const theme = useTheme();
  return (
    <div>
      <span style={{ marginRight: '1rem' }}>
        <CBtn onClick={() => console.log('스터디')}>오늘의 스터디 문제</CBtn>
      </span>
      <span>
        <CBtn onClick={() => console.log('퇴장')} backgroundColor={theme.palette.warn}>
          퇴장
        </CBtn>
      </span>
    </div>
  );
}

export default RoomStudyLiveAppbar;

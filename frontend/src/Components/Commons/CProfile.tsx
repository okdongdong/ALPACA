import React from 'react';
import { Avatar } from '@mui/material';

type profileProps = {
  nickname: string;
  profileImg: string;
};

function CProfile({ nickname, profileImg }: profileProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar alt={nickname} src={profileImg} sx={{ mx: '10px', width: 35, height: 35 }} />
      <span>{nickname}</span>
    </div>
  );
}

export default CProfile;

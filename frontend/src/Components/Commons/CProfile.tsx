import React from 'react';
import alpaca from '../../Assets/Img/alpaca.png';
import { Avatar } from '@mui/material';

type profileProps = {
  nickname: string;
  profileImg?: string;
};

function CProfile({ nickname, profileImg }: profileProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
        alt={nickname}
        src={profileImg || alpaca}
        sx={{ mx: '10px', width: 35, height: 35 }}
      />
      <span>{nickname}</span>
    </div>
  );
}

export default CProfile;

import React from 'react';
import { Avatar, useTheme } from '@mui/material';

type ChatType = {
  nickname: string;
  profileImg: string;
  message: string;
};

type ChatPropsType = {
  chat: ChatType;
  avatar: Boolean;
};

function RoomStudyLiveChatReception({ chat, avatar }: ChatPropsType) {
  const theme = useTheme();
  const { nickname, profileImg, message } = chat;
  return (
    <div style={{ marginBottom: '8px' }}>
      {avatar && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.component,
              width: 30,
              height: 30,
              boxShadow: `0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)`,
            }}
            alt={nickname}
            src={profileImg}
          />
          <span style={{ color: theme.palette.txt, marginLeft: '6px' }}>{nickname}</span>
        </div>
      )}
      <div
        style={{
          color: theme.palette.txt,
          display: 'inline-block',
          marginLeft: '36px',
          padding: '3px',
          borderRadius: '2px',
          background: theme.palette.component,
          maxWidth: '10vw',
          wordBreak: 'break-all',
        }}>
        {message}
      </div>
    </div>
  );
}

export default RoomStudyLiveChatReception;

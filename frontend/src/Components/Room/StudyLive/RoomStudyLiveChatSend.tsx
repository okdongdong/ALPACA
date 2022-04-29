import React from 'react';
import { useTheme } from '@mui/material';
type ChatType = {
  nickname: string;
  profileImg: string;
  message: string;
};

type ChatPropsType = {
  chat: ChatType;
};

function RoomStudyLiveChatSend({ chat }: ChatPropsType) {
  const theme = useTheme();
  const { message } = chat;
  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          marginBottom: '8px',
        }}>
        <span
          style={{
            marginRight: '6px',
            color: theme.palette.txt,
            padding: '3px',
            paddingLeft: '6px',
            paddingRight: '6px',
            borderRadius: '2px',
            background: theme.palette.icon,
            maxWidth: '10vw',
            wordBreak: 'break-all',
          }}>
          {message}
        </span>
      </div>
    </div>
  );
}

export default RoomStudyLiveChatSend;

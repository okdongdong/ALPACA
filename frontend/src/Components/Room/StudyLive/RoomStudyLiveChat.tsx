import React, { useEffect, useState } from 'react';
import { Menu, Popover, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Chat } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import RoomStudyLiveChatInput from './RoomStudyLiveChatInput';

const NavBtn = styled(Button)(({ theme }) => ({
  background: theme.palette.main,
  color: theme.palette.icon,
  width: '4vw',
  margin: '1vh',
  borderRadius: '10px',
  '&:hover': {
    background: theme.palette.main + '90',
  },
}));

type ChatType = {
  nickname: string;
  profileImg: string;
  message: string;
};

function RoomStudyLiveChat() {
  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>();
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const session = useSelector((state: any) => state.openviduReducer.session);
  const openChat = Boolean(anchorEl);

  useEffect(() => {
    session.on('signal:chat', (event: any) => {
      setChatList((prev) => {
        const { clientData } = JSON.parse(event.from.data);
        const { profileImg, message } = JSON.parse(event.data);
        return [
          ...prev,
          {
            nickname: clientData,
            profileImg: profileImg,
            message: message,
          },
        ];
      });
    });
  }, []);

  const toggleChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (openChat) {
      console.log(event);
      setAnchorEl(undefined);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  return (
    <>
      <NavBtn onClick={toggleChat}>
        <Chat />
      </NavBtn>
      <Popover
        open={openChat}
        anchorEl={anchorEl}
        onClose={toggleChat}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}>
        {chatList.map((chat) => {
          return chat.message;
        })}
        <RoomStudyLiveChatInput />
      </Popover>
    </>
  );
}

export default RoomStudyLiveChat;

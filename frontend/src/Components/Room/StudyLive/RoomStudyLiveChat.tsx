import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Fab, Paper, Popover, Button, styled, useTheme } from '@mui/material';
import { Chat, ArrowDownward } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import RoomStudyLiveChatInput from './RoomStudyLiveChatInput';
import RoomStudyLiveChatReception from './RoomStudyLiveChatReception';
import RoomStudyLiveChatSend from './RoomStudyLiveChatSend';

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

const ChatPaper = styled(Paper)(({ theme }) => ({
  background: theme.palette.main,
  position: 'relative',
  paddingTop: '1vh',
  width: '20vw',
  height: '50vh',
}));

const ChatContentPaper = styled('div')(({ theme }) => ({
  background: theme.palette.main,
  padding: '2rem',
  width: '20vw',
  height: '44vh',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '0.5vw',
  },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: '100px',
    backgroundColor: theme.palette.component,
    boxShadow: 'inset 2px 2px 5px 0 rgba(#fff, 0.5)',
  },
}));

const ChatNotiDiv = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: theme.palette.component,
  borderRadius: '3px',
  width: '15vw',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

type ChatType = {
  nickname: string;
  profileImg: string;
  message: string;
};

function RoomStudyLiveChat() {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<undefined | HTMLElement>();
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const [isBottom, setIsBottom] = useState<Boolean>(true);
  const [isNewMessage, setIsNewMessage] = useState<Boolean>(false);

  const chatDivRef = useRef<HTMLDivElement>(null);
  const session = useSelector((state: any) => state.openvidu.sessionForCamera);
  const openChat = Boolean(anchorEl);
  const { nickname } = useSelector((state: any) => state.account);

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

  useEffect(() => {
    console.log(isBottom);
    if (isBottom) {
      setIsNewMessage(false);
      goToBottom();
    } else {
      setIsNewMessage(true);
    }
  }, [chatList]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    console.log('scrollHeight', scrollHeight);
    console.log('scrollTop', scrollTop);
    console.log('clientHeight', clientHeight);
    if (scrollHeight - (scrollTop + clientHeight) < 10) {
      setIsNewMessage(false);
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  };

  const goToBottom = () => {
    if (!chatDivRef.current) return;
    chatDivRef.current.scrollTo(0, chatDivRef.current.scrollHeight);
  };

  const toggleChat = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (openChat) {
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
        <ChatPaper>
          <ChatContentPaper onScroll={handleScroll} ref={chatDivRef}>
            {chatList.map((chat, index) => {
              return chat.nickname !== nickname ? (
                <RoomStudyLiveChatSend key={`${chat.nickname}-${index}`} chat={chat} />
              ) : (
                <RoomStudyLiveChatReception key={`${chat.nickname}-${index}`} chat={chat} />
              );
            })}
          </ChatContentPaper>
          <Fab
            onClick={goToBottom}
            size="small"
            sx={{
              display: isBottom || isNewMessage ? 'none' : undefined,
              position: 'absolute',
              bottom: '6vh',
              right: '1rem',
              background: theme.palette.icon,
              color: theme.palette.main,
              '&:hover': {
                background: theme.palette.icon + '90',
              },
            }}>
            <ArrowDownward />
          </Fab>
          {chatList.length > 0 && (
            <Button
              onClick={goToBottom}
              sx={{
                position: 'absolute',
                display: !isNewMessage ? 'none' : undefined,
                left: '50%',
                bottom: '6vh',
                transform: 'translate(-50%)',
                color: theme.palette.txt,
                background: theme.palette.component,
                '&:hover': {
                  background: theme.palette.component,
                },
              }}>
              <ChatNotiDiv>
                <Avatar
                  sx={{ bgcolor: theme.palette.component, width: 30, height: 30 }}
                  alt={chatList[chatList.length - 1].nickname}
                  src={chatList[chatList.length - 1].profileImg}
                />
                <span style={{ marginLeft: '6px', marginRight: '5px' }}>
                  {chatList[chatList.length - 1].nickname}
                </span>
                <span>{chatList[chatList.length - 1].message}</span>
              </ChatNotiDiv>
              <ArrowDownward />
            </Button>
          )}

          <RoomStudyLiveChatInput goToBottom={goToBottom} />
        </ChatPaper>
      </Popover>
    </>
  );
}

export default RoomStudyLiveChat;

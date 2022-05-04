import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainChatBar from './RoomMainChatBar';
import { Stack } from '@mui/material';

interface RoomMainChattingProps {
  roomId: string | undefined;
}

interface ReceiveMessage {
  nickname: string;
  content: string;
  timeStamp: string;
}

let socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/api/v1/ws`);

var client = Stomp.over(socket);

function RoomMainChat({ roomId }: RoomMainChattingProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState<ReceiveMessage[]>([]);

  const wsSendMessage = () => {
    if (client && client.connected) {
      console.log('Send message:' + message);

      const temp = { studyId: roomId, content: message };

      client.send(`/pub/chat/study`, JSON.stringify(temp), {});
    }
  };

  const wsConnect = () => {
    const token = localStorage.getItem('accessToken') || '';
    const header = {
      Authorization: token,
    };

    client.connect(
      header,
      (res) => {
        console.log('연결성공', res);

        client.subscribe(
          `/sub/chat/study/${roomId}`,
          (msg) => {
            const newMessage = JSON.parse(msg.body);
            setChatList((prev) => [...prev, newMessage]);
          },
          { id: 'user' },
        );
      },
      (err) => {
        console.log('err', err);
      },
    );
    console.log(4444444, client);
  };

  const wsDisconnect = () => {
    client.disconnect();
  };

  const onSendMessageHandler = () => {
    wsSendMessage();
    if (scrollRef.current !== null) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
    console.log(scrollRef);
  };

  useEffect(() => {
    console.log(11111, client);

    if (!client.connected) {
      wsConnect();
    }
    return () => {
      if (client.connected) {
        wsDisconnect();
      }
    };
  }, []);
  return (
    <RoomMainComponentContainer>
      <Stack spacing={1} className="scroll-box" sx={{ height: '15vh' }} ref={scrollRef}>
        {chatList.map((chat, idx) => (
          <div key={idx}>
            {chat.nickname}
            {chat.content}
            {chat.timeStamp}
          </div>
        ))}
      </Stack>
      <RoomMainChatBar onChange={setMessage} onSendMessage={onSendMessageHandler} />
    </RoomMainComponentContainer>
  );
}

export default RoomMainChat;

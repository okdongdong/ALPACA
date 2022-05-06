import React, { useCallback, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainChatBar from './RoomMainChatBar';
import { Stack } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { MemberDict } from '../../../Pages/Room/RoomMain';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringTime } from '../../../Lib/dateToString';

interface RoomMainChattingProps {
  roomId: string | undefined;
  memberDict: MemberDict;
  offsetId: string;
}

interface ReceiveMessage {
  nickname: string;
  chatId: string;
  content: string;
  timeStamp: string;
}

let socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/api/v1/ws`);

var client = Stomp.over(socket);

const token = localStorage.getItem('accessToken') || '';
const header = {
  Authorization: token,
};

function RoomMainChat({ roomId, memberDict, offsetId }: RoomMainChattingProps) {
  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: any) => state.account.userId);

  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState<ReceiveMessage[]>([]);

  const [page, setPage] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const options = {
    root: scrollRef.current, // 기본 null, 관찰대상의 부모요소를 지정
    rootMargin: '20px', // 관찰하는 뷰포트의 마진 지정
    threshold: 1.0, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소 };
  };

  const wsSendMessage = () => {
    if (client && client.connected) {
      console.log('Send message:' + message);

      const temp = { userId, studyId: roomId, content: message };

      client.send(`/pub/chat/study`, JSON.stringify(temp), {});
    }
  };

  const wsConnect = () => {
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

  const getPrevChat = async () => {
    if (isFinished) return;
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await customAxios({
        method: 'get',
        url: `/chat/study/${roomId}`,
        params: { offsetId, page, size: 5 },
      });
      setChatList((prev) => [...res.data.content.reverse(), ...prev]);
      setPage((prev) => prev + 1);
      if (res.data.last) {
        setIsFinished(true);
      }

      console.log('page: ', page, ' / offsetId: ', offsetId);
      console.log(res);
    } catch (e: any) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const calDateTime = (nowTime: Date) => {
    if (nowTime.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      return dateToStringTime(nowTime);
    }
    return dateToString(nowTime);
  };

  const infiniteHandler = async (entries: any) => {
    if (isLoading || isFinished) return;

    const target = entries[0];
    if (target.isIntersecting) {
      console.log('is InterSecting');
      // getPrevChat();
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(infiniteHandler, options);
    if (infiniteRef.current !== null) {
      observer.observe(infiniteRef.current);
    }
    return () => observer.disconnect();
  }, [infiniteHandler]);

  useEffect(() => {
    console.log(11111, client);
    getPrevChat();
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
      <button onClick={() => getPrevChat()}>버튼</button>
      <Stack spacing={1} className="scroll-box" sx={{ height: '15vh' }} ref={scrollRef}>
        <div style={{ height: 100, width: 100, backgroundColor: 'red' }} ref={infiniteRef}>
          <h1>{isFinished ? '이전 기록이 없습니다.' : ''}</h1>
        </div>
        {chatList.map((chat, idx) => (
          <div key={idx}>
            {chat.nickname}:{chat.content}-{calDateTime(new Date(chat.timeStamp))}
          </div>
        ))}
      </Stack>
      <RoomMainChatBar onChange={setMessage} onSendMessage={onSendMessageHandler} />
    </RoomMainComponentContainer>
  );
}

export default RoomMainChat;

import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainChatBar from './RoomMainChatBar';
import { Divider, Stack, styled } from '@mui/material';
import { useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringTime } from '../../../Lib/dateToString';
import CProfile from '../../Commons/CProfile';
import { useParams } from 'react-router-dom';

interface ReceiveMessage {
  userId: number;
  chatId: string;
  content: string;
  timeStamp: string;
}

const MessageBox = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

let socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/api/v1/ws`);

var client = Stomp.over(socket);

const token = localStorage.getItem('accessToken') || '';
const header = {
  Authorization: token,
};

const options = {
  root: null, // 기본 null, 관찰대상의 부모요소를 지정
  rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
  threshold: 1, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소 };
};

function RoomMainChat() {
  const { roomId } = useParams();

  const memberDict = useSelector((state: any) => state.room.memberDict);
  const offsetId = useSelector((state: any) => state.room.offsetId);

  // 채팅 인피니티 스크롤 관련
  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: any) => state.account.userId);

  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState<ReceiveMessage[]>([]);

  const [page, setPage] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGetPrevChat, setIsGetPrevChat] = useState<boolean>(false);

  const wsSendMessage = () => {
    if (!message) return;

    if (client && client.connected) {
      console.log('Send message:' + message);
      const temp = { userId, studyId: roomId, content: message };
      client.send(`/pub/chat/study`, JSON.stringify(temp), {});
      setMessage('');
    }
  };

  const wsConnect = () => {
    console.log('-----------소켓연결시도-----------');
    client.connect(
      header,
      (res) => {
        console.log('-----------연결성공!!-----------', res);

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
        console.log('-----------연결실패!!-----------', err);
      },
    );
  };

  const wsDisconnect = () => {
    client.disconnect();
  };

  const onSendMessageHandler = () => {
    setIsGetPrevChat(false);
    wsSendMessage();
    console.log('scrollRef: ', scrollRef);
  };

  const getPrevChat = async () => {
    console.log('isFinished: ', isFinished, ' / isLoading: ', isLoading, ' / offsetId: ', offsetId);
    if (isFinished || isLoading) return;
    if (!offsetId) return;
    setIsLoading(true);
    setIsGetPrevChat(true);
    try {
      const prevScrollHeight = scrollRef.current?.scrollHeight;
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
      console.log('scrollRef: ', scrollRef);
      const nowScrollHeight = scrollRef.current?.scrollHeight;

      console.log('scrollHeight: ', nowScrollHeight, prevScrollHeight);
      if (!!prevScrollHeight && !!nowScrollHeight) {
        scrollRef.current.scrollTo(0, res.data.numberOfElements * 43 + 10);
      }
      console.log('page: ', page, ' / offsetId: ', offsetId);
      console.log(res);
    } catch (e: any) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const getInitChat = async () => {
    await getPrevChat();
    scrollRef?.current?.scrollTo(0, 987654321);
  };

  const calDateTime = (nowTime: Date) => {
    if (nowTime.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
      return dateToStringTime(nowTime);
    }
    return dateToString(nowTime);
  };

  const infiniteHandler = async (entries: any) => {
    if (isLoading || isFinished || !offsetId) return;
    const target = entries[0];
    if (target.isIntersecting) {
      console.log('is InterSecting');
      getPrevChat();
    }
  };

  useEffect(() => {
    if (!isGetPrevChat) {
      scrollRef?.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [chatList.length]);

  useEffect(() => {
    getInitChat();
    if (!client.connected) {
      wsConnect();
    }
    return () => {
      if (client.connected) {
        wsDisconnect();
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(infiniteHandler, options);
    if (infiniteRef.current !== null) {
      observer.observe(infiniteRef.current);
    }
    return () => observer.disconnect();
  }, [infiniteHandler]);

  return (
    <RoomMainComponentContainer>
      <Stack
        spacing={1}
        className="scroll-box"
        sx={{ height: '15vh', position: 'relative' }}
        ref={scrollRef}>
        {isFinished ? (
          <Divider variant="middle">
            <span style={{ color: 'rgba(0,0,0,.5)' }}>채팅 시작</span>
          </Divider>
        ) : (
          <div
            style={{
              position: 'absolute',
            }}
            ref={infiniteRef}>
            <div style={{ height: 10, width: 200 }}></div>
          </div>
        )}
        {chatList.map((chat: ReceiveMessage, idx: number) => (
          <MessageBox key={idx}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CProfile
                nickname={memberDict[chat.userId]?.nickname}
                profileImg={memberDict[chat.userId]?.profileImg}
              />
              :{chat.content}
            </div>
            -{calDateTime(new Date(chat.timeStamp))}
          </MessageBox>
        ))}
      </Stack>
      <RoomMainChatBar value={message} onChange={setMessage} onSendMessage={onSendMessageHandler} />
    </RoomMainComponentContainer>
  );
}

export default RoomMainChat;

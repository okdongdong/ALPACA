import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainChatBar from './RoomMainChatBar';
import { Box, Divider, Stack, styled, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import dateToString, { dateToStringDate, dateToStringTime } from '../../../Lib/dateToString';
import CProfile from '../../Commons/CProfile';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';

interface ReceiveMessage {
  userId: number;
  chatId: string;
  content: string;
  timeStamp: string;
}

const MessageBox = styled('div')(({ theme }) => ({
  width: '100%',
}));

const options = {
  root: null, // 기본 null, 관찰대상의 부모요소를 지정
  rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
  threshold: 1, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소 };
};


function RoomMainChat() {
  let socket = new SockJS(`${process.env.REACT_APP_BASE_URL}/api/v1/chat`);
  var client = Stomp.over(socket);
  const token = localStorage.getItem('accessToken') || '';
  const header = {
    Authorization: token,
  };

  const { roomId } = useParams();
  const theme = useTheme();

  const memberDict = useSelector((state: any) => state.room.memberDict);
  const offsetId = useSelector((state: any) => state.room.offsetId);

  // 채팅 인피니티 스크롤 관련
  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: any) => state.account.userId);

  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState<ReceiveMessage[]>([]);

  const [page, setPage] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
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
    setIsConnecting(true);
    console.log('-----------소켓연결시도-----------');
    client.connect(
      header,
      (res) => {
        console.log('-----------연결성공!!-----------', res);
        setIsConnecting(false);
        getInitChat();
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
        setIsConnecting(false);
      },
    );
  };

  const wsDisconnect = () => {
    client.disconnect();
    setIsConnecting(false);
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
      setIsError(true);
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
      return (
        <>
          <div>{dateToStringTime(nowTime)}</div>
        </>
      );
    }
    return (
      <>
        <div>{dateToStringDate(nowTime, nowTime.getFullYear() !== new Date().getFullYear())}</div>
        <div>{dateToStringTime(nowTime)}</div>
      </>
    );
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
    const observer = new IntersectionObserver(infiniteHandler, options);
    if (infiniteRef.current !== null) {
      observer.observe(infiniteRef.current);
    }
    return () => observer.disconnect();
  }, [infiniteHandler]);

  useEffect(() => {
    if (!isGetPrevChat) {
      scrollRef?.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [chatList.length]);

  useEffect(() => {
    if (!client.connected && !isConnecting) {
      wsConnect();
    }
    scrollRef?.current?.scrollTo(0, 987654321);

    return () => {
      if (client.connected) {
        wsDisconnect();
      }
    };
  }, []);

  return (
    <RoomMainComponentContainer>
      <div style={{ height: 'calc(100% - 40px)' }}>
        <Stack
          spacing={1}
          className="scroll-box"
          sx={{ height: isMobile ? '83vh' : '100%', position: 'relative' }}
          ref={scrollRef}>
          {isError ? (
            <Divider variant="middle">
              <span style={{ color: 'rgba(0,0,0,.5)' }}>에러 발생 </span>
            </Divider>
          ) : isFinished ? (
            <Divider variant="middle">
              <span style={{ color: 'rgba(0,0,0,.5)' }}>채팅 시작</span>
            </Divider>
          ) : (
            <div
              style={{
                position: 'absolute',
              }}
              ref={infiniteRef}>
              <div style={{ height: 10, width: 10 }}></div>
            </div>
          )}
          <Box sx={{ position: 'absolute', width: '100%' }}>
            <MessageBox sx={{ height: 25 }}></MessageBox>
            {chatList.map((chat: ReceiveMessage, idx: number) => (
              <MessageBox key={idx}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}>
                  <CProfile
                    nickname={memberDict[chat.userId]?.nickname}
                    profileImg={memberDict[chat.userId]?.profileImg}
                  />
                  <span style={{ fontSize: 12, color: '#888888', textAlign: 'right' }}>
                    {calDateTime(new Date(chat.timeStamp))}
                  </span>
                </div>
                <Box sx={{ margin: 1 }}>
                  <span
                    style={{
                      backgroundColor: theme.palette.bg,
                      padding: 4,
                      marginLeft: 40,
                      borderRadius: 10,
                    }}>
                    {chat.content}
                  </span>
                </Box>
              </MessageBox>
            ))}
          </Box>
        </Stack>
        <RoomMainChatBar
          value={message}
          onChange={setMessage}
          onSendMessage={onSendMessageHandler}
        />
      </div>
    </RoomMainComponentContainer>
  );
}

export default RoomMainChat;

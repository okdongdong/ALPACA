import { useEffect, useRef, useState } from 'react';
import RoomMainComponentContainer from './RoomMainComponentContainer';
import RoomMainChatBar from './RoomMainChatBar';
import { Box, Divider, Stack, styled, useTheme, alpha, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { customAxios } from '../../../Lib/customAxios';
import { dateToStringDate, dateToStringTime } from '../../../Lib/dateToString';
import CProfile from '../../Commons/CProfile';
import { useParams } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Client } from '@stomp/stompjs';
import useReissue from '../../../Hooks/useReissue';

interface ReceiveMessage {
  userId: number;
  chatId: string;
  content: string;
  timeStamp: string;
}

const MessageBox = styled('div')(({ theme }) => ({
  width: '100%',
}));
const ChatScreen = styled('div')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.txt, 0.3),
  color: theme.palette.bg,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  position: 'absolute',
  borderRadius: 10,
  top: 0,
}));

const options = {
  root: null, // 기본 null, 관찰대상의 부모요소를 지정
  rootMargin: '0px', // 관찰하는 뷰포트의 마진 지정
  threshold: 1, // 관찰요소와 얼만큼 겹쳤을 때 콜백을 수행하도록 지정하는 요소 };
};
var client: Client | null = null;

function RoomMainChat() {
  const { roomId } = useParams();
  const theme = useTheme();
  const reissue = useReissue();

  const memberDict = useSelector((state: any) => state.room.memberDict);
  const offsetId = useSelector((state: any) => state.room.offsetId);

  // 채팅 인피니티 스크롤 관련
  const scrollRef = useRef<HTMLDivElement>(null);
  const infiniteRef = useRef<HTMLDivElement>(null);

  const userId = useSelector((state: any) => state.account.userId);

  const [message, setMessage] = useState('');
  const [chatList, setChatList] = useState<ReceiveMessage[]>([]);

  const [page, setPage] = useState<number>(0);

  // 채팅 웹소켓 연결 관련
  const [connectAttemptCnt, setConnectAttemptCnt] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  // 채팅 인피니티 스크롤 관련
  const [chatHeight, setChatHeight] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGetPrevChat, setIsGetPrevChat] = useState<boolean>(false);

  const connect = () => {
    // console.log('-----------소켓연결시도-----------');
    const token = localStorage.getItem('accessToken') || '';
    const header = {
      Authorization: token,
    };
    // 연결시도
    client = new Client({
      brokerURL: `${process.env.REACT_APP_BASE_URL?.replace('http', 'ws')}/api/v1/ch/websocket`, // 웹소켓 서버로 직접 접속
      connectHeaders: header,
      debug: function (str: any) {
        // console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        // console.log('-----------연결성공!!-----------');
        subscribe();
        setIsConnected(true);
        setConnectAttemptCnt(0);
        scrollRef?.current?.scrollTo(0, 987654321);
      },
      onStompError: (frame: any) => {
        // console.log('-----------연결실패!!-----------');
        console.error(frame);
        reissue();
        client?.deactivate();
        // console.log('retry count: ', connectAttemptCnt);
        setIsConnected(false);
        setConnectAttemptCnt((prev) => prev + 1);
        if (connectAttemptCnt < 20) connect();
      },
      onWebSocketError: (event: any) => {
        // console.log('-----------websocket error!!-----------');
        // console.log(event);
        // console.log('retry count: ', connectAttemptCnt);
        setIsConnected(false);
        setConnectAttemptCnt((prev) => prev + 1);
        if (connectAttemptCnt > 20) client?.deactivate();
      },
      onWebSocketClose: (event: any) => {
        // console.log('-----------websocket close!!-----------');
        // console.log(event);
        // console.log('retry count: ', connectAttemptCnt);
        setIsConnected(false);
        setConnectAttemptCnt((prev) => prev + 1);
        if (connectAttemptCnt > 20) client?.deactivate();
      },
    });

    client.activate();
    // console.log('client: ', client);
  };

  const disconnect = () => {
    // console.log('--------------disconnect', client);
    client?.deactivate();
  };

  const subscribe = () => {
    // console.log('--------------subscribe', client);
    client?.subscribe(`/sub/chat/study/${roomId}`, (res: any) => {
      const newMessage = JSON.parse(res.body);
      setChatList((prev) => [...prev, newMessage]);
    });
  };

  const sendMessage = () => {
    if (!message) return;
    if (!client?.connected) return;

    // console.log('Send message:' + message);
    const temp = { userId, studyId: roomId, content: message };
    client?.publish({
      destination: '/pub/chat/study',
      body: JSON.stringify(temp),
    });

    setMessage('');
  };

  // const reconnectHandler = () => {
  //   if (client?.active) return;

  //   connect();
  // };

  const onSendMessageHandler = () => {
    setIsGetPrevChat(false);
    sendMessage();
    // console.log('scrollRef: ', scrollRef);
  };

  const getPrevChat = async () => {
    // console.log('isFinished: ', isFinished, ' / isLoading: ', isLoading, ' / offsetId: ', offsetId);
    if (isFinished || isLoading) return;
    if (!offsetId) return;
    setIsLoading(true);
    setIsGetPrevChat(true);
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
      // console.log('scrollRef: ', scrollRef);
      const nowScrollHeight = scrollRef.current?.scrollHeight;
      // console.log('scrollHeight: ', nowScrollHeight, chatHeight);
      if (!!nowScrollHeight) {
        scrollRef.current.scrollTo(0, nowScrollHeight - chatHeight);
      }
      setChatHeight(nowScrollHeight || 1000);
      // console.log('page: ', page, ' / offsetId: ', offsetId);
      // console.log(res);
    } catch (e: any) {
      setIsError(true);
      // console.log(e);
    }
    setIsLoading(false);
  };

  const getInitChat = async () => {
    // console.log('=================채팅조회');
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
      // console.log('is InterSecting');
      getPrevChat();
    }
  };

  // 인피니티 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(infiniteHandler, options);
    if (infiniteRef.current !== null) {
      observer.observe(infiniteRef.current);
    }
    return () => observer.disconnect();
  }, [infiniteHandler]);

  // 이전 채팅 조회시 스크롤 보정
  useEffect(() => {
    if (!isGetPrevChat) {
      scrollRef?.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [chatList.length]);

  // 20번까지 재연결 시도에도 연결실패시 멈춤
  useEffect(() => {
    if (connectAttemptCnt > 20) client?.deactivate();
  }, [connectAttemptCnt]);

  // 웹소켓 연결
  useEffect(() => {
    getInitChat();
    connect();
    return () => disconnect();
  }, []);

  return (
    <RoomMainComponentContainer>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ height: 'calc(100% - 40px)' }}>
          <Stack
            spacing={1}
            className="scroll-box"
            sx={{ height: isMobile ? '83vh' : '100%', position: 'relative', minHeight: '20vh' }}
            ref={scrollRef}>
            {isConnected &&
              (isError ? (
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
              ))}
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
                    <span
                      style={{
                        fontSize: 12,
                        color: '#888888',
                        textAlign: 'right',
                        paddingRight: '12px',
                      }}>
                      {calDateTime(new Date(chat.timeStamp))}
                    </span>
                  </div>
                  <Box sx={{ margin: 1 }}>
                    <p
                      style={{
                        backgroundColor: theme.palette.bg,
                        padding: 4,
                        marginLeft: 40,
                        marginRight: 8,
                        borderRadius: 10,
                        width: 'fit-content',
                      }}>
                      {chat.content}
                    </p>
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
        {isConnected || (
          <ChatScreen>
            <Stack
              spacing={3}
              justifyContent="center"
              alignItems="center"
              sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ color: theme.palette.main }} />
              {/* <Box>
                <div>서버와 연결이 원활하지 않습니다.</div>
              </Box>
              <CBtn onClick={reconnectHandler} height="100%">
                다시연결
              </CBtn> */}
            </Stack>
          </ChatScreen>
        )}
      </div>
    </RoomMainComponentContainer>
  );
}

export default RoomMainChat;

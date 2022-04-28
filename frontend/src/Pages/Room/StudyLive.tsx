import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { OpenVidu, Session } from 'openvidu-browser';
import { useParams } from 'react-router-dom';
import { getToken } from '../../Lib/openvidu';
import { useSelector } from 'react-redux';
import UserModel from '../../Components/Room/StudyLive/user-model';
import RoomStudyLiveCamMatrix from '../../Components/Room/StudyLive/RoomStudyLiveCamMatrix';
import RoomStudyLiveCamList from '../../Components/Room/StudyLive/RoomStudyLiveCamList';
import RoomStudyLiveNavbar from '../../Components/Room/StudyLive/RoomStudyLiveNavbar';
import { setOV, setSession } from '../../Redux/openviduReducer';
import RoomStudyLiveCodeEditer from '../../Components/Room/StudyLive/RoomStudyLiveCodeEditer';
import RoomStudyLiveCamListItem from '../../Components/Room/StudyLive/RoomStudyLiveCamListItem';
import RoomStudyLiveMain from '../../Components/Room/StudyLive/RoomStudyLiveMain';
import RoomStudyLiveChat from '../../Components/Room/StudyLive/RoomStudyLiveChat';

function StudyLive() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // session 정보 (useState 이용시 rendering 문제로 값이 undefined로 읽히는 문제가 있어 변수로 선언.)
  let session: Session | undefined = undefined;
  let OV: OpenVidu | undefined = undefined;
  // 지운부분
  let tmpSession: Session | undefined = undefined;
  let tmpOV: OpenVidu | undefined = undefined;

  const reduxSession = useSelector((state: any) => state.openviduReducer.session);
  const reduxOV = useSelector((state: any) => state.openviduReducer.OV);
  useEffect(() => {
    OV = reduxOV || tmpOV || OV;
  });
  useEffect(() => {
    session = reduxSession || tmpSession || session;
  });

  // let OV: OpenVidu | undefined = undefined;
  const { roomId } = useParams();
  const [localUser, setLocalUser] = useState<UserModel>(new UserModel());
  const [nickname, setNickname] = useState<string>('성아영');
  const [mainStreamManager, setMainStreamManager] = useState<any | undefined>(undefined);
  const [publisher, setPublisher] = useState<any | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  const [openYjsDocs, setOpenYjsDocs] = useState<Boolean>(false);

  useEffect(() => {
    joinSession();
    return () => {
      leaveSession();
    };
  }, []);

  const joinSession = () => {
    OV = new OpenVidu();
    dispatch(setOV(OV));
    tmpOV = OV;
    if (!OV) return;
    session = OV.initSession();
    dispatch(setSession(session));
    tmpSession = session;

    setNickname('성아영');
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    subscribeToStreamCreated();

    connectToSession();
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    dispatch(setOV(undefined));
    dispatch(setSession(undefined));
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
  };

  const subscribeToStreamCreated = () => {
    if (!session) return;
    session.on('streamCreated', (event: any) => {
      const subscriber = session?.subscribe(event.stream, '');
      // var subscribers = this.state.subscribers;
      subscriber?.on('streamPlaying', (e: any) => {
        checkSomeoneShareScreen();
      });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType('remote');
      const nickname = event.stream.connection.data.split('%')[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      setSubscribers((prev) => {
        return [...prev, newUser];
      });
    });
  };
  const connectWebCam = async () => {
    if (!OV) return;
    if (!session) return;
    var devices = await OV.getDevices();
    var videoDevices = devices.filter((device: any) => device.kind === 'videoinput');

    let tmpPublisher = OV.initPublisher('', {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: false,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    });
    if (session && session?.capabilities.publish) {
      tmpPublisher.on('accessAllowed', () => {
        if (!session) return;
        session.publish(tmpPublisher);
      });
    }
    let localUser = new UserModel();
    localUser.setNickname(nickname);
    localUser.setAudioActive(tmpPublisher.stream.audioActive);
    localUser.setVideoActive(tmpPublisher.stream.videoActive);
    localUser.setScreenShareActive(false);
    localUser.setConnectionId(session.connection.connectionId);
    localUser.setStreamManager(tmpPublisher);
    console.log(tmpPublisher);
    console.log(localUser);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    setPublisher(localUser);
    sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
  };

  const toggleCam = () => {
    publisher.setVideoActive(!publisher.isVideoActive());
    publisher.getStreamManager().publishVideo(publisher.isVideoActive());
    sendSignalUserChanged({ isVideoActive: publisher.isVideoActive() });
    setPublisher(publisher);
  };

  const toggleMic = () => {
    publisher.setAudioActive(!publisher.isAudioActive());
    publisher.getStreamManager().publishAudio(publisher.isAudioActive());
    sendSignalUserChanged({ isAudioActive: publisher.isAudioActive() });
  };

  const sendSignalUserChanged = (data: any) => {
    if (!session) return;
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    session.signal(signalOptions);
  };

  const checkSomeoneShareScreen = () => {
    let isScreenShared;
    // return true if at least one passes the test
    isScreenShared =
      subscribers.some((user) => user.isScreenShareActive()) ||
      (publisher && publisher.isScreenShareActive());

    // 여기서 레이아웃 설정
  };

  const connectToSession = () => {
    getToken(roomId || '0').then((token) => {
      connect(String(token));
    });
  };

  const connect = (token: string) => {
    if (!session) return;
    session.connect(token, { clientData: nickname }).then(() => {
      connectWebCam();
    });
  };

  const screenShare = () => {
    const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
    if (!reduxOV) return;
    const tmpPublisher = reduxOV.initPublisher(
      '',
      {
        videoSource: videoSource,
        publishAudio: localUser.isAudioActive(),
        publishVideo: localUser.isVideoActive(),
        mirror: false,
      },
      (error: any) => {
        if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
          alert('show extension Dialog');
          // this.setState({ showExtensionDialog: true });
        } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
          alert('Your browser does not support screen sharing');
        } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
          alert('You need to enable screen sharing extension');
        } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
          alert('You need to choose a window or application to share');
        }
      },
    );
    tmpPublisher.once('accessAllowed', () => {
      if (!session) return;
      session.unpublish(publisher.getStreamManager());
      session.publish(tmpPublisher).then(() => {
        setPublisher((localPublisher: UserModel) => {
          localPublisher.setStreamManager(tmpPublisher);
          localPublisher.setScreenShareActive(true);
          return localPublisher;
        });
        sendSignalUserChanged({
          isScreenShareActive: publisher.isScreenShareActive(),
        });
      });
    });

    tmpPublisher.on('streamPlaying', () => {
      tmpPublisher.videos[0].video.parentElement.classList.remove('custom-class');
    });
  };

  const stopScreenShare = () => {
    if (!session) return;
    session.unpublish(publisher.getStreamManager());
    connectWebCam();
  };

  const subscribeToStreamDestroyed = () => {
    if (!session) return;
    // On every Stream destroyed...
    session.on('streamDestroyed', (event: any) => {
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream);
      setTimeout(() => {
        checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
    });
  };

  const deleteSubscriber = (stream: any) => {
    setSubscribers((remoteUsers: UserModel[]) => {
      return remoteUsers.filter((user) => user.getStreamManager().stream !== stream);
    });
  };
  const subscribeToUserChanged = () => {
    if (!session) return;
    session.on('signal:userChanged', (event: any) => {
      setSubscribers((remoteUsers: UserModel[]) => {
        return remoteUsers.map((user: UserModel) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
            console.log('EVENTO REMOTE: ', event.data);
            if (data.isAudioActive !== undefined) {
              user.setAudioActive(data.isAudioActive);
            }
            if (data.isVideoActive !== undefined) {
              user.setVideoActive(data.isVideoActive);
            }
            if (data.nickname !== undefined) {
              user.setNickname(data.nickname);
            }
            if (data.isScreenShareActive !== undefined) {
              user.setScreenShareActive(data.isScreenShareActive);
            }
          }
          return user;
        });
      });
    });
  };

  return (
    <>
      <div style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div className="align_column_center" style={{ height: '100%', width: '100%' }}>
          {publisher !== undefined &&
            publisher.getStreamManager() !== undefined &&
            (openYjsDocs || mainStreamManager ? (
              <div
                style={{
                  position: 'absolute',
                  left: '1vw',
                  top: '50%',
                  transform: 'translate(0, -50%)',
                }}>
                <RoomStudyLiveCamList users={[publisher, ...subscribers]} />
              </div>
            ) : (
              <div style={{ height: '80vh', width: '80vw' }}>
                <RoomStudyLiveCamMatrix users={[publisher, ...subscribers]} />
              </div>
            ))}
          <div
            style={{
              height: 'calc(100% - 15vh)',
              position: 'absolute',
              right: '1vw',
              width: '100%',
              paddingLeft: '10vw',
              paddingRight: '2vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RoomStudyLiveMain
              mainStreamManager={mainStreamManager}
              openYjsDocs={openYjsDocs}
              setOpenYjsDocs={setOpenYjsDocs}
            />
          </div>
        </div>
        {publisher !== undefined && publisher.getStreamManager() !== undefined && (
          <>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translate(-50%)',
              }}>
              <RoomStudyLiveNavbar
                user={publisher}
                toggleCam={toggleCam}
                toggleMic={toggleMic}
                screenShare={screenShare}
                stopScreenShare={stopScreenShare}
              />
            </div>
            <div style={{ position: 'absolute', bottom: '0', right: '2vw' }}>
              <RoomStudyLiveChat />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default StudyLive;

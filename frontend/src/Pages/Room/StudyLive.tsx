import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { OpenVidu, Session } from 'openvidu-browser';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getToken } from '../../Lib/openvidu';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import UserModel from '../../Components/Room/StudyLive/user-model';
import RoomStudyLiveCamMatrix from '../../Components/Room/StudyLive/RoomStudyLiveCamMatrix';
import RoomStudyLiveCamList from '../../Components/Room/StudyLive/RoomStudyLiveCamList';
import RoomStudyLiveNavbar from '../../Components/Room/StudyLive/RoomStudyLiveNavbar';
import RoomStudyLiveAppbar from '../../Components/Room/StudyLive/RoomStudyLiveAppbar';
import RoomStudyLiveMain from '../../Components/Room/StudyLive/RoomStudyLiveMain';
import RoomStudyLiveChat from '../../Components/Room/StudyLive/RoomStudyLiveChat';
import RoomStudyLiveTimer from '../../Components/Room/StudyLive/RoomStudyLiveTimer';
import {
  setOVForCamera,
  setOVForScreen,
  setSessionForCamera,
  setSessionForScreen,
  setMainUser,
} from '../../Redux/openviduReducer';

function StudyLive() {
  const theme = useTheme();
  const dispatch = useDispatch();

  // session 정보 (useState 이용시 rendering 문제로 값이 undefined로 읽히는 문제가 있어 변수로 선언.)
  let sessionForCamera: Session | undefined = undefined;
  let OVForCamera: OpenVidu | undefined = undefined;
  let sessionForScreen: Session | undefined = undefined;
  let OVForScreen: OpenVidu | undefined = undefined;
  // 지운부분
  let tmpSessionForCamera: Session | undefined = undefined;
  let tmpOVForCamera: OpenVidu | undefined = undefined;
  let tmpSessionForScreen: Session | undefined = undefined;
  let tmpOVForScreen: OpenVidu | undefined = undefined;

  const ReduxSessionForCamera = useSelector((state: any) => state.openvidu.sessionForCamera);
  const ReduxOVForCamera = useSelector((state: any) => state.openvidu.OVForCamera);
  const ReduxSessionForScreen = useSelector((state: any) => state.openvidu.sessionForScreen);
  const ReduxOVForScreen = useSelector((state: any) => state.openvidu.OVForScreen);
  const nickname = useSelector((state: any) => state.account.nickname);
  const mainUser = useSelector((state: any) => state.openvidu.mainUser);
  const constraints = useSelector((state: any) => state.openvidu.constraints);

  useEffect(() => {
    OVForCamera = ReduxOVForCamera || tmpOVForCamera;
    sessionForCamera = ReduxSessionForCamera || tmpSessionForCamera;
    OVForScreen = ReduxOVForScreen || tmpOVForScreen;
    sessionForScreen = ReduxSessionForScreen || tmpSessionForScreen;
  });

  // let OV: OpenVidu | undefined = undefined;
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [publisher, setPublisher] = useState<UserModel | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<UserModel[]>([]);

  const [openYjsDocs, setOpenYjsDocs] = useState<Boolean>(true);
  const subseribersRef = useRef<UserModel[]>([]);

  useEffect(() => {
    if (!location.state) {
      Swal.fire({
        title: '잘못된 접근입니다.',
        icon: 'warning',
        background: theme.palette.bg,
        confirmButtonColor: theme.palette.main,
        confirmButtonText: '확인',
      }).then(() => {
        navigate(-1);
      });
      return;
    }
    joinSession();
    window.addEventListener('beforeunload', leaveSession);
    return () => {
      window.removeEventListener('beforeunload', leaveSession);
      leaveSession();
    };
  }, []);

  const joinSession = () => {
    OVForCamera = new OpenVidu();
    // OVForCamera.enableProdMode();
    OVForScreen = new OpenVidu();
    OVForScreen.enableProdMode();

    dispatch(setOVForCamera(OVForCamera));
    dispatch(setOVForScreen(OVForScreen));

    tmpOVForCamera = OVForCamera;
    tmpOVForScreen = OVForScreen;

    if (!OVForCamera || !OVForScreen) return;

    sessionForCamera = OVForCamera.initSession();
    sessionForScreen = OVForScreen.initSession();
    dispatch(setSessionForCamera(sessionForCamera));
    dispatch(setSessionForScreen(sessionForScreen));

    tmpSessionForCamera = sessionForCamera;
    tmpSessionForScreen = sessionForScreen;

    dispatch(setMainUser(undefined));
    setPublisher(undefined);
    setSubscribers([]);
    subscribeToStreamCreated();

    connectToSession();
  };

  const leaveSession = useCallback(() => {
    if (sessionForCamera) {
      sessionForCamera.disconnect();
    }
    if (sessionForScreen) {
      sessionForScreen.disconnect();
    }

    // Empty all properties...
    dispatch(setSessionForCamera(undefined));
    dispatch(setSessionForScreen(undefined));

    dispatch(setMainUser(undefined));
    setPublisher(undefined);
    setSubscribers([]);
  }, []);
  const exitStudyLive = () => {
    Swal.fire({
      title: '정말 나가시겠습니까?',
      icon: 'warning',
      color: theme.palette.txt,
      background: theme.palette.bg,
      showCancelButton: true,
      cancelButtonColor: theme.palette.main,
      cancelButtonText: '취소',
      confirmButtonColor: theme.palette.warn,
      confirmButtonText: '확인',
      heightAuto: false,
      backdrop: `
        z-index: 2000`,
    }).then((res) => {
      if (res.isConfirmed) {
        leaveSession();
        navigate(`/room/${roomId}`);
      }
    });
  };
  const subscribeToStreamCreated = () => {
    if (!sessionForCamera || !sessionForScreen) return;
    sessionForCamera.on('streamCreated', (event: any) => {
      const newUser =
        checkSubscribers(JSON.parse(event.stream.connection.data).clientData) || new UserModel();
      if (event.stream.typeOfVideo === 'SCREEN') {
        const subscriber = sessionForScreen?.subscribe(event.stream, '');
        newUser.setScreenStreamManager(subscriber);
      } else {
        const subscriber = sessionForCamera?.subscribe(event.stream, '');
        subscriber?.on('streamPlaying', (e: any) => {
          checkSomeoneShareScreen();
        });
        newUser.setStreamManager(subscriber);
        newUser.setConnectionId(event.stream.connection.connectionId);
        newUser.setType('remote');
        const nickname = event.stream.connection.data.split('%')[0];
        newUser.setNickname(JSON.parse(nickname).clientData);
        setSubscribers((prev) => {
          subseribersRef.current = [...prev, newUser];
          return [...prev, newUser];
        });
      }
    });
  };

  const checkSubscribers = (nickname: string) => {
    return subseribersRef.current.filter((user: UserModel) => {
      return user.getNickname() === nickname;
    })[0];
  };

  const connectWebCam = async () => {
    if (!OVForCamera) return;
    if (!sessionForCamera) return;

    let cameraPublisher = OVForCamera.initPublisher('', {
      ...constraints,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    });
    if (sessionForCamera && sessionForCamera?.capabilities.publish) {
      cameraPublisher.on('accessAllowed', () => {
        if (!sessionForCamera) return;
        sessionForCamera.publish(cameraPublisher);
      });
    }
    let localUser = new UserModel();
    localUser.setNickname(nickname);
    localUser.setAudioActive(cameraPublisher.stream.audioActive);
    localUser.setVideoActive(cameraPublisher.stream.videoActive);
    localUser.setScreenShareActive(false);
    localUser.setConnectionId(sessionForCamera.connection.connectionId);
    localUser.setStreamManager(cameraPublisher);

    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    setPublisher(localUser);
    sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
  };

  const toggleCam = () => {
    if (!publisher) return;
    publisher.setVideoActive(!publisher.isVideoActive());
    publisher.getStreamManager().publishVideo(publisher.isVideoActive());
    sendSignalUserChanged({ isVideoActive: publisher.isVideoActive() });
    setPublisher(publisher);
  };

  const toggleMic = () => {
    if (!publisher) return;
    publisher.setAudioActive(!publisher.isAudioActive());
    publisher.getStreamManager().publishAudio(publisher.isAudioActive());
    sendSignalUserChanged({ isAudioActive: publisher.isAudioActive() });
  };

  const sendSignalUserChanged = (data: any) => {
    if (!sessionForCamera) return;
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    sessionForCamera.signal(signalOptions);
  };

  const checkSomeoneShareScreen = () => {
    return (
      subscribers.some((user) => user.isScreenShareActive()) ||
      (publisher && publisher.isScreenShareActive())
    );
  };

  const connectToSession = () => {
    getToken(roomId || '0').then((token) => {
      connectSessionToCamera(String(token));
    });
    getToken(roomId || '0').then((token) => {
      connectSessionToScreen(String(token));
    });
  };

  const connectSessionToCamera = (token: string) => {
    if (!sessionForCamera) return;
    sessionForCamera.connect(token, { clientData: nickname }).then(() => {
      connectWebCam();
    });
  };

  const connectSessionToScreen = (token: string) => {
    if (!sessionForScreen) return;
    sessionForScreen.connect(token, { clientData: nickname });
  };

  const screenShare = () => {
    const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
    if (!OVForScreen) return;
    if (!publisher) return;
    OVForScreen.initPublisherAsync(
      '',
      {
        videoSource: videoSource,
        publishAudio: publisher.isAudioActive(),
        publishVideo: publisher.isVideoActive(),
        mirror: false,
      },
      // (error: any) => {
      //   if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
      //     alert('show extension Dialog');
      //     // this.setState({ showExtensionDialog: true });
      //   } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
      //     alert('Your browser does not support screen sharing');
      //   } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
      //     alert('You need to enable screen sharing extension');
      //   } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
      //     alert('You need to choose a window or application to share');
      //   }
      // },
    )
      .then((screenPublisher) => {
        screenPublisher.once('accessAllowed', () => {
          if (!sessionForScreen) return;
          sessionForScreen.publish(screenPublisher).then(() => {
            setPublisher((localPublisher: UserModel | undefined) => {
              if (!localPublisher) return;
              localPublisher.setScreenStreamManager(screenPublisher);
              localPublisher.setScreenShareActive(true);
              return localPublisher;
            });
            sendSignalUserChanged({
              isScreenShareActive: publisher.isScreenShareActive(),
            });
          });
        });

        screenPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener('ended', () => {
            stopScreenShare();
          });
      })
      .catch((error: any) => {
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
      });
    // screenPublisher.on('streamPlaying', () => {
    //   screenPublisher.videos[0].video.parentElement.classList.remove('custom-class');
    // });
  };

  const stopScreenShare = () => {
    if (!sessionForScreen) return;
    if (!publisher) return;
    sessionForScreen.unpublish(publisher.getScreenStreamManager());

    setPublisher((localPublisher: UserModel | undefined) => {
      if (!localPublisher) return;
      localPublisher.setScreenStreamManager(undefined);
      localPublisher.setScreenShareActive(false);
      return localPublisher;
    });
    sendSignalUserChanged({
      isScreenShareActive: publisher.isScreenShareActive(),
    });
  };

  const subscribeToStreamDestroyed = () => {
    if (!sessionForCamera) return;
    // On every Stream destroyed...
    sessionForCamera.on('streamDestroyed', (event: any) => {
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
    if (!sessionForCamera || !sessionForScreen) return;
    sessionForCamera.on('signal:userChanged', (event: any) => {
      setSubscribers((remoteUsers: UserModel[]) => {
        return remoteUsers.map((user: UserModel) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
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
              if (data.isScreenShareActive === false) {
                user.setScreenStreamManager(null);
              }
            }
          }
          return user;
        });
      });
    });
    sessionForScreen.on('signal:userChanged', (event: any) => {
      setSubscribers((remoteUsers: UserModel[]) => {
        return remoteUsers.map((user: UserModel) => {
          if (user.getConnectionId() === event.from.connectionId) {
            const data = JSON.parse(event.data);
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
              if (data.isScreenShareActive === false) {
                user.setScreenStreamManager(null);
              }
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
          <div
            style={{
              height: 'calc(100% - 15vh)',
              position: 'absolute',
              left: 0,
              width: '100%',
              paddingLeft: '2vw',
              paddingRight: '10vw',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RoomStudyLiveMain
              mainStreamManager={mainUser}
              openYjsDocs={openYjsDocs}
              setOpenYjsDocs={setOpenYjsDocs}
            />
          </div>
          {publisher !== undefined &&
            publisher.getStreamManager() !== undefined &&
            (openYjsDocs || mainUser ? (
              <div
                style={{
                  position: 'absolute',
                  right: '1vw',
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
            <div style={{ position: 'absolute', top: '1vh', right: '2vw' }}>
              <RoomStudyLiveAppbar exitStudyLive={exitStudyLive} />
            </div>
            <div style={{ position: 'absolute', top: '1vh', left: '2vw' }}>
              <RoomStudyLiveTimer />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default StudyLive;

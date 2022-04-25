import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { OpenVidu, Session } from 'openvidu-browser';
import { useParams } from 'react-router-dom';
import { getToken } from '../../Lib/openvidu';
import { setSession } from '../../Redux/openvidu/openviduActions';
import { useSelector } from 'react-redux';
import UserModel from '../../Components/Room/StudyLive/user-model';
import RoomStudyLiveCamMatrix from '../../Components/Room/StudyLive/RoomStudyLiveCamMatrix';
import RoomStudyLiveNavbar from '../../Components/Room/StudyLive/RoomStudyLiveNavbar';

function StudyLive() {
  const dispatch = useDispatch();

  // session 정보 (useState 이용시 rendering 문제로 값이 undefined로 읽히는 문제가 있어 변수로 선언.)
  let session: any = undefined;
  let tmpSession: Session | undefined = undefined;
  const reduxSession = useSelector((state: any) => {
    return state.openviduReducer.session;
  });

  let OV: OpenVidu | undefined = undefined;
  const { roomId } = useParams();
  const [localUser, setLocalUser] = useState<UserModel>(new UserModel());
  const [nickname, setNickname] = useState<string>('성아영');
  const [mainStreamManager, setMainStreamManager] = useState<any | undefined>(undefined);
  const [publisher, setPublisher] = useState<any | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  useEffect(() => {
    joinSession();
    return () => {
      leaveSession();
    };
  }, []);

  const joinSession = () => {
    OV = new OpenVidu();
    const session = OV.initSession();
    dispatch(setSession(session));
    tmpSession = session;

    setNickname('성아영');
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    subscribeToStreamCreated();
    subscribeToStreamDestroyed();
    connectToSession();
  };

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties...
    OV = undefined;
    dispatch(setSession(undefined));
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
  };

  const subscribeToStreamCreated = () => {
    if (!session) return;
    session.on('streamCreated', (event: any) => {
      const subscriber = session.subscribe(event.stream, undefined);
      // var subscribers = this.state.subscribers;
      subscriber.on('streamPlaying', (e: any) => {
        checkSomeoneShareScreen();
        subscriber.videos[0].video.parentElement.classList.remove('custom-class');
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
    var devices = await OV.getDevices();
    var videoDevices = devices.filter((device: any) => device.kind === 'videoinput');

    let publisher = OV.initPublisher('', {
      audioSource: undefined,
      videoSource: videoDevices[0].deviceId,
      publishAudio: true,
      publishVideo: true,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    });
    if (session?.capabilities.publish) {
      publisher.on('accessAllowed', () => {
        session.publish(publisher).then(() => {
          console.log('connected');
        });
      });
    }
    let localUser = new UserModel();
    localUser.setNickname(nickname);
    localUser.setConnectionId(session.connection.connectionId);
    localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    console.log(localUser);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    sendSignalUserChanged({ isScreenShareActive: localUser.isScreenShareActive() });
    setPublisher(localUser);
  };

  const toggleCam = () => {
    publisher.setVideoActive(!publisher.isVideoActive());
    publisher.getStreamManager().publishVideo(publisher.isVideoActive());
    sendSignalUserChanged({ isVideoActive: publisher.isVideoActive() });
  };

  const toggleMic = () => {
    publisher.setAudioActive(!publisher.isAudioActive());
    publisher.getStreamManager().publishAudio(publisher.isAudioActive());
    sendSignalUserChanged({ isAudioActive: publisher.isAudioActive() });
  };

  const sendSignalUserChanged = (data: any) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    console.log(session);
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
      connect(token);
    });
  };

  const connect = (token: unknown) => {
    session.connect(token, { clientData: nickname }).then(() => {
      connectWebCam();
      console.log('connected');
    });
  };

  // const updateSubscribers = () => {
  //   var subscribers = this.remotes;
  //   this.setState(
  //     {
  //       subscribers: subscribers,
  //     },
  //     () => {
  //       if (this.state.localUser) {
  //         this.sendSignalUserChanged({
  //           isAudioActive: this.state.localUser.isAudioActive(),
  //           isVideoActive: this.state.localUser.isVideoActive(),
  //           nickname: this.state.localUser.getNickname(),
  //           isScreenShareActive: this.state.localUser.isScreenShareActive(),
  //         });
  //       }
  //     },
  //   );
  // };
  const screenShare = () => {
    const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
    if (!OV) return;
    const tmpPublisher = OV.initPublisher(
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
    if (!publisher) return;
    tmpPublisher.once('accessAllowed', () => {
      session.unpublish(localUser.getStreamManager());
      publisher.setStreamManager(publisher);
      session.publish(localUser.getStreamManager()).then(() => {
        publisher.setScreenShareActive(true);
        sendSignalUserChanged({
          isScreenShareActive: localUser.isScreenShareActive(),
        });
      });
    });

    tmpPublisher.on('streamPlaying', () => {
      publisher.videos[0].video.parentElement.classList.remove('custom-class');
    });
  };

  const stopScreenShare = () => {
    session.unpublish(localUser.getStreamManager());
    connectWebCam();
  };

  const subscribeToStreamDestroyed = () => {
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
    const remoteUsers = subscribers;
    const userStream = remoteUsers.filter((user) => user.getStreamManager().stream === stream)[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      setSubscribers(remoteUsers);
      console.log(remoteUsers);
    }
  };
  const subscribeToUserChanged = () => {
    session.on('signal:userChanged', (event: any) => {
      let remoteUsers = subscribers;
      remoteUsers.forEach((user: UserModel) => {
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
      });
      setSubscribers(remoteUsers);
    });
  };

  useEffect(() => {
    // session = reduxSession || tmpSession;
    console.log('dd');
    console.log('하이하이');
  }, [tmpSession, reduxSession]);

  return (
    <>
      {publisher !== undefined && publisher.getStreamManager() !== undefined && (
        <RoomStudyLiveCamMatrix users={[publisher, ...subscribers]} />
      )}
      <RoomStudyLiveNavbar
        user={publisher}
        toggleCam={toggleCam}
        toggleMic={toggleMic}
        screenShare={screenShare}
        stopScreenShare={stopScreenShare}
      />
    </>
  );
}

export default StudyLive;

class UserModel {
  connectionId;
  audioActive;
  videoActive;
  screenShareActive;
  nickname;
  streamManager: any;
  screenStreamManager: any;
  type; // 'remote' | 'local'

  constructor() {
    this.connectionId = '';
    this.audioActive = true;
    this.videoActive = true;
    this.screenShareActive = false;
    this.nickname = '';
    this.streamManager = null;
    this.screenStreamManager = null;
    this.type = 'local';
  }

  isAudioActive() {
    return this.audioActive;
  }

  isVideoActive() {
    return this.videoActive;
  }

  isScreenShareActive() {
    return this.screenShareActive;
  }

  getConnectionId() {
    return this.connectionId;
  }

  getNickname() {
    return this.nickname;
  }

  getStreamManager() {
    return this.streamManager;
  }

  getScreenStreamManager() {
    return this.screenStreamManager;
  }

  isLocal() {
    return this.type === 'local';
  }
  isRemote() {
    return !this.isLocal();
  }
  setAudioActive(isAudioActive: boolean) {
    this.audioActive = isAudioActive;
  }
  setVideoActive(isVideoActive: boolean) {
    this.videoActive = isVideoActive;
  }
  setScreenShareActive(isScreenShareActive: boolean) {
    this.screenShareActive = isScreenShareActive;
  }
  setStreamManager(streamManager: any) {
    this.streamManager = streamManager;
  }
  setScreenStreamManager(screenStreamManager: any) {
    this.screenStreamManager = screenStreamManager;
  }
  setConnectionId(conecctionId: string) {
    this.connectionId = conecctionId;
  }
  setNickname(nickname: string) {
    this.nickname = nickname;
  }
  setType(type: string) {
    if (type === 'local' || type === 'remote') {
      this.type = type;
    }
  }
}

export default UserModel;

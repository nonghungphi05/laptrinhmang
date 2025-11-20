const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

export class RtcClient {
  constructor({ store, wsClient }) {
    this.store = store;
    this.wsClient = wsClient;
    this.peerConnections = new Map();
    this.remoteStreams = new Map();
    this.localStream = null;
    this.roomId = null;
    this.listeners = new Set();
    this.micEnabled = true;
    this.camEnabled = true;
    this.onIncomingCall = null;
    this.onCallEnd = null;
    this.hadRemotePeer = false;
  }
  
  setIncomingCallHandler(handler) {
    this.onIncomingCall = handler;
  }

  setCallEndHandler(handler) {
    this.onCallEnd = handler;
  }

  onUpdate(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit() {
    const payload = {
      localStream: this.localStream,
      remoteStreams: Array.from(this.remoteStreams.entries())
    };
    this.listeners.forEach((listener) => listener(payload));
  }

  async start(roomId, isAnswering = false) {
    this.roomId = roomId;
    this.hadRemotePeer = false;
    const stream = await this.ensureLocalStream();
    this.store.setCallState({ activeRoomId: roomId });
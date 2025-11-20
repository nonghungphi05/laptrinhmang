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

     if (!isAnswering) {
      const state = this.store.getState();
      const callerName = state.user?.displayName || state.user?.phone || 'Người dùng';
      this.wsClient.sendRtc({ t: 'rtc-call-start', roomId, callerName });
    }
    
   
    this.wsClient.sendRtc({ t: 'rtc-join', roomId });
    
    return stream;
  }

  async ensureLocalStream() {
    if (!this.localStream) {
      console.log('🎥 Requesting camera and microphone access...');
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('✅ Local stream obtained:', this.localStream.getTracks().map(t => `${t.kind}: ${t.enabled}`));
        this.emit();
      } catch (err) {
        console.error('❌ Failed to get local stream:', err.name, err.message);
        
        // Show user-friendly error message
        if (err.name === 'NotAllowedError') {
          alert('Vui lòng cho phép truy cập camera và microphone để thực hiện cuộc gọi.');
        } else if (err.name === 'NotReadableError') {
          alert('Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng khác và thử lại.');
        } else if (err.name === 'NotFoundError') {
          alert('Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra thiết bị của bạn.');
        } else {
          alert('Không thể truy cập camera/microphone: ' + err.message);
        }
        
        throw err;
      }
    }
    return this.localStream;
  }
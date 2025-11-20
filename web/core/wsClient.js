export class WsClient {
  constructor({ store }) {
    this.store = store;
    this.ws = null;
    this.token = null;
    this.queue = [];
    this.retry = 0;
    this.rtcHandler = null;
  }

  setRtcHandler(handler) {
    this.rtcHandler = handler;
  }

  connect(token) {
    this.token = token;
    if (this.ws) {
      this.ws.close();
    }
    this.open();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = null;
    this.queue = [];
  }

  open() {
    if (!this.token) return;
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    this.ws = new WebSocket(`${protocol}://${window.location.host}/ws?token=${this.token}`);
    this.ws.onopen = () => {
      this.retry = 0;
      this.flushQueue();
    };
    this.ws.onmessage = (event) => this.handleMessage(event);
    this.ws.onclose = () => {
      const delay = Math.min(5000, 1000 * 2 ** this.retry);
      this.retry += 1;
      setTimeout(() => this.open(), delay);
    };
  }
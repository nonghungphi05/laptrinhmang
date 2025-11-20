export class Store {
  constructor() {
    let initialView = 'chat';
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        initialView = window.localStorage.getItem('messzola_view') || 'chat';
      }
    } catch (err) {
      // Ignore storage errors; fall back to default view
    }
    this.state = {
      token: null,
      user: null,
      friends: [],
      friendRequests: [],
      rooms: [],
      currentRoomId: null,
      messages: {},
      typing: {},
      view: initialView,
      call: { activeRoomId: null, peers: [] },
      onlineUsers: new Set() // Track online user IDs
    };
    this.listeners = new Set();
  }
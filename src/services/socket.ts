import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false, // will connect when component or context mounts
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      timeout: 5000
    });

    socketInstance.on('connect', () => {
      console.log('[WebSocket Gateway] Connected to backend live server at', SOCKET_URL);
    });

    socketInstance.on('connect_error', (err) => {
      // Graceful silence in demo/standalone mode
      // console.debug('[WebSocket Gateway] Server offline or connecting:', err.message);
    });

    socketInstance.on('disconnect', (reason) => {
      // console.debug('[WebSocket Gateway] Disconnected:', reason);
    });
  }
  return socketInstance;
};

/* ==========================================================================
   ROOM SUBSCRIPTIONS
   ========================================================================== */

export const joinTableRoom = (tableNumber: string) => {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('join:table', tableNumber);
  }
};

export const leaveTableRoom = (tableNumber: string) => {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('leave:table', tableNumber);
  }
};

export const joinKdsRoom = () => {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('join:kds');
  }
};

export const joinAdminRoom = () => {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit('join:admin');
  }
};

import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: {
        userId: user.id
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return socket;
};

export default useSocket;
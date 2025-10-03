'use client';

import { useSocket } from '@/providers/SocketProvider';
import Login from '@/components/login';

export default function Home() {
  const { socket, isConnected } = useSocket();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</h1>
      <Login />
    </div>
  );
}

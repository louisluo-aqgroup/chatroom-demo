'use client';

import { useSocket } from '@/providers/SocketProvider';

export default function Home() {
  const { socket, isConnected } = useSocket();
  return (
    <div>
      <h1>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</h1>
    </div>
  );
}

'use client';

import { useSocket } from '@/providers/socket';
import Login from '@/components/login';
import { VoiceTestPage } from '@/components/VoiceTestPage';

export default function Home() {
  const { isConnected } = useSocket();

  return (
    <div>
      <VoiceTestPage />

      <div style={{ padding: '20px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
        <h2>Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</h2>
        <Login />
      </div>
    </div>
  );
}

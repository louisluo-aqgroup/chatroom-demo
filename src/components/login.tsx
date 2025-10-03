'use client';

import { useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/utils/firebase';

export default function Login() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('登入失敗:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>載入中...</div>;
  }

  return (
    <div style={{ marginTop: '20px' }}>
      {!user ? (
        <button
          onClick={loginWithGoogle}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          使用 Google 登入
        </button>
      ) : (
        <div>
          <h2>歡迎, {user.displayName}</h2>
          <p>Email: {user.email}</p>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#db4437',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            登出
          </button>
        </div>
      )}
    </div>
  );
}

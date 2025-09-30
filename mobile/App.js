import React, { useEffect, useState } from 'react';
import PublicLanding from './src/screens/PublicLanding';
import Login from './src/screens/auth/Login';
import { loadAuth, saveAuth } from './src/lib/authStorage';

export default function App() {
  const [route, setRoute] = useState('landing'); // 'landing' | 'login'
  const [auth, setAuth] = useState(null); // { token, user }
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await loadAuth();
      if (stored?.token) {
        setAuth(stored);
        setRoute('landing');
      }
      setBootstrapped(true);
    })();
  }, []);

  if (!bootstrapped) return null;

  if (route === 'login') {
    return (
      <Login
        onSuccess={(data) => {
          // save for 7 days
          saveAuth(data).then(setAuth);
          // TODO: Navigate to app home once authenticated
          setRoute('landing');
        }}
      />
    );
  }

  return (
    <PublicLanding
      onJoin={() => setRoute('login')}
      onStart={() => setRoute('login')}
    />
  );
}

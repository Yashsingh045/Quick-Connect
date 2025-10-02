import React, { useEffect, useState } from 'react';
import PublicLanding from './src/screens/PublicLanding';
import PrivateLanding from './src/screens/PrivateLanding';
import MeetingsList from './src/screens/MeetingsList';
import MeetingRoom from './src/screens/MeetingRoom';
import Settings from './src/screens/Settings';

export default function App() {
  // const [route, setRoute] = useState('landing'); 
  // const [auth, setAuth] = useState(null); 
  // const [currentMeeting, setCurrentMeeting] = useState(null);
  // const [bootstrapped, setBootstrapped] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const stored = await loadAuth();
  //     if (stored?.token) {
  //       setAuth(stored);
  //       setRoute('private');
  //     }
  //     setBootstrapped(true);
  //   })();
  // }, []);

  // if (!bootstrapped) return null;

  // if (route === 'login') {
  //   return (
  //     <Login
  //       onSuccess={(data) => {
  //         // save for 7 days
  //         saveAuth(data).then(setAuth);
  //         // Navigate to private landing once authenticated
  //         setRoute('private');
  //       }}
  //     />
  //   );
  // }

  // if (route === 'meetings') {
  //   return (
  //     <MeetingsList
  //       auth={auth}
  //       onBack={() => setRoute('private')}
  //       onJoinMeeting={(meeting) => {
  //         setCurrentMeeting(meeting);
  //         setRoute('meeting-room');
  //       }}
  //     />
  //   );
  // }

  // if (route === 'meeting-room') {
  //   return (
      // <MeetingRoom
      //   meeting={currentMeeting}
      //   auth={auth}
      //   onBack={() => setRoute('meetings')}
      //   onEndMeeting={() => {
      //     setCurrentMeeting(null);
      //     setRoute('meetings');
      //   }}
      // />
  //   );
  // }

  // if (route === 'settings') {
  //   return (
      // <Settings
      //   auth={auth}
      //   onBack={() => setRoute('private')}
      //   onNavigate={(screen) => setRoute(screen)}
      // />
  //   );
  // }

  // // If authenticated, show private landing
  // if (auth?.token) {
  //   return (
      // <PrivateLanding
      //   auth={auth}
      //   onLogout={async () => {
      //     await clearAuth();
      //     setAuth(null);
      //     setRoute('landing');
      //   }}
      //   onViewMeetings={() => setRoute('meetings')}
      //   onNavigate={(screen) => setRoute(screen)}
      // />
  //   );
  // }

  // Otherwise show public landing
  return (
  


    // <Settings
    //     onBack={() => setRoute('private')}
    //     onNavigate={(screen) => setRoute(screen)}
    //   />


    // <PrivateLanding
    //     onViewMeetings={() => setRoute('meetings')}
    //     onNavigate={(screen) => setRoute(screen)}
    //   />



    <PublicLanding
      onJoin={() => setRoute('login')}
      onStart={() => setRoute('login')}
    />




  //   <MeetingsList
  //   onBack={() => setRoute('private')}
  //   onJoinMeeting={(meeting) => {
  //     setCurrentMeeting(meeting);
  //     setRoute('meeting-room');
  //   }}
  // />



    // <MeetingRoom

    // onBack={() => setRoute('meetings')}
    // onEndMeeting={() => {
    //   setCurrentMeeting(null);
    //   setRoute('meetings');
    // }}
  // />


  );
}

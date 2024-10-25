import React from 'react';
import './App.css';

const App = () => {
  const askNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    } else {
      console.log('Notification permission denied.');
    }
  };

  const sendNotification = () => {
    const notification = new Notification('Hello from PWA', {
      body: 'This is a test notification!',
    });
    notification.onclick = () => {
      console.log('Notification clicked');
    };
  };

  return (
    <div className="App">
      <h1>My PWA with Notifications</h1>
      <button onClick={askNotificationPermission}>
        Ask for Notification Permission
      </button>
      <button onClick={sendNotification}>
        Send Notification
      </button>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';

function App() {
  const [isNotificationSupported, setIsNotificationSupported] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [age, setAge] = useState('');
  const [remainingTime, setRemainingTime] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [timerInterval, setTimerInterval] = useState(null);
  const [title, setTitle] = useState('Notification Title');
  const [icon, setIcon] = useState('path/to/icon.png'); // Provide a valid icon path

  useEffect(() => {
    if ('Notification' in window) {
      setIsNotificationSupported(true);
    }
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const toggleNotifications = () => {
    if (isNotificationSupported) {
      if (isNotificationsEnabled) {
        setIsNotificationsEnabled(false);
        setNotificationMessage('Notifications have been turned off.');
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setIsNotificationsEnabled(true);
            setNotificationMessage('Notifications have been turned on.');
          } else {
            setNotificationMessage('Please enable notifications in your browser settings.');
          }
        });
      }
    } else {
      setNotificationMessage('Your browser does not support notifications.');
    }
  };

  const handleAgeInput = (event) => {
    setAge(event.target.value);
  };

  const startTimer = () => {
    const ageValue = parseInt(age);
    if (isNaN(ageValue) || ageValue <= 0) {
      setNotificationMessage('Please enter a valid age.');
      return;
    }

    setRemainingTime(ageValue);
    setNotificationMessage(`Timer set for ${ageValue} seconds.`);

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          showNotification(`Timer of ${ageValue} seconds is done!`);
          return null; // Reset remaining time
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  };

  const showNotification = (message) => {
    if (isNotificationSupported && Notification.permission === 'granted') {
      const notificationOptions = {
        body: message,
        icon: icon, // Set the icon path
        requireInteraction: true // Keep the notification until the user interacts with it
      };
      const notification = new Notification(title, notificationOptions);

      // Optionally handle click event on the notification
      notification.onclick = () => {
        alert('Notification clicked!');
        // You can redirect the user or perform any action here
      };
    }
  };

  return (
    <div>
      <h1>Notification App</h1>
      <button onClick={toggleNotifications}>
        {isNotificationsEnabled ? 'Turn Off Notifications' : 'Turn On Notifications'}
      </button>
      {notificationMessage && <p>{notificationMessage}</p>}
      {isNotificationsEnabled && (
        <div>
          <input
            type="number"
            value={age}
            onChange={handleAgeInput}
            placeholder="Enter your age"
          />
          <button onClick={startTimer}>Start Timer</button>
          {remainingTime !== null && (
            <p>Time remaining: {remainingTime} seconds</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

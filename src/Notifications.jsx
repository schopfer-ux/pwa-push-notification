// Notifications.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { subscribe, unsubscribe } from './notificationsSlice';

// Replace with your VAPID public key
const VAPID_PUBLIC_KEY = 'BJ65HW3Q8NlYUjsliT8eeT6JXQNuUignX-QvAlQ32TRvp_XeHZWe1eGU2fhY9ZB4VIT0bxM9rwT5GnnRYIDPy8s';

const Notifications = () => {
  const dispatch = useDispatch();
  const subscribedDevices = useSelector((state) => state.notifications.subscribedDevices);

  const subscribeToNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) // Make sure this is a valid VAPID public key
      });
      const subscriptionData = JSON.stringify(subscription);
      dispatch(subscribe(subscriptionData));
      alert('Subscribed to notifications');
    } catch (error) {
      console.error('Subscription failed', error);
    }
  };
  

  const sendNotification = async () => {
    try {
      console.log('Subscribed devices:', subscribedDevices);

      const response = await fetch('/api/sendNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ devices: subscribedDevices })
      });

      if (response.ok) {
        alert('Notification sent to selected device');
      } else {
        console.error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification', error);
    }
  };

  const sendNotificationToAll = async () => {
    try {
      const response = await fetch('/api/sendNotificationToAll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        alert('Notification sent to all subscribed devices');
      } else {
        console.error('Failed to send notification to all devices');
      }
    } catch (error) {
      console.error('Error sending notification to all devices', error);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        const subscriptionData = JSON.stringify(subscription);
        dispatch(unsubscribe(subscriptionData));
        alert('Unsubscribed from notifications');
      }
    } catch (error) {
      console.error('Unsubscription failed', error);
    }
  };

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    try {
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    } catch (e) {
      console.error('Base64 decoding failed:', e);
      throw e; // Re-throw the error after logging it
    }
  }
  

  return (
    <div>
      <h2>Web Push Notifications</h2>
      <button onClick={subscribeToNotifications}>Subscribe to Notifications</button>
      <button onClick={sendNotification}>Send Notification to Selected Device</button>
      <button onClick={sendNotificationToAll}>Send Notification to All Devices</button>
      <button onClick={unsubscribeFromNotifications}>Unsubscribe from Notifications</button>
    </div>
  );
};

export default Notifications;

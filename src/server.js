// server.js
import webpush from 'web-push';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());

app.use(cors());


const VAPID_PUBLIC_KEY = 'BJ65HW3Q8NlYUjsliT8eeT6JXQNuUignX-QvAlQ32TRvp_XeHZWe1eGU2fhY9ZB4VIT0bxM9rwT5GnnRYIDPy8s';
const VAPID_PRIVATE_KEY = 'D9uq0dTOWdt_U70Ialf7LwkcuHqibIXWQeZWXDbh-6g';

webpush.setVapidDetails('mailto:your-email@example.com', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

let subscribedDevices = [];

app.post('/api/sendNotification', (req, res) => {
    console.log('Subscribed devices:', subscribedDevices);

  const { devices } = req.body;
  const notificationPayload = {
    notification: {
      title: 'New Notification',
      body: 'You have a new notification!',
      icon: 'path/to/icon.png'
    }
  };

  Promise.all(
    devices.map((device) => {
      return webpush.sendNotification(JSON.parse(device), JSON.stringify(notificationPayload));
    })
  )
    .then(() => res.status(200).json({ message: 'Notification sent' }))
    .catch((error) => {
      console.error('Error sending notification', error);
      res.sendStatus(500);
    });
});

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  subscribedDevices.push(subscription);
  res.status(201).json({});
});

app.post('/api/unsubscribe', (req, res) => {
  const subscription = req.body;
  subscribedDevices = subscribedDevices.filter(
    (device) => JSON.stringify(device) !== JSON.stringify(subscription)
  );
  res.status(200).json({});
});

app.post('/api/sendNotificationToAll', (req, res) => {
  const notificationPayload = {
    notification: {
      title: 'Hello, everyone!',
      body: 'This notification was sent to all devices!',
      icon: 'path/to/icon.png'
    }
  };

  Promise.all(
    subscribedDevices.map((device) => {
      return webpush.sendNotification(device, JSON.stringify(notificationPayload));
    })
  )
    .then(() => res.status(200).json({ message: 'Notification sent to all devices' }))
    .catch((error) => {
      console.error('Error sending notification to all devices', error);
      res.sendStatus(500);
    });
});

app.listen(3000, () => console.log('Server started on port 3000'));

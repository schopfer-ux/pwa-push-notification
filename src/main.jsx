import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import Notifications from './Notifications';
import App from './App';

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(
    (registration) => console.log('Service Worker registered with scope:', registration.scope),
    (err) => console.error('Service Worker registration failed:', err)
  );
}

// Use createRoot instead of ReactDOM.render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

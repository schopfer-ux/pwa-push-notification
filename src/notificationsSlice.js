// notificationsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    subscribedDevices: []
  },
  reducers: {
    subscribe: (state, action) => {
      state.subscribedDevices.push(action.payload);
    },
    unsubscribe: (state, action) => {
      state.subscribedDevices = state.subscribedDevices.filter(
        (device) => device !== action.payload
      );
    }
  }
});

export const { subscribe, unsubscribe } = notificationsSlice.actions;
export default notificationsSlice.reducer;

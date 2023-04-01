import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  channelId: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    enterUser: (state, action) => {
      state.user = action.payload.user;
    },
    enterChannel: (state, action) => {
      state.channelId = action.payload.channelId;
    },
  },
});

export const { enterUser: enterUser } = appSlice.actions;

export const selectUser = (state) => state.app.user;

export const { enterChannel: enterChannel } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;

export default appSlice.reducer;

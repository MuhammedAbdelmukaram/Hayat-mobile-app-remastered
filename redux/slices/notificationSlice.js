// notificationSlice.js example

import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        expoPushToken: null, // Ensure this is correctly set
    },
    reducers: {
        setExpoPushToken: (state, action) => {
            state.expoPushToken = action.payload;
        },
    },
});

export const { setExpoPushToken } = notificationSlice.actions;

export default notificationSlice.reducer;

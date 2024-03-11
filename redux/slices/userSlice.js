// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
        clearUser: (state) => { // Add this reducer
            state.userInfo = null; // Reset user info
        },
    },
});

export const { setUser, clearUser } = userSlice.actions; // Export the new action

export default userSlice.reducer;

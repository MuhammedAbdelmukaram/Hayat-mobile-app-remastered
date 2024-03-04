// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import selectedContentReducer from './slices/selectedContentSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        selectedContent: selectedContentReducer,
        notification: notificationReducer,
    },
});

export default store;

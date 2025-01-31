import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import chatSlice from './slices/messageSlice';
import matchSlice from './slices/matcheSlice';
import userSlice from './slices/userSlice';
import messageSlice from './slices/messageSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice,
        matches: matchSlice,
        user: userSlice,
        message: messageSlice

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/redux/slices/authSlice';
import chatSlice from '@/redux/slices/messageSlice';
import matchSlice from '@/redux/slices/matcheSlice';
import userSlice from '@/redux/slices/userSlice';
import messageSlice from '@/redux/slices/messageSlice';
import websocketSlice from '@/redux/slices/websocketSlice';
import websocketMiddleware from '@/redux/middleware/websocketMiddleware';

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice,
        matches: matchSlice,
        user: userSlice,
        message: messageSlice,
        websocket: websocketSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(websocketMiddleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
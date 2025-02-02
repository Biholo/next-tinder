import { configureStore, Middleware } from '@reduxjs/toolkit';
import authSlice from '@/redux/slices/authSlice';
import chatSlice from '@/redux/slices/messageSlice';
import matchSlice from '@/redux/slices/matcheSlice';
import userSlice from '@/redux/slices/userSlice';
import messageSlice from '@/redux/slices/messageSlice';
import websocketSlice from '@/redux/slices/websocketSlice';
import websocketMiddleware from '@/redux/middleware/websocketMiddleware';
import conversationSlice from '@/redux/slices/conversationSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice, // Vérifie s'il est nécessaire en plus de `messageSlice`
        matches: matchSlice,
        user: userSlice,
        message: messageSlice,
        websocket: websocketSlice,
        conversations: conversationSlice
    },
    middleware: (getDefaultMiddleware): Middleware[] =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(websocketMiddleware),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
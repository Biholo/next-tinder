import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import chatSlice from './slices/chatSlice';

const store = configureStore({
    reducer: {
        auth: authSlice,
        chat: chatSlice

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }).concat(),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
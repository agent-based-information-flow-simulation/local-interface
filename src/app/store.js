import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import agentsTabReducer from '../features/agents_tab/agentsTabSlice';
import messageTabReducer from '../features/message_tab/messageTabSlice';
import enumSliceReducer from '../features/components/enumSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    agentsTab: agentsTabReducer,
    messageTab: messageTabReducer,
    enumSlice: enumSliceReducer,
  },
});

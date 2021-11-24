import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import agentsTabReducer from '../features/agents_tab/agentsTabSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    agentsTab: agentsTabReducer,
  },
});

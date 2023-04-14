import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import agentsTabReducer from '../features/agents_tab/agentsTabSlice'
import messageTabReducer from '../features/message_tab/messageTabSlice'
import enumSliceReducer from '../features/components/enumSlice'
import simulationSliceReducer from '../features/simulationSlice'
import editorSliceReducer from '../features/agents_tab/editors/editorSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    agentsTab: agentsTabReducer,
    messageTab: messageTabReducer,
    enumSlice: enumSliceReducer,
    simulation: simulationSliceReducer,
    editor: editorSliceReducer
  }
})

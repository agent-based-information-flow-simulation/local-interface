import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  agent_types: [],
  message_types: [],
}

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.message_types.push(action.payload);
    },
    addAgent: (state, action) => {
      state.agent_types.push(action.payload);
    },

  }
})

export const {addMessage, addAgent} = simulationSlice.actions;

export const selectMessageTypes = (state) => {
  return state.simulation.message_types;
}

export const selectAgents = (state) => {
  return state.simulation.agent_types;
}

export default simulationSlice.reducer;
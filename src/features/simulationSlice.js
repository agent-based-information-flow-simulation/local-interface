import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  agent_types: [],
  message_types: []
}

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.message_types.push(action.payload);
    }

  }
})

export const {addMessage} = simulationSlice.actions;

export const selectMessageTypes = (state) => {
  return state.simulation.message_types;
}

export default simulationSlice.reducer;
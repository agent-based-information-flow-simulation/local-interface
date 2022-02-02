import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  agent_types: [],
  message_types: [],
  graph: {},
  names: [],
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
    addName: (state, action) => {
      state.names.push(action.payload);
    },
    setGraph: (state, action) => {
      state.graph = action.payload;
    }
  }
})

export const {addMessage, addAgent, addName, setGraph} = simulationSlice.actions;

export const selectGraph = (state) => {
  return state.simulation.graph;
}

export const selectMessageTypes = (state) => {
  return state.simulation.message_types;
}

export const selectNames = (state) => {
  return state.simulation.names;
}

export const selectAgents = (state) => {
  return state.simulation.agent_types;
}

export default simulationSlice.reducer;
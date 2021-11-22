import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agent_count: 0,
  agents: [],
  current_selected: -1,
}

export const agentsTabSlice = createSlice({
  name: 'agentsTab',
  initialState,
  reducers: {
    addAgent: (state, action) => {
      state.agent_count += 1;
      state.agents.push(action.payload);
    }

  }
});


export const selectCurrentAgents = (state) => {
  if (state.current_selected !== -1)
    return state.agents[state.current_selected];
  //TODO Else, deselect, return something magical
}
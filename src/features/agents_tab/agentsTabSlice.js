import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agent_count: 0,
  agents: [],
  current_selected: -1,
  parameters: [],
  param_count: 0,
}

export const agentsTabSlice = createSlice({
  name: 'agentsTab',
  initialState,
  reducers: {
    addAgent: (state, action) => {
      state.agent_count += 1;
      state.agents.push(action.payload);
    },
    addParam: (state, action) => {
      state.param_count += 1;
      let newArr = JSON.parse(JSON.stringify(state.parameters))
      newArr.push(action.payload);
      state.parameters = newArr;
    }
  }
});

export const {addAgent, addParam} = agentsTabSlice.actions;

export const selectCurrentAgents = (state) => {
  if (state.current_selected !== -1)
    return state.agents[state.current_selected];
  //TODO Else, deselect, return something magical
}

export const selectParameters = (state) => {
  return state.agentsTab.parameters;
}
export default agentsTabSlice.reducer;
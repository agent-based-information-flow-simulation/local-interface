import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agent_count: 0,
  agents: [],
  current_selected: -1,
  parameters: [],
  param_count: 0,
  current_param_data: {}
}

export const agentsTabSlice = createSlice({
  name: 'agentsTab',
  initialState,
  reducers: {
    addAgent: (state, action) => {
      state.agent_count += 1;
      state.agents.push(action.payload);
    },
    setCurrentParamData: (state, action) => {
      console.log("Setting param data");
      console.log(action.payload);
      state.current_param_data = action.payload;
      console.log(state.current_param_data);
    },
    addParam: (state, action) => {
      state.param_count += 1;
      state.parameters.push(action.payload);
    }
  }
});

export const {addAgent, setCurrentParamData, addParam} = agentsTabSlice.actions;

export const selectCurrentAgents = (state) => {
  if (state.current_selected !== -1)
    return state.agents[state.current_selected];
  //TODO Else, deselect, return something magical
}

export const selectParamData = (state) => {
  console.log("now we in the selector")
  console.log(state.current_param_data)
  return state.current_param_data;
}

export const selectParameters = (state) => state.parameters;

export default agentsTabSlice.reducer;
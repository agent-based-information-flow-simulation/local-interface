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
      state.current_param_data = action.payload;
    },
    addParam: (state, action) => {
      console.log("Adding new param... ", action.payload)
      state.param_count += 1;
      let newArr = JSON.parse(JSON.stringify(state.parameters))
      newArr.push(action.payload);
      state.parameters = newArr;
      console.log("State params is now: ", state.parameters);
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
  return state.agentsTab.current_param_data;
}

export const selectParameters = (state) => {
  console.log("Selecting from state: ", state)
  console.log("Selected params: ", state.agentsTab.parameters)
  return state.agentsTab.parameters;
}
export default agentsTabSlice.reducer;
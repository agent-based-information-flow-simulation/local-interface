import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agent_count: 0,
  agents: [],
  current_selected: -1,
  parameters: [],
  param_count: 0,
  behaviours: [],
  scope_vars: [],
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
    },
    addBehav: (state, action) => {
      state.behaviours.push(action.payload);
    },
    addScopeVar: (state, action) => {
      state.scope_vars.push(action.payload);
    },
    resetScopeVars: (state, action) => {
      state.scope_vars = [];
    }
  }
});

export const {addAgent, addParam, addBehav, addScopeVar, resetScopeVars} = agentsTabSlice.actions;

export const selectCurrentAgents = (state) => {
  if (state.current_selected !== -1)
    return state.agents[state.current_selected];
  //TODO Else, deselect, return something magical
}

export const selectParameters = (state) => {
  return state.agentsTab.parameters;
}

export const selectScopeVars = (state) => {
  return state.agentsTab.scope_vars;
}

export const selectBehaviours = (state) => {
  return state.agentsTab.behaviours;
}


export default agentsTabSlice.reducer;
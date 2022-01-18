import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  agents: [],
  current_selected: -1,
  parameters: [],
  behaviours: [],
  actions: [],
}

export const agentsTabSlice = createSlice({
  name: 'agentsTab',
  initialState,
  reducers: {
    addParam: (state, action) => {
      state.param_count += 1;
      let newArr = JSON.parse(JSON.stringify(state.parameters))
      newArr.push(action.payload);
      state.parameters = newArr;
    },
    addBehav: (state, action) => {
      state.behaviours.push(action.payload);
    },
    addAction: (state, action) => {
      state.actions.push(action.payload);
    },
    reset: (state, action) => {
      console.log("RESETING")
      state.parameters = [];
      state.behaviours = [];
    }
  }
});

export const {addParam, addBehav, reset} = agentsTabSlice.actions;

export const selectCurrentAgent = (state) => {
  if (state.current_selected !== -1)
    return state.agents[state.current_selected];
  //TODO Else, deselect, return something magical
}

export const selectAgents = (state) => {
  return state.agentsTab.agents;
}

export const selectActions = (state) => {
  return state.agentsTab.actions;
}

export const selectParameters = (state) => {
  return state.agentsTab.parameters;
}

export const selectBehaviours = (state) => {
  return state.agentsTab.behaviours;
}


export default agentsTabSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  msg_type_count: 0,
  current_selected: -1,
  messages: [],
  parameters: [],
  param_count: 0,
}

export const messageTabSlice = createSlice({
  name: 'messageTab',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.msg_type_count += 1;
      state.messages.push(action.payload);
    },
    addParam: (state, action) => {
      state.param_count += 1;
      let newArr = JSON.parse(JSON.stringify(state.parameters))
      newArr.push(action.payload)
      state.parameters = newArr;
    },
    setCurrentParam: (state, action) => {
      console.log("ACTION")
      console.log(action.payload)
      state.current_selected = action.payload;
    }
  }
})

export const {addMessage, addParam, setCurrentParam} = messageTabSlice.actions;

export const selectParameters = (state) => {
  return state.messageTab.parameters;
}

export const selectCurrentParam = (state) => {
  console.log("SELECTOR")
  console.log(state.messageTab.current_selected)
  console.log(state.messageTab.param_count)
  if(state.messageTab.current_selected > 0 && state.messageTab.current_selected < state.messageTab.param_count)
    return state.messageTab.parameters[state.messageTab.current_selected];
  else
    return null;
}

export default messageTabSlice.reducer
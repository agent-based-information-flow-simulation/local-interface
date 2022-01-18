import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scopeVars: [],
  openBlocks: 0,
  actions: [],
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addScopeVar: (state, action) => {
      state.scopeVars.push(action.payload);
    },
    resetScope: (state, action) => {
      console.log("resetting")
      state.scopeVars = []
    },
    resetActions: (state, action) => {
      state.actions = [];
    },
    openBlock: (state, action) => {
      state.openBlocks += 1;
    },
    closeBlock: (state, action) => {
      state.openBlocks -= 1;
    },
    addAction: (state, action) => {
      state.actions.push(action.payload);
    }
  }
})

export const {addScopeVar, resetScope, openBlock, closeBlock, addAction, resetActions} = editorSlice.actions;

export const selectScopeVars = (state) => state.editor.scopeVars;

export const selectActions = (state) => state.editor.actions;

export const selectBlockLvl = (state) =>{
  return state.editor.openBlocks;
}

export default editorSlice.reducer;
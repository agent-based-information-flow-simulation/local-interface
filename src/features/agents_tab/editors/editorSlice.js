import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  scopeVars: [],
  openBlocks: 0,
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    addScopeVar: (state, action) => {
      state.scopeVars.push(action.payload);
    },
    resetScope: (state, action) => {
      state.scopeVars = []
    },
    openBlock: (state, action) => {
      state.openBlocks += 1;
    },
    closeBlock: (state, action) => {
      state.openBlocks -= 1;
    }
  }
})

export const {addScopeVar, resetScope, openBlock, closeBlock} = editorSlice.actions;

export const selectScopeVars = (state) => state.editor.scopeVars;

export const selectBlockLvl = (state) =>{
  return state.editor.openBlocks;
}

export default editorSlice.reducer;
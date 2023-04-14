import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  enum_count: 0,
  enums: []
}

export const enumSlice = createSlice({
  name: 'enumState',
  initialState,
  reducers: {
    addEnum: (state, action) => {
      const name = action.payload.name
      if (state.enums.find(el => el.name === name) !== -1) {
        state.enum_count += 1
        state.enums.push(action.payload)
      }
    }
  }
})

export const { addEnum } = enumSlice.actions

export const selectEnums = (state) => {
  return state.enumSlice.enums
}

export default enumSlice.reducer

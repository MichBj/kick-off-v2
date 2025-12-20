import { createSlice } from '@reduxjs/toolkit';

/** Crear slice para Redux */
export const slice = createSlice({
  name: 'filter',
  initialState: { default: {} },
  reducers: {
    add: (state, action) => {
      state.default = action.payload || {};
    },
  },
});

export const { add } = slice.actions;

/** Obtener el filtro por defecto */
export const selectDefaultFilter = (state) => state.filter.default || {};

export default slice.reducer;

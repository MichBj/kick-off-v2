import { createSlice } from '@reduxjs/toolkit';

/** Crear slice para Redux */
export const slice = createSlice({
  name: 'roles',
  initialState: { default: {} },
  reducers: {
    set: (state, action) => {
      state.roles = action.payload;
    },
  },
});

export const { set } = slice.actions;

/** Obtener el filtro por defecto */
export const selectRoles = (state) => state.roles.roles || {};

export default slice.reducer;

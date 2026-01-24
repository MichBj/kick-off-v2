import { createSlice } from '@reduxjs/toolkit';

/** Crear slice para Redux */
export const slice = createSlice({
  name: 'access',
  initialState: {},
  reducers: {
    add: (state, action) => {
      state[action.payload.code] = action.payload.data;
    },
    set: (state, action) => {
      state.entities = action.payload;
    },
  },
});

export const { add, set } = slice.actions;

/** Obtener todos los permisos de accesos */
export const selectAccess = (state) => state.access.entities || {};

/** Obtener permisos de acceso por entidad */
const handler = (state, code) => {
  return selectAccess(state)[code] || {};
};

/** Obtener Redux selector para permisos de acceso por entidad */
export const selector = {
  access: {
    page: (state) => handler(state, 'page'),
    user: (state) => handler(state, 'user'),
    person: (state) => handler(state, 'person'),
    menu: (state) => handler(state, 'menu'),
    role: (state) => handler(state, 'role'),
    rolemenu: (state) => handler(state, 'rolemenu'),
    localuservar: (state) => handler(state, 'localuservar'),
    module: (state) => handler(state, 'module'),
    entity: (state) => handler(state, 'entity'),
    access: (state) => handler(state, 'access'),
    mailServer: (state) => handler(state, 'mailServer'),
    mailAccount: (state) => handler(state, 'mailAccount'),
    parameter: (state) => handler(state, 'parameter'),
    log: (state) => handler(state, 'log'),
    court: (state) => handler(state, 'court'),
    courtSchedule: (state) => handler(state, 'courtSchedule'),
  },
};

export default slice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import accessReducer from '@redux/reducers/accessSlice';
import filterReducer from '@redux/reducers/filterSlice';
import rolesReducer from '@redux/reducers/rolesSlice';

/** Configurar Redux Store */
export default configureStore({
  reducer: {
    access: accessReducer,
    filter: filterReducer,
    roles: rolesReducer,
  },
});

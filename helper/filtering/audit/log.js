import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'user') return { User: { username: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'user')
    return { User: filterField('username', operator, value) };
};

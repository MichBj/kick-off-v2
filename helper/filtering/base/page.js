import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'module') return { Module: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'module')
    return { Module: filterField('name', operator, value) };
};

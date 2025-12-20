import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'module') return { Module: { name: sort } };
  if (field === 'url') return { Page: { url: sort } };
  if (field === 'menu') return { Menu: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'module')
    return { Module: filterField('name', operator, value) };
  if (field === 'url') return { Page: filterField('url', operator, value) };
  if (field === 'menu') return { Menu: filterField('name', operator, value) };
};

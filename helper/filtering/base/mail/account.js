import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'module') return { Module: { name: sort } };
  if (field === 'server') return { MailServer: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'module')
    return { Module: filterField('name', operator, value) };
  if (field === 'server')
    return { MailServer: filterField('name', operator, value) };
};

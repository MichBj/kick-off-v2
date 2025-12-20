import { filterField } from '@lib/datagrid';

export const sortHandler = (field, sort) => {
  if (field === 'dni') return { Person: { dni: sort } };
  if (field === 'name') return { Person: { name: sort } };
  if (field === 'AccountType') return { AccountType: { name: sort } };
};

export const filterHandler = (field, value, operator) => {
  if (field === 'dni') return { Person: filterField('dni', operator, value) };
  if (field === 'name') return { Person: filterField('name', operator, value) };
  if (field === 'AccountType')
    return { AccountType: filterField('name', operator, value) };
};

import moment from 'moment';
import { toInteger } from 'lodash';

/** Filtro para comprobar campos vacíos */
const emptyFilter = ({ field, operator }) => {
  return { [field]: { [operator?.prisma]: null } };
};

/** Filtro para comprobar cadenas de texto  */
const stringFilter = ({ field, operator, value }) => {
  return {
    [field]: {
      [operator?.prisma]: value || operator?.value,
      mode: 'insensitive',
    },
  };
};

/** Filtro para comprobar fecha despues de*/
const dateFilterAfter = ({ field, operator, value }) => {
  return {
    [field]: {
      [operator?.prisma]: new Date(moment(`${value} 23:59`)),
    },
  };
};

/** Filtro para comprobar fecha antes de*/
const dateFilterBefore = ({ field, operator, value }) => {
  return {
    [field]: {
      [operator?.prisma]: new Date(moment(`${value} 00:00`)),
    },
  };
};

/** Filtro para comprobar fecha despues o igual a*/
const dateFilterAfterEqual = ({ field, value }) => {
  return {
    [field]: { gte: new Date(moment(`${value} 00:01`)) },
  };
};

/** Filtro para comprobar fecha antes o igual a*/
const dateFilterBeforeEqual = ({ field, value }) => {
  return {
    [field]: { gte: new Date(moment(`${value} 23:59`)) },
  };
};

/** Filtro para comprobar día exacto*/
const dateFilterIs = ({ field, value }) => {
  return {
    AND: [
      { [field]: { gte: new Date(moment(`${value} 00:01`)) } },
      { [field]: { lte: new Date(moment(`${value} 23:59`)) } },
    ],
  };
};

/** Filtro para comprobar día diferente*/
const dateFilterNot = ({ field, value }) => {
  return {
    OR: [
      { [field]: { lt: new Date(moment(`${value} 00:00`)) } },
      { [field]: { gt: new Date(moment(`${value} 23:59`)) } },
    ],
  };
};

/** Filtro para comprobar números*/
const numberFilter = ({ field, operator, value }) => {
  return {
    [field]: {
      [operator?.prisma]: toInteger(value || operator?.value),
    },
  };
};

/** Lista de operadores permitidos */
export const OPERATORS = [
  {
    code: 'contains',
    prisma: 'contains',
    name: 'Contiene',
    types: ['string'],
    handler: stringFilter,
  },
  {
    code: 'equals',
    prisma: 'equals',
    name: 'Igual a',
    types: ['string'],
    handler: stringFilter,
  },
  {
    code: 'startsWith',
    prisma: 'startsWith',
    name: 'Empieza con',
    types: ['string'],
    handler: stringFilter,
  },
  {
    code: 'endsWith',
    prisma: 'endsWith',
    name: 'Termina en',
    types: ['string'],
    handler: stringFilter,
  },
  // DATE
  {
    code: 'is',
    name: 'Es igual a',
    handler: dateFilterIs,
    types: ['date'],
  },
  {
    code: 'not',
    name: 'No es igual a',
    types: ['date'],
    handler: dateFilterNot,
  },
  {
    code: 'after',
    prisma: 'gt',
    name: 'Mayor que',
    types: ['date'],
    handler: dateFilterAfter,
  },
  {
    code: 'before',
    prisma: 'lt',
    name: 'Menor que',
    types: ['date'],
    handler: dateFilterBefore,
  },
  {
    code: 'onOrAfter',
    prisma: 'gte',
    name: 'Mayor o igual a',
    types: ['date'],
    handler: dateFilterAfterEqual,
  },
  {
    code: 'onOrBefore',
    prisma: 'lte',
    name: 'Menor o igual a',
    types: ['date'],
    handler: dateFilterBeforeEqual,
  },
  // NUMBER
  {
    code: '=',
    prisma: 'equals',
    name: 'Igual a',
    types: ['number'],
    handler: numberFilter,
  },
  {
    code: '!=',
    prisma: 'not',
    name: 'No es igual a',
    types: ['number'],
    handler: numberFilter,
  },
  {
    code: '>',
    prisma: 'gt',
    name: 'Mayor que',
    types: ['number'],
    handler: numberFilter,
  },
  {
    code: '>=',
    prisma: 'gte',
    name: 'Mayor o igual que',
    types: ['number'],
    handler: numberFilter,
  },
  {
    code: '<',
    prisma: 'lt',
    name: 'Menor que',
    types: ['number'],
    handler: numberFilter,
  },
  {
    code: '<=',
    prisma: 'lte',
    name: 'Mayor o igual que',
    types: ['number'],
    handler: numberFilter,
  },
  // GENERAL
  {
    code: 'isEmpty',
    prisma: 'is',
    name: 'No esta establecido',
    value: false,
    types: ['string', 'date', 'number'],
    handler: emptyFilter,
  },
  {
    code: 'isNotEmpty',
    prisma: 'isNot',
    name: 'Esta establecido',
    value: false,
    types: ['string', 'date', 'number'],
    handler: emptyFilter,
  },
];

/** Retorna el operador en base al código especificado */
export const filterOperator = (code) => {
  return OPERATORS.find((item) => item.code === code);
};

/** Retorna el filtro en base al handler del operador especificado
 * @param field Campo a filtrar
 * @param operator Operador
 * @param value Valor a comparar
 */
export const filterField = (field, operator, value) => {
  return operator.handler({ field, operator, value });
};

const FILTER = { type: 'string' };

/** Retorna la lista de filtros agregando parámetros por defecto de ser necesario
 * @param source Lista de filtros a convertir
 */
export const filterList = (source) => {
  return source.map((item) => {
    return { code: item.code, name: item.name, type: item.type || FILTER.type };
  });
};

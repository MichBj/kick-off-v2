import { toInteger } from 'lodash';

export const parseData = (data) => {
  if (data.moduleId) data.moduleId = toInteger(data.moduleId);
  return data;
};

import { toInteger } from 'lodash';

const parseApiData = (data) => {
  if (data.entityId) data.entityId = toInteger(data.entityId);
  if (data.roleId) data.roleId = toInteger(data.roleId);
  return data;
};

const accessHelper = {
  api: { parseData: parseApiData },
};

export default accessHelper;

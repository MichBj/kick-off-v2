import { toInteger } from 'lodash';

const parseApiData = (data) => {
  if (data.moduleId) data.moduleId = toInteger(data.moduleId);
  return data;
};

const pageHelper = {
  api: { parseData: parseApiData },
};

export default pageHelper;

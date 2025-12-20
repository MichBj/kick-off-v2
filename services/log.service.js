import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/audit/log/', filters);
};

export const logService = {
  getAll,
};

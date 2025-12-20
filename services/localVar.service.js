import { httpRequest } from '@lib/httpRequest';

const getAll = (_public) => {
  return httpRequest.get('/api/local/var');
};

export const localVarService = {
  getAll,
};

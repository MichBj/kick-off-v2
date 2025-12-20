import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/access/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/access/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/access', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/access/${id}`, params);
};

export const accessService = {
  getAll,
  getById,
  create,
  update,
};

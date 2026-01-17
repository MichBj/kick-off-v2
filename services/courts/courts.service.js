import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/courts/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/courts/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/courts', params);
};

const update = (id, params) => {
  params = parseParams(params);
  return httpRequest.put(`/api/courts/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/courts/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/courts/${id}`, { active: true });
};

export const courtsService = {
  getAll,
  getById,
  create,
  update,
  activate,
  deactivate,
};

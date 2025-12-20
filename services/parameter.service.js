import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/parameter', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/parameter/${id}`);
};

const getByKey = (key) => {
  return httpRequest.get(`/api/parameter/key/${key}`);
};

const update = (id, params) => {
  return httpRequest.put(`/api/parameter/${id}`, params);
};

const create = async (params) => {
  return httpRequest.post('/api/parameter', params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/page/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/page/${id}`, { active: true });
};

export const parameterService = {
  getAll,
  create,
  getById,
  update,
  getByKey,
  deactivate,
  activate,
};

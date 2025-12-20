import { httpRequest } from '@lib/httpRequest';
import { toInteger } from 'lodash';

const parseParams = (params) => {
  if (params.moduleId == '') params.moduleId = null;
  if (params.moduleId) params.moduleId = toInteger(params.moduleId);
  return params;
};

const getAll = (filters) => {
  return httpRequest.get('/api/entity/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/entity/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/entity', params);
};

const update = (id, params) => {
  params = parseParams(params);
  return httpRequest.put(`/api/entity/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/entity/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/entity/${id}`, { active: true });
};

export const entityService = {
  getAll,
  getById,
  create,
  update,
  activate,
  deactivate,
};

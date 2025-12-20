import { httpRequest } from '@lib/httpRequest';
import { toInteger } from 'lodash';

const parseParams = (params) => {
  if (params.moduleId == '') params.moduleId = null;
  if (params.moduleId) params.moduleId = toInteger(params.moduleId);
  return params;
};

const getAll = (filters) => {
  return httpRequest.get('/api/page/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/page/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/page', params);
};

const update = (id, params) => {
  params = parseParams(params);
  return httpRequest.put(`/api/page/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/page/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/page/${id}`, { active: true });
};

export const pageService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};

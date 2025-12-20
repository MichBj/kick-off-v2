import { httpRequest } from '@lib/httpRequest';
import { toInteger } from 'lodash';

const parseParams = (params) => {
  if (params.moduleId == '') params.moduleId = null;
  if (params.moduleId) params.moduleId = toInteger(params.moduleId);
  if (params.roleId == '') params.roleId = null;
  if (params.roleId) params.roleId = toInteger(params.roleId);
  return params;
};

const getAll = (filters) => {
  return httpRequest.get('/api/role/', filters);
};

const getAccess = (id) => {
  return httpRequest.get(`/api/role/${id}/access`);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/role/${id}`);
};

const create = (params) => {
  params = parseParams(params);
  return httpRequest.post('/api/role', params);
};

const update = (id, params) => {
  params = parseParams(params);
  return httpRequest.put(`/api/role/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/role/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/role/${id}`, { active: true });
};

export const roleService = {
  getAll,
  getAccess,
  getById,
  create,
  update,
  deactivate,
  activate,
};

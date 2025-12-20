import { httpRequest } from '@lib/httpRequest';
import { has, toInteger } from 'lodash';

const parse = (params) => {
  if (has(params, 'priority')) params.priority = toInteger(params.priority);
  return params;
};

const getAll = (filters) => {
  return httpRequest.get('/api/menu/', filters);
};

const getTree = () => {
  return httpRequest.get('/api/menu/tree');
};

const getDashboard = (code) => {
  return httpRequest.get(`/api/menu/dashboard/${code}`);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/menu/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/menu', parse(params));
};

const update = (id, params) => {
  return httpRequest.put(`/api/menu/${id}`, parse(params));
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/menu/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/menu/${id}`, { active: true });
};

export const menuService = {
  getAll,
  getTree,
  getById,
  create,
  update,
  deactivate,
  activate,
  getDashboard,
};

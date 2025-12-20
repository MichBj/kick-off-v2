import { httpRequest } from '@lib/httpRequest';
import { toInteger } from 'lodash';

const parseParams = (params) => {
  if (params.menuId == '') params.menuId = null;
  if (params.menuId) params.menuId = toInteger(params.menuId);
  if (params.roleId == '') params.roleId = null;
  if (params.roleId) params.roleId = toInteger(params.roleId);
  return params;
};

const getAll = () => {
  return httpRequest.get('/api/rolemenu/');
};

const getById = (roleId, menuId) => {
  return httpRequest.get(`/api/rolemenu/${roleId}/${menuId}`);
};

const getByMenu = (menuId) => {
  return httpRequest.get(`/api/rolemenu/role/${menuId}`);
};

const getByRole = (roleId) => {
  return httpRequest.get(`/api/rolemenu/${roleId}/menu`);
};

const create = (params) => {
  params = parseParams(params);
  return httpRequest.post('/api/rolemenu', params);
};

const update = (roleId, menuId, params) => {
  params = parseParams(params);
  return httpRequest.put(`/api/rolemenu/${roleId}/${menuId}`, params);
};

export const roleMenuService = {
  getAll,
  getById,
  getByMenu,
  getByRole,
  getById,
  create,
  update,
};

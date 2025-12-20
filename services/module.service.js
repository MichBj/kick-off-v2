import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/module/', filters);
};

const getPages = (id) => {
  return httpRequest.get(`/api/module/${id}/pages`);
};

const getMenus = (id) => {
  return httpRequest.get(`/api/module/${id}/menus`);
};

const getRoles = (id) => {
  return httpRequest.get(`/api/module/${id}/roles`);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/module/${id}`);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/module/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/module/${id}`, { active: true });
};

const install = (id) => {
  return httpRequest.put(`/api/module/${id}/install`);
};

export const moduleService = {
  getAll,
  getPages,
  getRoles,
  getMenus,
  getById,
  deactivate,
  activate,
  install,
};

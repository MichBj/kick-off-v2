import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/base/chatbot/submenu/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/base/chatbot/submenu/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/base/chatbot/submenu', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/base/chatbot/submenu/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/base/chatbot/submenu/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/base/chatbot/submenu/${id}`, { active: true });
};

export const cbsubmenuService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};

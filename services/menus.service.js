import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/base/chatbot/menu/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/base/chatbot/menu/${id}`);
};

const create = (params) => {
  return httpRequest.post('/api/base/chatbot/menu', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/base/chatbot/menu/${id}`, params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/base/chatbot/menu/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/base/chatbot/menu/${id}`, { active: true });
};

export const cbmenusService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};

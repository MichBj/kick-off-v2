import { httpRequest } from '@lib/httpRequest';

const getAll = (filters) => {
  return httpRequest.get('/api/mail/server/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/mail/server/${id}`);
};

const update = (id, params) => {
  return httpRequest.put(`/api/mail/server/${id}`, params);
};

const create = async (params) => {
  return httpRequest.post('/api/mail/server', params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/mail/server/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/mail/server/${id}`, { active: true });
};

export const mailServerService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};

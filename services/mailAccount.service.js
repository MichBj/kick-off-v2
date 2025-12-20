import { httpRequest } from '@lib/httpRequest';
import { toInteger } from 'lodash';

const parseParams = (params) => {
  if (params.moduleId == '') delete params.moduleId;
  if (params.moduleId) params.moduleId = toInteger(params.moduleId);
  if (params.mailServerId == '') delete params.mailServerId;
  if (params.mailServerId) params.mailServerId = toInteger(params.mailServerId);
};

const getAll = (filters) => {
  return httpRequest.get('/api/mail/account/', filters);
};

const getById = (id) => {
  if (!id) return Promise.resolve({});
  return httpRequest.get(`/api/mail/account/${id}`);
};

const update = (id, params) => {
  parseParams(params);
  return httpRequest.put(`/api/mail/account/${id}`, params);
};

const create = async (params) => {
  parseParams(params);
  return httpRequest.post('/api/mail/account', params);
};

const deactivate = (id) => {
  return httpRequest.delete(`/api/mail/account/${id}`);
};

const activate = (id) => {
  return httpRequest.put(`/api/mail/account/${id}`, { active: true });
};

export const mailAccountService = {
  getAll,
  getById,
  create,
  update,
  deactivate,
  activate,
};

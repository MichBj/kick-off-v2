import { httpRequest } from '@lib/httpRequest';

const signin = (params) => {
  return httpRequest.post('/api/auth/signin/', params);
};

const signout = () => {
  return httpRequest.get(`/api/auth/signout`);
};

const user = () => {
  return httpRequest.get('/api/auth/user');
};

const publicUser = () => {
  return httpRequest.get('/api/public/auth/user');
};

const create = (params) => {
  return httpRequest.post('/api/audit/query/', params);
};

const update = (id, params) => {
  return httpRequest.put(`/api/audit/query/${id}`, params);
};

export const authService = {
  public: {
    user: publicUser,
  },
  signin,
  signout,
  user,
  create,
  update,
};

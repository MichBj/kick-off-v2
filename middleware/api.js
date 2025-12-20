import nextConnect from 'next-connect';
import Api from '@lib/api';
import { toInteger } from 'lodash';

/** Convertir el identificador del registro obtenido mediante un request a
 * formato numérico */
const parseId = (request) => {
  const id = request.query?.id;
  if (id) request.query.id = toInteger(id);
};

const handler = () => {
  return async (request, response, next) => {
    const _api = new Api(request, response);
    request.api = _api;
    request.do = _api.handler;
    parseId(request);
    next();
  };
};

/** Middleware para establecer funciones de utilidades en el API */
const api = nextConnect().use(handler());

export default api;

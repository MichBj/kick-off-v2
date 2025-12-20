import { omit } from 'lodash';
import nextConnect from 'next-connect';

const handler = (keys) => {
  return async (request, _, next) => {
    request.body = omit(request.body, keys);
    next();
  };
};

/** Middleware para escapar datos obtenidos desde el cliente
 * @param keys LLaves que deben ser exluidas del request.body
 */
const escape = (keys) => {
  return nextConnect().use(handler(keys));
};

const parser = { escape };

export default parser;

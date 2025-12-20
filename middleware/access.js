import nextConnect from 'next-connect';
import database from '@middleware/database';
import AccessData from '@database/base/access';

const handler = (entityCode) => {
  return async (request, _, next) => {
    if (request.user) {
      // FIXME: Admin shouldn't be on code
      if (request.user.id === 1) return next();
      const db = request.db.access;
      const access = await db
        .user(request.user)
        .entities([entityCode])
        .getAll();
      if (access.length == [])
        request.access = { Entity: { code: entityCode } };
      else if (access.length > 0) request.access = access[0];
    }
    next();
  };
};

/** Middleware para realizar el control de accesos a las API por entidad
 * @param entityCode Código de la entidad a controlar
 */
const access = (entityCode) => {
  return nextConnect().use(database(AccessData)).use(handler(entityCode));
};

export default access;

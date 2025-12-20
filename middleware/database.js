import nextConnect from 'next-connect';

const handler = (objectData, options) => {
  return async (request, _, next) => {
    const db = new objectData();
    if (options.auditable) db.setAudited(request.user);
    if (request.api?.where) db.setDefaultFilter(request.api.where);
    if (request.api?.select) db.setDefaultSelect(request.api.select);
    if (request.api?.take) db.setDefaultTake(request.api.take);
    if (request.api?.skip) db.setDefaultSkip(request.api.skip);
    if (request.api?.cursor) db.setDefaultCursor(request.api.cursor);
    if (request.api?.filter) db.setRequestWhere(request.api.filter);
    if (request.api?.count) db.setCount(request.api.count);
    if (request.api?.orderBy) db.setOrderBy(request.api.orderBy);
    if (!request.db) request.db = {};
    // FIXME: All database object should have a name
    request.db[db.name] = db;
    next();
  };
};

/** Middleware para establecer la entidad de Base de Datos a utilizar en el API
 * @param objectData Objeto de base de datos a utilizar
 * @param options Lista de parámetros de configuración
 *  - `auditable`: Indicar si el objeto debe ser auditable
 */
const database = (objectData, options = { auditable: true }) => {
  return nextConnect().use(handler(objectData, options));
};

export default database;

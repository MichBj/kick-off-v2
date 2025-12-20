import prisma from '@database/client';
import { uniq } from 'lodash';
import { toInteger } from 'lodash';

class Api {
  /** Permite abstraer la lógica de permisos y transacciones de las API
   * @param request Request de la petición
   * @param response Response de la petición
   * @param handler Callback para la ejecución del API
   */
  constructor(request, response, handler) {
    this.request = request;
    this.response = response;
    this.id = null;
    this.#manageFilters();
    this.#manageHandler(handler);
  }

  /** Asigna un handler para utilizar como método `do` en el request */
  #manageHandler = (handler) => {
    if (handler) this.handler(null, handler);
  };

  /** Retorna una respuesta con status 200 y el JSON especificado */
  success = (data = {}) => {
    return this.response.status(200).json(data || {});
  };

  /** Recorna una respuesta con status 200 y el JSON especificado o un objeto por defecto */
  successOne = (record = {}) => {
    return this.success(record);
  };

  /** Recorna una respuesta con status 200 y el JSON especificado o una lista por defecto */
  successMany = (list = []) => {
    return this.success(list);
  };

  /** Retorna una respuesta con status 400 y el error especificado */
  failure = (error) => {
    return this.response.status(400).json({ message: error });
  };

  /** Retorna una respuesta con status 405 y el error espeficicado o un mensaje por defecto*/
  unauthorized = (error) => {
    return this.response.status(405).json({
      message: error || `Metodo ${this.request.method} no permitido`,
    });
  };

  // Manage API query params

  /** Configura todos los parámetros posibles para la petición */
  #manageFilters = () => {
    this.#manageActive();
    this.#manageFields();
    this.#manageTake();
    this.#manageSkip();
    this.#manageCursor();
    this.#manageFilter();
    this.#manageCount();
    this.#manageOrderBy();
  };

  /** Asigna los filtros recibidos por URL */
  #manageFilter = () => {
    this.filter = null;
    if (!this.request.query.filter) return;
    this.filter = JSON.parse(this.request.query.filter);
  };

  /** Asigna el ordenamiento recibido por URL */
  #manageOrderBy = () => {
    this.orderBy = null;
    if (!this.request.query.orderby) return;
    this.orderBy = JSON.parse(this.request.query.orderby);
  };

  /** Asigna el parámetro `take` recibido por URL */
  #manageTake = () => {
    this.take = null;
    if (!this.request.query.take) return;
    this.take = toInteger(this.request.query.take);
  };

  /** Asigna el parámetro `skip` recibido por URL */
  #manageSkip = () => {
    this.skip = null;
    if (!this.request.query.skip) return;
    this.skip = toInteger(this.request.query.skip);
  };

  /** Asigna el parámetro `cursor` recibido por URL */
  #manageCursor = () => {
    this.cursor = null;
    if (!this.request.query.cursor) return;
    this.cursor = toInteger(this.request.query.cursor);
  };

  /** Asigna el parámetro `active` recibido por URL */
  #manageActive = () => {
    this.where = null;
    if (!this.request?.query?.active) return;
    const active = this.request.query.active;
    const params = Array.isArray(active)
      ? uniq(active.map((val) => this.#single(val)))
      : this.#single(active);
    this.where = this.#activeFilter(params);
  };

  /** Asigna el `select` con formato `prisma` recibido por URL */
  #manageFields = () => {
    this.select = this.request?.query?.fields;
  };

  /** Asigna el parámetro `count` recibido por URL*/
  #manageCount = () => {
    this.count = this.request.query?.count;
  };

  /** Verifica que el valor recibido contenga únicamente `true` o `false` */
  #single = (value) => {
    if (!['true', 'false'].includes(value)) {
      throw new Error(`Parámetro active=${value} inválido`);
    }
    return JSON.parse(value);
  };

  /** Retorna el filtro de `active` recibido en formato `prisma` */
  #activeFilter = (params) => {
    if (Array.isArray(params)) {
      return {
        OR: params.map((value) => ({
          active: value,
        })),
      };
    }
    return { active: params };
  };

  // Handle API operation

  /** Comprueba si la operación espeficada es permitida en el `access` especificado previamente
   * @param operation Operación (read | create | write | remove)
   */
  #checkAccess = (operation) => {
    if (operation && this.request.access && !this.request.access[operation]) {
      throw new Error(
        `No tiene permisos para realizar esta operación - [${operation}] ${this.request.access?.Entity?.code}`,
      );
    }
  };

  /** Recarga las instancias de cada objeto en `this.request.db` con el cliente especificado
   * @param client Cliente de prisma
   */
  #reloadClients = async (client) => {
    let db = this.request.db;
    Object.entries(db).map((item) => {
      item[1].setTable(client);
      db[item[0]] = item[1];
    });
    this.request.db = db;
  };

  /** Ejecuta el método recibido dentro de un `transaction` de `prisma`
   * @param method Callback a ejecutar
   */
  #transaction = async (method) => {
    if (!this.request.db) return await method(this);
    return await prisma.$transaction(async (client) => {
      this.#reloadClients(client);
      await method(this, this.request.db);
    });
  };

  /** Ejecuta el método especificado y en caso de fallar lo informa al request
   * @param operation Operación utilizada (`read` | `create` | `write` | `remove`])
   * @param method Callback a ejecutar
   * @param control Variables condicionales.
   *  - `transaction`: Si es `true` ejecuta el método dentro de un prisma `transaction`
   */
  handler = async (operation, method, control = { transaction: false }) => {
    try {
      this.#checkAccess(operation);
      if (control.transaction) await this.#transaction(method);
      else await method(this, this.request.db);
    } catch (error) {
      if (process.env === 'development' && error.stack)
        this.failure(error?.message || error);
    }
  };
}

export default Api;

import fetch from 'isomorphic-unfetch';
import {
  isObject,
  isArray,
  isString,
  isInteger,
  isBoolean,
  isEmpty,
} from 'lodash';

/** Retorna la url completa de la url especificada si existe una url base */
const baseUrl = (url) => {
  return process.env.SSR_URL ? `${process.env.SSR_URL}${url}` : url;
};

/** Retorna la url con los parámetros indicados dentro de la url */
const addFilters = (url, filters) => {
  if (isEmpty(filters)) return url;
  const params = Object.entries(filters)
    .map(([key, value]) => {
      if (isString(value) || isInteger(value) || isBoolean(value))
        return `${key}=${value}`;
      if (key === 'active' && isArray(value))
        return value.map((item) => `${key}=${item}`).join('&');
      if (isObject(value) || isArray(value))
        return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
    })
    .join('&');
  return `${url}?${params}`;
};

/** Retorna el resultado de una operación GET y los filtros especificados */
const get = async (url, filters, authToken = null) => {
  url = addFilters(url, filters);
  const requestOptions = {
    method: 'GET',
    headers: {},
  };

  if (authToken) {
    requestOptions.headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(baseUrl(url), requestOptions);
  return handleResponse(response);
};

/** Retorna el resultado de una operación POST */
const post = async (url, body) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl(url), requestOptions);
  return handleResponse(response);
};

/** Retorna el resultado de una operación PUT */
const put = async (url, body) => {
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
  const response = await fetch(baseUrl(url), requestOptions);
  return handleResponse(response);
};

/** Retorna el resultado de una operación DELETE */
const _delete = async (url) => {
  const requestOptions = {
    method: 'DELETE',
  };
  const response = await fetch(baseUrl(url), requestOptions);
  return handleResponse(response);
};

// HANDLERS ---------------------------------------------------------------------------

/** Retorna un string con el estado y texto del error de una solicitud HTTP */
const statusError = (response) => {
  return `[${response.status}] ${response.statusText}`;
};

/** Comprueba la respuesta de una petición HTTP en base al estado de la respuesta.
 * - `Se generó un error`: Se retorna un `reject` con el mensaje de error recibido desde el Serivodr.
 * - `Petición exitosa`: contrario: Se retornan los datos de la petición desde el JSON recibido desde el Servidor*/
const handleResponse = (response) => {
  if (!response?.status) return handleNoStatus();
  if (response.status === 401) return handle401();
  if (response.status === 404) return handle404();
  if (response.status === 204) return;
  if (response.status === 500) return handle500(response);
  return handleResponseData(response);
};

/** Retorna un reject con un error predefinido de error inesperado */
const handleNoStatus = () => {
  return Promise.reject('Ocurrio un error inesperado al realizar la operación');
};

/** Retorna un reject de estado 401 al contar con credenciales incorrectas*/
const handle401 = () => {
  return Promise.reject('Usuario o contraseña incorrectos');
};

/** Retorna un reject de estado 404 al no encontrar la ruta especificada */
const handle404 = () => {
  return Promise.reject('Ruta no encontrada');
};

/** Retorna un reject de estado 500 al producirse un error en el servidor */
const handle500 = (response) => {
  return Promise.reject(`Error inesperado: ${statusError(response)}`);
};

/** Retorna los datos de una petición existosa y el mensaje de error obtenido desde el servidor */
const handleResponseData = async (response) => {
  try {
    const data = await response.json();
    if (response.status === 200) return data;
    return Promise.reject(data.message || statusError(response));
  } catch (error) {
    throw new Error(`Se produjo un error: ${error}`);
  }
};

export const httpRequest = {
  get,
  post,
  put,
  delete: _delete,
};

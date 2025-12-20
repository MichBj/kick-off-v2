import { snackbar } from '@lib/snackbar';

/** Retorna un objeto con la comparación entre los campos modificados y los datos
 * @param modified Lista de campos modificados
 * @param data Objeto {campo: valor} con los datos modificados
 * @example
 * const modified = ['name']
 * const data = { name: 'sample', age: 27 } |
 * _.dirtyData(modified, data)
 * // => { name: 'sample' }
 * */
const dirtyData = (modified, data) => {
  if (modified === true || Array.isArray(modified)) {
    if (data === undefined) return null;
    return data;
  }
  return Object.fromEntries(
    Object.keys(modified).map((key) => [
      key,
      dirtyData(modified[key], data[key]),
    ]),
  );
};

/** Retorna un objeto que extrae los datos del registro especificado en base a una
 * lista de campos, si un campo de la lista no tiene un valor válida, lo ubica como
 * un string vacío
 * @param record Objeto con datos del registro
 * @param fields Lista de campos a extraer
 * @example
 * const record = { name: 'sample', age: 27 }
 * const fields = ['name', 'address']
 * _.defaultValues(record, fields)
 * // => { name: 'sample', address: ''}
 */
const defaultValues = (record, fields = []) => {
  const value = (item) => item || '';
  const values = {};
  fields.map((field) => (values[field] = value(record[field])));
  return values;
};

/** Realiza la creación o modificación de un registro, gestiona los errores y el estado del formulario,
 * recibe un objeto con lass siguientes llaves:
 * @param recordId Identificador del registro a modificar, si no se indica se crea.
 * @param data Datos para la creación o modificación
 * @param service Servicio a utilizar para llamar al API
 * @param router Variable router de `useRouter` del componente o página
 * @param dirtyFields Lista de variables que fueron modificadas en el formulario
 * @param enqueueSnackbar Instancia de `useSnackbar` para mostrar mensajes
 * @param reset Método obtenido de `useForm` para reiniciar el formulario
 * @param setLoading Método requerido para controlar el indicador de carga
 * @param fields Lista de campos habilitados en el formulario para mapear los valores por defecto.
 * @param defaultHandler Método para mapear los valores por defecto
 */
const submit = async ({
  recordId,
  data,
  service,
  router,
  dirtyFields,
  enqueueSnackbar,
  reset,
  setLoading,
  fields,
  defaultHandler,
  successMessage = 'Guardado exitoso',
}) => {
  setLoading(true);
  try {
    const formData = dirtyData(dirtyFields, data);
    const response = recordId
      ? await service.update(recordId, formData)
      : await service.create(formData);
    snackbar.success(enqueueSnackbar, successMessage);
    if (!recordId) router.replace(`${response.id}`);
    reset(
      defaultHandler
        ? defaultHandler(response)
        : defaultValues(response, fields),
    );
    router.back();
  } catch (error) {
    snackbar.error(enqueueSnackbar, error);
  } finally {
    setLoading(false);
  }
};

export const form = { dirtyData, defaultValues, submit };

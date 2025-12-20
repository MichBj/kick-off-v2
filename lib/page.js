import { snackbar } from '@lib/snackbar';

/** Gestiona la ejecución de un método asíncrono en una página o componente
 * @param enqueueSnackbar Objeto SnackBar de `notistack` para mostrar moensajes
 * @param load Callback a procesar
 * @param end Callback a ejecutar cuando termine el Callback `load`
 * @param errorHandler Callback a ejecutar al producirse un error
 */
const loader = async (enqueueSnackbar, load, end, errorHandler) => {
  try {
    await load();
  } catch (error) {
    if (errorHandler) errorHandler();
    snackbar.error(enqueueSnackbar, error);
  } finally {
    end();
  }
};

export const page = {
  loader,
};

/** Retorna un objeto común con los props necesarios para el Server Side Rendering de un
 * registro en un formulario
 * @param id Identificador del registro
 * @param props Props que se requieren de forma adicional*/
export const serverProps = (id, props = {}) => {
  return { props: { ...props, id: id === 'create' ? null : id } };
};

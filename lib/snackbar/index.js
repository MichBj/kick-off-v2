const VERTICAL_POSITION = 'bottom';
const HORIZONTAL_POSITION = 'right';

/** Muestra el mensaje de error con las opciones indicadas */
const show = (enqueue, message, options) => {
  enqueue(message, {
    ...options,
    anchorOrigin: {
      vertical: VERTICAL_POSITION,
      horizontal: HORIZONTAL_POSITION,
    },
  });
};

/** Muestra el mensaje especificado como un éxito con las opciones permitidas
 * en el Snackbar*/
const success = (enqueue, message, options = {}) => {
  show(enqueue, message, { ...options, variant: 'success' });
};

/** Muestra el mensaje especificado como una advertencia con las opciones permitidas
 * en el Snackbar*/
const warning = (enqueue, message, options = {}) => {
  show(enqueue, message, { ...options, variant: 'warning' });
};

/** Muestra el mensaje especificado como una información con las opciones permitidas
 * en el Snackbar*/
const info = (enqueue, message, options = {}) => {
  show(enqueue, message, { ...options, variant: 'info' });
};

/** Muestra el mensaje especificado como un error con las opciones permitidas
 * en el Snackbar*/
const error = (enqueue, error, options = {}) => {
  const message = error?.message || error?.name || error;
  show(enqueue, message, { ...options, variant: 'error' });
};

export const snackbar = { success, error, warning, info };

/** Retorna un objeto utilizado para redireccionar a la url especificada del lado del servidor */
export const serverRedirect = (url) => {
  return {
    redirect: {
      permanent: false,
      destination: url || '/',
    },
  };
};

import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido').min(4).max(100),
  smtp: Yup.string().required('Servidor requerido').min(4).max(100),
  port: Yup.string()
    .required('Puerto requerido')
    .matches(/^[0-9]*$/, 'El Puerto debe ser un número'),
  email: Yup.string().required('Correo requerido').min(4).max(100),
  password: Yup.string().required('Contraseña requerida').min(4).max(100),
});

export const resolver = yupResolver(schema);

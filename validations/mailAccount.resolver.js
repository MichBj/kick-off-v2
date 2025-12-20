import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido').min(4).max(100),
  email: Yup.string().required('Correo requerido').min(4).max(100),
  moduleId: Yup.number().required('Módulo requerido'),
  mailServerId: Yup.number().required('Servidor de correo requerido'),
});

export const resolver = yupResolver(schema);

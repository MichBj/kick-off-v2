import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('La opcion de menu es requerido').min(4).max(100),
  descripcion: Yup.string(),
  order: Yup.number()
    .required('El campo de orden es requerido')
    .typeError('El campo de orden debe ser un número'),
});

export const resolver = yupResolver(schema);

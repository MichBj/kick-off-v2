import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('La opcion de menu es requerido').min(4).max(100),
  menuId: Yup.number().required('El menu principal es requerido'),
  order: Yup.number().required('El campo del orden es requerido.'),
});

export const resolver = yupResolver(schema);

import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  key: Yup.string().required('Código requerido'),
  name: Yup.string().required('Nombre requerido'),
  value: Yup.string().required('Valor requerido'),
});

export const resolver = yupResolver(schema);

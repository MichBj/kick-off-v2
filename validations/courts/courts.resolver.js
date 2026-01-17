import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido').min(4).max(100),
  location: Yup.string().required('Ubicación requerida'),
  userId: Yup.number().required('Usuario requerido'),
  isIndoor: Yup.boolean().required('Indicar si es Sintético o No'),
});

export const resolver = yupResolver(schema);

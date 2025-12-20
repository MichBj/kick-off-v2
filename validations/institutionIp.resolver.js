import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';
import { yup } from '@helper/yup/schemas';

setLocale(Locale);

const schema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  ip: Yup.string().required('IP pública requerida'),
  institutionId: yup.number(Yup).required('Institución requerida'),
  campusId: yup.number(Yup).required('Campus requerido'),
  latitude: Yup.string().required('Latitud por defecto requerida'),
  longitude: Yup.string().required('Longitud por defecto requerida'),
});

export const resolver = yupResolver(schema);

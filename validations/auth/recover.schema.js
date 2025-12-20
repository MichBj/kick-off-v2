import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  email: Yup.string()
    .required('Correo electronico requerido')
    .email('Correo electronico no valido'),
});

export const resolver = yupResolver(schema);

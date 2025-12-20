import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const REGEX = '^(?=.*\\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$';

const schema = Yup.object().shape({
  password: Yup.string()
    .required('Nueva contraseña requerida')
    .min(8, 'Debe tener al menos 8 caracteres')
    .test(
      'regex',
      'Requiere al menos, 1 caracter especial, 1 numero, 1 letra en mayuscula y minuscula ',
      (password) => new RegExp(REGEX).test(password),
    ),
  confirm: Yup.string()
    .required('Confirme su nueva contraseña')
    .oneOf([Yup.ref('password')], 'La contraseña no es igual'),
});

export const resolver = yupResolver(schema);

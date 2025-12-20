import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  current: Yup.string().required('Contraseña actual requerida'),
  password: Yup.string()
    .required('Nueva contraseña requerida')
    .min(8)
    .test(
      'regex',
      'Requiere al menos, 1 caracter especial, 1 numero, 1 letra en mayuscula y minuscula ',
      (val) => {
        let regExp = new RegExp(
          '^(?=.*\\d)(?=.*[!@#$%^&*.])(?=.*[a-z])(?=.*[A-Z]).{8,}$',
        );
        return regExp.test(val);
      },
    ),
  confirm: Yup.string()
    .required('Confirme su nueva contraseña')
    .oneOf([Yup.ref('password')], 'La contrase;a no es igual'),
});

const changePasswordFormOptions = { resolver: yupResolver(schema) };

export default changePasswordFormOptions;

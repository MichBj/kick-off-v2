import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  roleId: Yup.string().required('Rol querido'),
  menuId: Yup.string().required('Menú requerido'),
});

const roleMenuFormOptions = { resolver: yupResolver(schema) };

export default roleMenuFormOptions;

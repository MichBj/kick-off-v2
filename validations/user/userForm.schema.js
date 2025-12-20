import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';

setLocale(Locale);

const schema = Yup.object().shape({
  dni: Yup.string().required('Cedula/Pasaporte/Codigo requerido'),
  firstName: Yup.string().required('Nombre requerido').min(4).max(100),
  lastName: Yup.string().required('Apellido requerido').min(4).max(100),
  personalEmail: Yup.string()
    .required('Correo personal requerido')
    .email('Correo personal incorrecto'),
  accountNameSwitch: Yup.boolean(),
  accountName: Yup.string().when('accountNameSwitch', {
    is: true,
    then: Yup.string().required('Usuario no editado').min(4).max(20),
  }),
  displayNameSwitch: Yup.boolean(),
  displayName: Yup.string().when('displayNameSwitch', {
    is: true,
    then: Yup.string().required('Nombre para mostrar no editado').min(4),
  }),
  emailSwitch: Yup.boolean(),
  email: Yup.string().when('emailSwitch', {
    is: true,
    then: Yup.string()
      .required('Correo Institucional no editado')
      .email('Correo Institucional incorrecto'),
  }),
  groupType: Yup.array()
    .required('Al menos un grupo requerido')
    .min(1, 'Al menos un grupo requerido'),
  ouType: Yup.array()
    .required('Unidad Organizativa requerida')
    .min(1, 'Unidad Organizativa requerida'),
  passwordType: Yup.array()
    .required('Tipo contraseña requerida')
    .min(1, 'Tipo contraseña requerida'),
  rolesType: Yup.array().required('Roles requerido').min(1, 'Roles requerido'),
});

const userFormOptions = { resolver: yupResolver(schema) };

export default userFormOptions;

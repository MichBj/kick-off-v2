import * as Yup from 'yup';
import { setLocale } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Locale from '@validations/common';
import { isEmpty } from 'lodash';
import { yup } from '@helper/yup/schemas';

setLocale(Locale);

const schema = Yup.object().shape({
  username: Yup.string().required(''),
  password: Yup.string().required(''),
  institutionId: yup.number(Yup).when('institutions', {
    is: (institutions) => !isEmpty(institutions),
    then: yup.number(Yup).required('Institución requerida'),
  }),
});

export const resolver = yupResolver(schema);

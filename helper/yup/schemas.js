const numberSchema = (yup) => {
  return yup.number().transform((value) => (isNaN(value) ? undefined : value));
};

const dateSchema = (yup) => {
  return yup
    .date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr));
};

export const yup = { number: numberSchema, date: dateSchema };

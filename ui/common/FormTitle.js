import Title from '@ui/common/Title';

const FormTitle = ({ record, title, children }) => {
  const action = record.id ? 'MODIFICAR' : 'CREAR';
  return <Title title={`${action} ${title}`}>{children}</Title>;
};

export default FormTitle;

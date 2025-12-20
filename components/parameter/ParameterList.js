import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { selector } from '@redux/reducers/accessSlice';
import { useSelector } from 'react-redux';
import { parameterService } from '@services/parameter.service';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'key', name: 'Código' },
  { code: 'name', name: 'Nombre' },
  { code: 'value', name: 'Valor' },
]);

const ParameterList = ({ where }) => {
  const access = useSelector(selector.access.parameter);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={parameterService}
      searchable={SEARCH}
      url="/base/config/parameter"
      title="name"
      description={(record) => `Llave: ${record.key} - Valor: ${record.value}`}
      access={access}
    />
  );
};

export default ParameterList;

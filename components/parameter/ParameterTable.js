import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { parameterService } from '@services/parameter.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

const ParameterTable = ({ where }) => {
  const access = useSelector(selector.access.parameter);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'key', headerName: 'Código', flex: 1 },
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'value', headerName: 'Valor', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <ActionCell
          record={record}
          url="/base/config/parameter"
          service={parameterService}
          access={access}
        />
      ),
    },
  ];
  return (
    <DataGridServer where={where} service={parameterService} columns={column} />
  );
};

export default ParameterTable;

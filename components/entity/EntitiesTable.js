import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { entityService } from '@services/entity.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/entity';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return { ...row, module: row.Module?.name };
  });
};

const EntitiesTable = ({ where }) => {
  const access = useSelector(selector.access.entity);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombres', flex: 1 },
    { field: 'code', headerName: 'Código', flex: 1 },
    { field: 'module', headerName: 'Módulo', flex: 1 },
    {
      field: 'Acciones',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/base/config/entities"
            access={access}
            activate={false}
          />
        );
      },
    },
  ];

  return (
    <DataGridServer
      where={where}
      service={entityService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default EntitiesTable;

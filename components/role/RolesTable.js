import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { roleService } from '@services/role.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/role';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row, module: row.Module?.name }));
};

const ModuleTable = ({ where }) => {
  const access = useSelector(selector.access.role);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'module', headerName: 'Módulo', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/base/config/roles"
            service={roleService}
            access={access}
          />
        );
      },
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={roleService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default ModuleTable;

import DataGridServer from '@ui/common/DataGridServer';
import ActionCell from '@ui/common/ActionCell';
import Forbidden from '@ui/common/Forbidden';
import { menuService } from '@services/menu.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/menu';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return {
      ...row,
      module: row.Module?.name,
      url: row.Page?.url,
      menu: row.Menu?.name,
    };
  });
};

const MenusTable = ({ where }) => {
  const access = useSelector(selector.access.menu);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'module', headerName: 'Módulo', flex: 1 },
    { field: 'url', headerName: 'Página', flex: 1 },
    { field: 'menu', headerName: 'Menú Padre', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/base/config/menus"
            service={menuService}
            access={access}
          />
        );
      },
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={menuService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default MenusTable;

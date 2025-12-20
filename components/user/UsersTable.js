import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { userService } from '@services/user.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/user';
import Avatar from '@material-ui/core/Avatar';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return {
      ...row,
      dni: row.Person?.dni,
      photo: row.Person?.photo,
      name: row.Person?.name || row.username.toUpperCase(),
    };
  });
};

const field = (field, name, renderCell) => {
  return {
    field: field,
    headerName: name,
    headerAlign: 'center',
    align: 'center',
    flex: 0.3,
    renderCell,
    filterable: false,
    sortable: false,
  };
};

const UsersTable = ({ where }) => {
  const access = useSelector(selector.access.user);

  if (!access.read) return <Forbidden />;

  const column = [
    field('photo', 'Foto', (cell) => {
      return (
        <Avatar alt={cell.row?.Person?.name} src={cell.row?.Person?.photo} />
      );
    }),
    { field: 'username', headerName: 'Usuario', flex: 1 },
    { field: 'dni', headerName: 'Cédula/Pasaporte', flex: 0.5 },
    { field: 'name', headerName: 'Nombres', flex: 1.5 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'id', headerName: 'Identificador', hide: true, flex: 0.3 },
    {
      field: 'Acciones',
      align: 'center',
      headerAlign: 'center',
      width: 220,
      filterable: false,
      sortable: false,
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/base/users"
            service={userService}
            access={access}
          />
        );
      },
    },
  ];

  return (
    <DataGridServer
      where={where}
      service={userService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default UsersTable;

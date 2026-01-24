import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { courtsService } from '@services/courts/courts.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/user';
import { Avatar } from 'antd';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return {
      ...row,
      user: row.User?.username,
      userEmail: row.User?.email,
    };
  });
};

const CourtTable = ({ where }) => {
  const access = useSelector(selector.access.court);

  if (!access.read) return <Forbidden />;

  const column = [
    {
      field: 'name',
      headerName: 'Cancha',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'location',
      headerName: 'Ubicación',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'user',
      headerName: 'Usuario',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'userEmail',
      headerName: 'Email',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'isIndoor',
      headerName: 'Es de Indoor',
      flex: 1,
      sortable: true,
      filterable: true,
    },
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
            service={courtsService}
            access={access}
          />
        );
      },
    },
  ];

  return (
    <DataGridServer
      where={where}
      service={courtsService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default CourtTable;

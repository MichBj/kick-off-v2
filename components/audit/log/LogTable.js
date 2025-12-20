import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import { dates } from '@lib/dates';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { logService } from '@services/log.service';
import { filterHandler, sortHandler } from '@helper/filtering/audit/log';

const parseHandler = (rows) => {
  return rows.map((item) => {
    return {
      ...item,
      user: item.User?.username,
      data: JSON.stringify(item.data),
      record: JSON.stringify(item.record),
      datetime: dates.toString(item.datetime),
    };
  });
};

const LogTable = ({ where }) => {
  const access = useSelector(selector.access.log);

  if (!access.read) return <Forbidden />;

  const column = [
    {
      field: 'user',
      headerName: 'Usuario',
      width: 150,
      flex: 0.8,
    },
    {
      field: 'datetime',
      headerName: 'Fecha',
      width: 150,
      flex: 0.7,
      type: 'date',
    },
    { field: 'action', headerName: 'Acción', width: 150, flex: 0.5 },
    { field: 'table', headerName: 'Tabla', width: 150, flex: 0.5 },
    {
      field: 'record',
      headerName: 'Registro',
      flex: 0.5,
      filterable: false,
    },
    {
      field: 'data',
      headerName: 'Datos',
      flex: 3,
      filterable: false,
    },
  ];

  return (
    <DataGridServer
      where={where}
      orderBy={[{ id: 'desc' }]}
      service={logService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default LogTable;

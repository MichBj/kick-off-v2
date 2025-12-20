import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { toString } from 'lodash';
import { logService } from '@services/log.service';
import { filterHandler, sortHandler } from '@helper/filtering/audit/log';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'user', name: 'Usuario' },
  { code: 'datetime', name: 'Fecha', type: 'date' },
  { code: 'action', name: 'Acción' },
  { code: 'table', name: 'Tabla' },
]);

const title = (row) => {
  const table = toString(row.table).toUpperCase();
  const action = toString(row.action).toUpperCase();
  return `${table} - ${action}`;
};

const description = (row) => {
  return `${row.User?.username} - ${JSON.stringify(row.record)}`;
};

const LogList = ({ where }) => {
  const access = useSelector(selector.access.log);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={logService}
      searchable={SEARCH}
      title={title}
      description={description}
      active={true}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default LogList;

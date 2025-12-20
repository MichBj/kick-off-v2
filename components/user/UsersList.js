import Forbidden from '@ui/common/Forbidden';
import DataList from '@ui/common/DataList';
import { selector } from '@redux/reducers/accessSlice';
import { useSelector } from 'react-redux';
import { userService } from '@services/user.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/user';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'username', name: 'Usuario' },
  { code: 'dni', name: 'Cédula' },
  { code: 'name', name: 'Nombre' },
  { code: 'email', name: 'Correo' },
]);

const UsersList = ({ where }) => {
  const access = useSelector(selector.access.user);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={userService}
      searchable={SEARCH}
      url="/base/users"
      title={(record) => record.Person?.name || record.username?.toUpperCase()}
      description="email"
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default UsersList;

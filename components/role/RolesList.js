import DataList from '@ui/common/DataList';
import { selector } from '@redux/reducers/accessSlice';
import { useSelector } from 'react-redux';
import { roleService } from '@services/role.service';
import { filterHandler, sortHandler } from '@helper/filtering/base/role';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'module', name: 'Module' },
]);

const RolesList = ({ where }) => {
  const access = useSelector(selector.access.role);

  return (
    <DataList
      where={where}
      service={roleService}
      searchable={SEARCH}
      url="/base/config/roles"
      title="name"
      description={(row) => row.Module?.name}
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default RolesList;

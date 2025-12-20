import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { menuService } from '@services/menu.service';
import { sortHandler, filterHandler } from '@helper/filtering/base/menu';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'module', name: 'Módulo' },
  { code: 'url', name: 'Ruta' },
  { code: 'menu', name: 'Menú' },
]);

const MenusList = ({ where }) => {
  const access = useSelector(selector.access.menu);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={menuService}
      searchable={SEARCH}
      url="/base/config/menus"
      title="name"
      description={(row) => row.Module?.name}
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default MenusList;

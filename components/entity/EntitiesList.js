import Forbidden from '@ui/common/Forbidden';
import DataList from '@ui/common/DataList';
import { entityService } from '@services/entity.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/entity';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'code', name: 'Código' },
  { code: 'module', name: 'Módulo' },
]);

const EntitiesList = ({ where }) => {
  const access = useSelector(selector.access.entity);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={entityService}
      searchable={SEARCH}
      url="/base/config/entities"
      title="name"
      description={(row) => row.Module?.name}
      access={access}
      active={true}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default EntitiesList;

import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { pageService } from '@services/page.service';
import { filterHandler, sortHandler } from '@helper/filtering/base/page';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'url', name: 'Ruta' },
  { code: 'module', name: 'Módulo' },
]);

const PagesList = ({ where }) => {
  const access = useSelector(selector.access.page);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={pageService}
      searchable={SEARCH}
      url="/base/config/pages"
      title="name"
      description="url"
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default PagesList;

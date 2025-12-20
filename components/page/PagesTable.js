import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { pageService } from '@services/page.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { filterHandler, sortHandler } from '@helper/filtering/base/page';

const parseHandler = (rows) => {
  return rows.map((row) => ({ ...row, module: row.Module?.name }));
};

const PageTable = ({ where }) => {
  const access = useSelector(selector.access.page);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    { field: 'url', headerName: 'Ruta', flex: 1 },
    { field: 'module', headerName: 'Módulo', flex: 1 },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (record) => (
        <ActionCell
          record={record}
          url="/base/config/pages"
          service={pageService}
          access={access}
        />
      ),
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={pageService}
      columns={column}
      parseHandler={parseHandler}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default PageTable;

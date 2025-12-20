import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { mailAccountService } from '@services/mailAccount.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import {
  sortHandler,
  filterHandler,
} from '@helper/filtering/base/mail/account';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return {
      ...row,
      module: row.Module?.name,
      server: row.MailServer?.name,
    };
  });
};

const MailAccountTable = ({ where }) => {
  const access = useSelector(selector.access.mailAccount);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    {
      field: 'email',
      headerName: 'Correo de notificaciones',
      flex: 1,
    },
    {
      field: 'server',
      headerName: 'Servidor SMTP',
      flex: 1,
    },
    {
      field: 'module',
      headerName: 'Modulo',
      flex: 1,
    },
    {
      field: 'Acciones',
      width: 220,
      headerAlign: 'center',
      align: 'center',
      filterable: false,
      sortable: false,
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/base/config/mail/account"
            service={mailAccountService}
            access={access}
          />
        );
      },
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={mailAccountService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default MailAccountTable;

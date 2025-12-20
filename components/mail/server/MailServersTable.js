import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { mailServerService } from '@services/mailServer.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

const MailServerTable = ({ where }) => {
  const access = useSelector(selector.access.mailServer);

  if (!access.read) return <Forbidden />;

  const column = [
    { field: 'name', headerName: 'Nombre', flex: 1 },
    {
      field: 'smtp',
      headerName: 'Servidor de correo (SMTP)',
      flex: 1,
    },
    {
      field: 'port',
      headerName: 'Puerto',
      flex: 1,
      filterable: false,
      sortable: false,
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
            url="/base/config/mail/server"
            service={mailServerService}
            access={access}
          />
        );
      },
    },
  ];
  return (
    <DataGridServer
      where={where}
      service={mailServerService}
      columns={column}
    />
  );
};

export default MailServerTable;

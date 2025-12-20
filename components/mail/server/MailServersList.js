import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { mailServerService } from '@services/mailServer.service';
import { filterList } from '@lib/datagrid';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'smtp', name: 'Servidor' },
]);

const MailServerList = ({ where }) => {
  const access = useSelector(selector.access.mailServer);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={mailServerService}
      searchable={SEARCH}
      url="/base/config/mail/server"
      title="name"
      description="smtp"
      access={access}
    />
  );
};

export default MailServerList;

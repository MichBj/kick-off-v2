import DataList from '@ui/common/DataList';
import Forbidden from '@ui/common/Forbidden';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { mailAccountService } from '@services/mailAccount.service';
import { filterList } from '@lib/datagrid';
import {
  sortHandler,
  filterHandler,
} from '@helper/filtering/base/mail/account';

const SEARCH = filterList([
  { code: 'name', name: 'Nombre' },
  { code: 'email', name: 'Correo' },
  { code: 'server', name: 'Servidor' },
  { code: 'module', name: 'Módulo' },
]);

const MailAccountList = ({ where }) => {
  const access = useSelector(selector.access.mailAccount);

  if (!access.read) return <Forbidden />;

  return (
    <DataList
      where={where}
      service={mailAccountService}
      searchable={SEARCH}
      url="/base/config/mail/account"
      title="name"
      description={(record) =>
        `[${record.Module?.name}] ${record.MailServer?.name}`
      }
      access={access}
      filterHandler={filterHandler}
      sortHandler={sortHandler}
    />
  );
};

export default MailAccountList;

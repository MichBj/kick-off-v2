import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import MailAccountTable from '@components/mail/account/MailAccountsTable';
import MailAccountList from '@components/mail/account/MailAccounstList';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const MailNotification = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="CORREOS PARA NOTIFICACIONES">
          <CreateButton
            url="/base/config/mail/account/create"
            selector={selector.access.mailAccount}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<MailAccountList />} web={<MailAccountTable />} />
      </Container>
    </Grid>
  );
};

MailNotification.propTypes = {};
MailNotification.Layout = Dashboard;

export default MailNotification;

import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import MailServerTable from '@components/mail/server/MailServersTable';
import MailServerList from '@components/mail/server/MailServersList';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const MailServer = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="SERVIDORES DE CORREO">
          <CreateButton
            url="/base/config/mail/server/create"
            selector={selector.access.mailServer}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<MailServerList />} web={<MailServerTable />} />
      </Container>
    </Grid>
  );
};

MailServer.propTypes = {};
MailServer.Layout = Dashboard;

export default MailServer;

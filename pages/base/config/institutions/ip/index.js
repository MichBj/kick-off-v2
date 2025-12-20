import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import InstitutionIpList from '@components/institution/ip/InstitutionIpList';
import InstitutionIpTable from '@components/institution/ip/InstitutionIpTable';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const InstitutionIps = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="LISTA DE IPS INSTITUCIONALES">
          <CreateButton
            url="/base/config/institutions/ip/create"
            selector={selector.access.institutionip}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker
          mobile={<InstitutionIpList />}
          web={<InstitutionIpTable />}
        />
      </Container>
    </Grid>
  );
};

InstitutionIps.propTypes = {};
InstitutionIps.Layout = Dashboard;

export default InstitutionIps;

import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import InstitutionList from '@components/institution/InstitutionList';
import InstitutionTable from '@components/institution/InstitutionTable';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Institutions = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="INSTITUCIONES">
          <CreateButton
            url="/base/config/institutions/create"
            selector={selector.access.institution}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<InstitutionList />} web={<InstitutionTable />} />
      </Container>
    </Grid>
  );
};

Institutions.propTypes = {};
Institutions.Layout = Dashboard;

export default Institutions;

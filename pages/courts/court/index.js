import Dashboard from '@ui/layout/Dashboard';
import Grid from '@ui/common/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';
import CourtTable from '@components/courts/court/CourtTable';

const Courts = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="CANCHAS">
          <CreateButton
            url="/courts/court/create"
            selector={selector.access.court}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<></>} web={<CourtTable></CourtTable>} />
      </Container>
    </Grid>
  );
};

Courts.propTypes = {};
Courts.Layout = Dashboard;

export default Courts;

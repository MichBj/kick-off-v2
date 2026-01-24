import Dashboard from '@ui/layout/Dashboard';
import Grid from '@ui/common/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';
import ScheduleTable from '@components/courts/schedule/ScheduleTable';

const Schedules = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="HORARIOS DE CANCHAS">
          <CreateButton
            url="/courts/config/schedule/create"
            selector={selector.access.court}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<></>} web={<ScheduleTable></ScheduleTable>} />
      </Container>
    </Grid>
  );
};

Schedules.propTypes = {};
Schedules.Layout = Dashboard;

export default Schedules;

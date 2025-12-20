import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import LogTable from '@components/audit/log/LogTable';
import LogList from '@components/audit/log/LogList';
import Title from '@ui/common/Title';

const Log = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="LOGS DE AUDITORÍA" />
      </Container>
      <Container>
        <MobilePicker mobile={<LogList />} web={<LogTable />} />
      </Container>
    </Grid>
  );
};

Log.propTypes = {};
Log.Layout = Dashboard;

export default Log;

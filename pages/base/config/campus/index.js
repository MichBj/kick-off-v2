import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import CampusList from '@components/campus/CampusList';
import CampusTable from '@components/campus/CampusTable';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Campus = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="CAMPUS">
          <CreateButton
            url="/base/config/campus/create"
            selector={selector.access.campus}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<CampusList />} web={<CampusTable />} />
      </Container>
    </Grid>
  );
};

Campus.propTypes = {};
Campus.Layout = Dashboard;

export default Campus;

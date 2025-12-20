import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import ParameterList from '@components/parameter/ParameterList';
import ParameterTable from '@components/parameter/ParameterTable';
import { selector } from '@redux/reducers/accessSlice';

const Parameter = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="PARÁMETROS">
          <CreateButton
            url="/base/config/parameter/create"
            selector={selector.access.parameter}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<ParameterList />} web={<ParameterTable />} />
      </Container>
    </Grid>
  );
};

Parameter.propTypes = {};
Parameter.Layout = Dashboard;

export default Parameter;

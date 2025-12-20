import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import EntitiesList from '@components/entity/EntitiesList';
import EntitiesTable from '@components/entity/EntitiesTable';
import { selector } from '@redux/reducers/accessSlice';

const Entities = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="ENTIDADES">
          <CreateButton
            url="/base/config/entities/create"
            selector={selector.access.entity}
          >
            REGISTRAR
          </CreateButton>
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<EntitiesList />} web={<EntitiesTable />} />
      </Container>
    </Grid>
  );
};

Entities.propTypes = {};
Entities.Layout = Dashboard;

export default Entities;

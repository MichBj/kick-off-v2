import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import RolesList from '@components/role/RolesList';
import RolesTable from '@components/role/RolesTable';
import { selector } from '@redux/reducers/accessSlice';

const Roles = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="ROLES">
          <CreateButton
            url="/base/config/roles/create"
            selector={selector.access.role}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<RolesList />} web={<RolesTable />} />
      </Container>
    </Grid>
  );
};

Roles.propTypes = {};
Roles.Layout = Dashboard;

export default Roles;

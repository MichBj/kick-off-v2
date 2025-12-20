import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import UsersTable from '@components/user/UsersTable';
import UsersList from '@components/user/UsersList';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Users = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="USUARIOS">
          <CreateButton
            url="/base/users/create"
            selector={selector.access.user}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<UsersList />} web={<UsersTable />} />
      </Container>
    </Grid>
  );
};

Users.propTypes = {};
Users.Layout = Dashboard;

export default Users;

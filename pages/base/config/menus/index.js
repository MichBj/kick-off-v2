import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import MenusList from '@components/menu/MenusList';
import MenusTable from '@components/menu/MenusTable';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Menus = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="MENUS">
          <CreateButton
            url="/base/config/menus/create"
            selector={selector.access.menu}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<MenusList />} web={<MenusTable />} />
      </Container>
    </Grid>
  );
};

Menus.propTypes = {};
Menus.Layout = Dashboard;

export default Menus;

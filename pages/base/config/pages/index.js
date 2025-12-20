import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import MobilePicker from '@ui/common/MobilePicker';
import PagesList from '@components/page/PagesList';
import PagesTable from '@components/page/PagesTable';
import Title from '@ui/common/Title';
import CreateButton from '@ui/common/CreateButton';
import { selector } from '@redux/reducers/accessSlice';

const Pages = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="PÁGINAS">
          <CreateButton
            url="/base/config/pages/create"
            selector={selector.access.page}
          />
        </Title>
      </Container>
      <Container>
        <MobilePicker mobile={<PagesList />} web={<PagesTable />} />
      </Container>
    </Grid>
  );
};

Pages.propTypes = {};
Pages.Layout = Dashboard;

export default Pages;

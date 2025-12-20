import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import MenuForm from '@components/menu/MenuForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { menuService } from '@services/menu.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Menu = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.menu);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await menuService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="MENÚ">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={menuService}
        />
      </FormTitle>
      <MenuForm record={record} />
    </Grid>
  );
};

Menu.propTypes = {};
Menu.Layout = Dashboard;

export default Menu;

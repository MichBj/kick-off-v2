import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Container from '@ui/common/Container';
import ModulesList from '@components/module/ModulesList';
import Title from '@ui/common/Title';
import Forbidden from '@ui/common/Forbidden';
import Loading from '@ui/common/Loading';
import { useSnackbar } from 'notistack';
import { moduleService } from '@services/module.service';
import { useState, useEffect } from 'react';
import { page } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

const Modules = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.module);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () =>
        setData(await moduleService.getAll({ active: [true, false] })),
      () => setLoading(false),
    );
  }, [enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;

  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="MODULOS" />
      </Container>
      <Container>
        <ModulesList rows={data} />
      </Container>
    </Grid>
  );
};

Modules.propTypes = {};
Modules.Layout = Dashboard;

export default Modules;

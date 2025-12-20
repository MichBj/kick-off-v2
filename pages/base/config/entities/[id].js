import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import EntityForm from '@components/entity/EntityForm';
import FormTitle from '@ui/common/FormTitle';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { entityService } from '@services/entity.service';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Entity = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.entity);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await entityService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="ENTIDAD" />
      <EntityForm record={record} />
    </Grid>
  );
};

Entity.propTypes = {};
Entity.Layout = Dashboard;

export default Entity;

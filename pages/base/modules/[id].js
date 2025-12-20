import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import ModuleForm from '@components/module/ModuleForm';
import FormTitle from '@ui/common/FormTitle';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import ActiveButton from '@ui/common/ActiveButton';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { moduleService } from '@services/module.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Module = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.module);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await moduleService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="MODULO ">
        {record.code === 'base' ? (
          <></>
        ) : (
          <ActiveButton
            rowId={record.id}
            active={record.active}
            service={moduleService}
          />
        )}
      </FormTitle>
      <ModuleForm record={record} />
    </Grid>
  );
};

Module.propTypes = {};
Module.Layout = Dashboard;

export default Module;

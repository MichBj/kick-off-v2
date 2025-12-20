import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import ParameterForm from '@components/parameter/ParameterForm';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { parameterService } from '@services/parameter.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Parameter = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.parameter);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await parameterService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="PARÁMETROS">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={parameterService}
        />
      </FormTitle>
      <ParameterForm record={record} />
    </Grid>
  );
};

Parameter.propTypes = {};
Parameter.Layout = Dashboard;

export default Parameter;

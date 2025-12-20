import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import InstitutionIpForm from '@components/institution/ip/InstitutionIpForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { institutionIpService } from '@services/institutionIp.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const InstitutionIp = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.institutionip);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await institutionIpService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="IP INSTITUCIONAL">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={institutionIpService}
        />
      </FormTitle>
      <InstitutionIpForm record={record} />
    </Grid>
  );
};

InstitutionIp.propTypes = {};
InstitutionIp.Layout = Dashboard;

export default InstitutionIp;

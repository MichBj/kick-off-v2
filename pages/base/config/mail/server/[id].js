import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import MailServerForm from '@components/mail/server/MailServerForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { mailServerService } from '@services/mailServer.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const MailServer = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.mailServer);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await mailServerService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="SERVIDOR DE CORREO">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={mailServerService}
        />
      </FormTitle>
      <MailServerForm record={record} />
    </Grid>
  );
};

MailServer.propTypes = {};
MailServer.Layout = Dashboard;

export default MailServer;

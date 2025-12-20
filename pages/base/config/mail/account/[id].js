import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import MailAccountForm from '@components/mail/account/MailAccountForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { mailAccountService } from '@services/mailAccount.service';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const MailAccount = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.mailAccount);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await mailAccountService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="CUENTA DE CORREO">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={mailAccountService}
        />
      </FormTitle>
      <MailAccountForm record={record} />
    </Grid>
  );
};

MailAccount.propTypes = {};
MailAccount.Layout = Dashboard;

export default MailAccount;

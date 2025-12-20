import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import UserForm from '@components/user/UserForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useState, useEffect } from 'react';
import { userService } from '@services/user.service';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const User = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.user);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await userService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="USUARIO">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={userService}
        />
      </FormTitle>
      <UserForm record={record} />
    </Grid>
  );
};

User.propTypes = {};
User.Layout = Dashboard;

export default User;

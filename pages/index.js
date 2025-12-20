import Grid from '@material-ui/core/Grid';
import UserProfile from '@components/user/profile/UserProfile';
import Dashboard from '@ui/layout/Dashboard';
import Loading from '@ui/common/Loading';
import { useState, useEffect, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { authService } from '@services/auth.service';

const Home = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const load = useCallback(async () => {
    try {
      setUser(await authService.user());
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(() => load(), [load]);

  if (loading) return <Loading />;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
        <UserProfile profile={user} />
      </Grid>
      <Grid item xs={12} sm={7} md={8} lg={9} xl={10}></Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}></Grid>
    </Grid>
  );
};

Home.propTypes = {};
Home.Layout = Dashboard;

export default Home;

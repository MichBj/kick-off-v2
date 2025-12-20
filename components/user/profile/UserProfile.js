import Grid from '@material-ui/core/Grid';
import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import UserProfileCard from '@components/user/profile/UserProfileCard';
import UserProfileInfo from '@components/user/profile/UserProfileInfo';
import ChangePasswordDialog from '@components/user/password/ChangePasswordDialog';
import RecoverPasswordDialog from '../password/RecoverPasswordDialog';
import UserProfileLogo from '@components/user/profile/UserProfileLogo';
import Paper from '@ui/common/Paper';
import { useState } from 'react';
import { userService } from '@services/user.service';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { authService } from '@services/auth.service';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  main: {
    height: 160,
  },
  photo: {
    marginTop: -9,
    height: '100%',
    maxHeight: 100,
  },
  actions: {
    height: '100%',
  },
  actionPanel: {
    width: '100%',
    paddingTop: 10,
  },
}));

const UserProfile = (props) => {
  const classes = useStyles();
  const profile = props.profile;
  const [openChange, setOpenChange] = useState(false);
  const [openRecover, setOpenRecover] = useState(false);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpenChange = () => setOpenChange(true);
  const handleCloseChange = () => setOpenChange(false);
  const handleOpenRecover = () => setOpenRecover(true);
  const handleCloseRecover = () => setOpenRecover(false);

  const recoverPassword = async () => {
    if (!loading) {
      setLoading(true);
      try {
        // TODO: Get user email from local storage
        const user = await authService.user();
        const response = await userService.recoverPasswordByEmail(user.email);
        handleOpenRecover();
        snackbar.success(
          enqueueSnackbar,
          `Enlace de recuperación generado y enviado a: ${response.message}`,
        );
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Grid item container>
        <Grid container item direction="row" xs={12} className={classes.main}>
          <Grid
            item
            container
            justifyContent="center"
            alignItems="center"
            xs={6}
            className={classes.photo}
          >
            <UserProfileLogo person={profile.Person} />
          </Grid>
          <Grid
            item
            container
            justifyContent="flex-end"
            xs={6}
            className={classes.actions}
          >
            <Paper>
              <Grid container justifyContent="center">
                <strong>Credenciales</strong>
              </Grid>
              <Stack
                direction="column"
                spacing={1}
                className={classes.actionPanel}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleOpenChange}
                  fullWidth
                >
                  Cambiar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={recoverPassword}
                  fullWidth
                >
                  Recuperar
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        <UserProfileCard user={profile} />
      </Grid>
      <Grid item container>
        <UserProfileInfo user={profile} />
      </Grid>
      <ChangePasswordDialog open={openChange} onClose={handleCloseChange} />
      <RecoverPasswordDialog open={openRecover} onClose={handleCloseRecover} />
      {loading && <Loading />}
    </>
  );
};

export default UserProfile;

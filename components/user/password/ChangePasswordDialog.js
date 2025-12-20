import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Stack from '@mui/material/Stack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Loading from '@ui/common/Loading';
import changePasswordFormOptions from '@validations/user/ChangePassword.schema';
import { useForm } from 'react-hook-form';
import { userService } from '@services/user.service';
import { authService } from '@services/auth.service';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useTheme } from '@material-ui/core/styles';

const ChangePasswordDialog = (props) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm(changePasswordFormOptions);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit = async (data) => {
    if (data.password != data.confirm) {
      snackbar.error(
        enqueueSnackbar,
        'Las nueva contraseña no coincide con la confirmación',
      );
      return;
    }
    delete data.confirm;
    if (!loading) {
      setLoading(true);
      try {
        // TODO: Get user id on local storage
        const user = await authService.user();
        await userService.changePassword(user.id, data);
        snackbar.success(enqueueSnackbar, 'Contraseña modificada con éxito');
        reset();
        props.onClose();
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Cambio de Contraseña
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContentText>
              Rellene los siguientes formularios para poder cambiar su
              contraseña.
            </DialogContentText>
            <Grid container>
              <Grid item container>
                <TextField
                  id="current"
                  label="Indique su contraseña actual"
                  variant="outlined"
                  size="small"
                  type="password"
                  fullWidth
                  margin="dense"
                  {...register('current')}
                  helperText={errors.current?.message}
                  error={errors.current ? true : false}
                />
              </Grid>
              <Grid item container>
                <TextField
                  id="password"
                  label="Indique su nueva contraseña"
                  variant="outlined"
                  size="small"
                  type="password"
                  fullWidth
                  margin="dense"
                  {...register('password')}
                  helperText={errors.password?.message}
                  error={errors.password ? true : false}
                />
              </Grid>
              <Grid item container>
                <TextField
                  id="confirm"
                  label="Confirme su nueva contraseña"
                  variant="outlined"
                  size="small"
                  type="password"
                  fullWidth
                  margin="dense"
                  {...register('confirm')}
                  helperText={errors.confirm?.message}
                  error={errors.confirm ? true : false}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                fullWidth
              >
                Confirmar
              </Button>
              <Button
                size="medium"
                variant="contained"
                onClick={props.onClose}
                fullWidth
              >
                Cancelar
              </Button>
            </Stack>
          </Grid>
        </DialogActions>
      </Dialog>

      {loading && <Loading />}
    </>
  );
};

export default ChangePasswordDialog;

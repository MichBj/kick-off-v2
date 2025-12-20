import Layout from '@ui/layout/auth/Layout';
import Loading from '@ui/common/Loading';
import TextField from '@ui/common/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { userService } from '@services/user.service';
import { useRouter } from 'next/router';
import { resolver } from '@validations/auth/recover.schema';
const useStyles = makeStyles((theme) => ({
  instructionsContainer: {
    padding: 20,
  },
  fieldContainer: {
    [theme.breakpoints.down('md')]: {
      width: '80%',
      maxWidth: 300,
    },
    [theme.breakpoints.up('md')]: {
      width: '70%',
      maxWidth: 300,
    },
  },
  buttonContainer: {
    paddingTop: 25,
  },
}));
const Recover = () => {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver });
  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        const response = await userService.recoverPasswordByEmail(data.email);
        snackbar.success(
          enqueueSnackbar,
          `Enlace de recuperación generado y enviado a: ${response.message}`,
        );
        await router.push('/auth/signin');
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout forgot={false} subtitle={'Recuperar contraseña'}>
        <Grid item className={classes.instructionsContainer}>
          <Alert severity="info">
            Indique su correo electrónico registrado en el campo de texto
            posterior, de clic en el botón confirmar y recibirá a su correo un
            enlace con instrucciones para cambiar su contraseña
          </Alert>
        </Grid>
        <Grid item className={classes.fieldContainer}>
          <TextField
            control={control}
            id="email"
            label="Correo electrónico"
            disabled={loading}
            errors={errors.email}
          />
        </Grid>
        <Grid
          item
          className={[classes.fieldContainer, classes.buttonContainer]}
        >
          <Button
            type="submit"
            size="medium"
            fullWidth
            variant="contained"
            color="primary"
            align="center"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
          >
            Confirmar
          </Button>
        </Grid>
      </Layout>
      {loading && <Loading />}
    </form>
  );
};
export default Recover;

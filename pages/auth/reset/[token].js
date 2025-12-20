import Layout from '@ui/layout/auth/Layout';
import Loading from '@ui/common/Loading';
import TextField from '@ui/common/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Alert, AlertTitle } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { userService } from '@services/user.service';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { resolver } from '@validations/auth/reset.schema';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    textAlign: 'left',
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

export const getServerSideProps = async (context) => {
  const token = context.query.token;
  let props = {};
  try {
    props.user = await userService.getByRecoverToken(token);
  } catch (error) {
    props.error = error;
  }
  return { props };
};

const Reset = ({ user, error }) => {
  const classes = useStyles();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const recoverToken = router.query.token;
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: {
      name: user?.Person?.name,
      username: user?.username,
      password: '',
      confirm: '',
    },
  });

  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        data.token = recoverToken;
        await userService.resetPasswordByToken(recoverToken, data);
        snackbar.success(enqueueSnackbar, 'Contraseña modificada con éxito');
        reset();
        router.push('/auth/signin');
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout subtitle={'Reestablecer contraseña'}>
        {error ? (
          <Grid item className={classes.errorContainer}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {error}
            </Alert>
          </Grid>
        ) : (
          <>
            <Grid item className={classes.fieldContainer}>
              <TextField
                control={control}
                id="name"
                label="Nombres"
                disabled={true}
                errors={errors.name}
              />
            </Grid>
            <Grid item className={classes.fieldContainer}>
              <TextField
                control={control}
                id="username"
                label="Usuario"
                disabled={true}
                errors={errors.username}
              />
            </Grid>
            <Grid item className={classes.fieldContainer}>
              <TextField
                control={control}
                id="password"
                type="password"
                label="Nueva contraseña"
                disabled={loading}
                errors={errors.password}
              />
            </Grid>
            <Grid item className={classes.fieldContainer}>
              <TextField
                control={control}
                id="confirm"
                type="password"
                label="Confirme su nueva contraseña"
                disabled={loading}
                errors={errors.confirm}
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
          </>
        )}
      </Layout>
      {loading && <Loading />}
    </form>
  );
};

export default Reset;

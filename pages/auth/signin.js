import Layout from '@ui/layout/auth/Layout';
import Select from '@ui/common/Select';
import TextField from '@ui/common/TextField';
import Loading from '@ui/common/Loading';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { institutionService } from '@services/institution.service';
import { resolver } from '@validations/auth/singnin.resolver';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { authService } from '@services/auth.service';
import { toInteger } from 'lodash';

const useStyles = makeStyles((theme) => ({
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

export const getServerSideProps = async () => {
  const institutions = await institutionService.public.getAll();
  return { props: { institutions: institutions || [] } };
};

const Signin = ({ institutions }) => {
  const classes = useStyles();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [company, setCompany] = useState(institutions[0]?.name || '');
  const [logo, setLogo] = useState(institutions[0]?.logo || '');
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: { institutionId: institutions[0]?.id, institutions },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const user = await authService.public.user();
        if (user) await router.replace('/');
      } catch (error) {
      } finally {
        setChecking(false);
      }
    };
    load();
  }, [router]);

  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        await authService.signin({
          ...data,
          institutionId: toInteger(data.institutionId),
        });
        router.replace('/');
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
        manageDuePassword(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const manageDuePassword = (error) => {
    if (!(typeof error === 'string')) return;
    if (error.includes('Su contraseña ha caducado'))
      router.replace('/auth/recover');
  };

  const onChangeCompany = (company) => {
    setCompany(company.name);
    setLogo(company.logo);
  };

  if (checking) return <></>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Layout signin={false} logo={logo} institution={company}>
        <Grid item className={classes.fieldContainer}>
          <TextField
            control={control}
            id="username"
            label="Usuario"
            disabled={loading}
            errors={errors.username}
          />
        </Grid>
        <Grid item className={classes.fieldContainer}>
          <TextField
            control={control}
            id="password"
            type="password"
            label="Contraseña"
            disabled={loading}
            errors={errors.password}
          />
        </Grid>
        <Grid item className={classes.fieldContainer}>
          <Select
            control={control}
            id="institutionId"
            label="Institución"
            disabled={loading}
            errors={errors.institutionId}
            reload={false}
            records={institutions}
            onChange={onChangeCompany}
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
            Iniciar Sesión
          </Button>
        </Grid>
      </Layout>
      {loading && <Loading />}
    </form>
  );
};

export default Signin;

import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { mailServerService } from '@services/mailServer.service';
import { resolver } from '@validations/mailServer.resolver';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['name', 'smtp', 'port', 'email', 'password'];

const MailServerForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const onSubmit = async (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: mailServerService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      fields: FIELDS,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            control={control}
            id="name"
            label="Nombre"
            disabled={loading}
            errors={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="smtp"
            label="Servidor de correo saliente (SMTP)"
            disabled={loading}
            errors={errors.smtp}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="port"
            label="Puerto"
            disabled={loading}
            errors={errors.port}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="email"
            label="Correo de autenticación"
            disabled={loading}
            errors={errors.email}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="password"
            label="Contraseña"
            type="password"
            disabled={loading}
            errors={errors.password}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Button
            type="submit"
            size="medium"
            fullWidth
            variant="contained"
            color="primary"
            align="center"
            disabled={loading || !isDirty}
          >
            Comprobar y Guardar
          </Button>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </form>
  );
};

export default MailServerForm;

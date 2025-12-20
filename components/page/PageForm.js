import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import Alert from '@material-ui/lab/Alert';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { resolver } from '@validations/page.resolver';
import { pageService } from '@services/page.service';
import { useRouter } from 'next/router';
import { moduleService } from 'services/module.service';
import { form } from '@lib/form';

const FIELDS = ['name', 'moduleId', 'url'];

const PageForm = ({ record }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const onSubmit = (data) => {
    if (loading) return;
    form.submit({
      recordId: record.id,
      data,
      service: pageService,
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
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <TextField
            control={control}
            id="name"
            label="Nombre"
            disabled={loading}
            errors={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="moduleId"
            label="Módulo"
            disabled={loading}
            errors={errors.moduleId}
            service={moduleService}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <TextField
            control={control}
            id="url"
            label="Ruta"
            disabled={loading}
            errors={errors.url}
          />
        </Grid>
        <Grid container item xs={12} justifyContent="flex-end">
          <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
            <Alert severity="info">
              Recuerde que la página debe existir en la ruta especificada dentro
              del directorio /pages según la documentación de Next.js
            </Alert>
          </Grid>
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
            onClick={handleSubmit(onSubmit)}
            disabled={loading || !isDirty}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </form>
  );
};

export default PageForm;

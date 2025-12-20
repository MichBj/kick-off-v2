import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import { parameterService } from '@services/parameter.service';
import { resolver } from '@validations/parameter.resolver';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = ['key', 'name', 'value'];

const ParameterForm = ({ record }) => {
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
      service: parameterService,
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
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            control={control}
            id="key"
            label="Código"
            disabled={loading}
            errors={errors.key}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            control={control}
            id="name"
            label="Nombre"
            disabled={loading}
            errors={errors.name}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={4} xl={3}>
          <TextField
            control={control}
            id="value"
            label="Valor"
            disabled={loading}
            errors={errors.value}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
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

export default ParameterForm;

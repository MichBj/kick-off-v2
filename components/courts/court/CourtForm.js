import Grid from '@ui/common/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@ui/common/Button';
import Loading from '@ui/common/Loading';
import { resolver } from '@validations/courts/courts.resolver';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { form } from '@lib/form';
import { userService } from '@services/user.service';

const FIELDS = ['name', 'location', 'userId', 'isIndoor'];

const CourtForm = ({ record }) => {
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
      service: entityService,
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
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            control={control}
            id="location"
            label="Ubicación"
            disabled={loading}
            errors={errors.location}
            multiline={true}
            rows={4}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="userId"
            label="Usuario"
            disabled={loading}
            errors={errors.userId}
            service={userService}
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

export default CourtForm;

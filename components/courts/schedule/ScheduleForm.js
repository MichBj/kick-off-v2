import Grid from '@ui/common/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@ui/common/Button';
import Loading from '@ui/common/Loading';
import { resolver } from '@validations/courts/schedules.resolver';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { form } from '@lib/form';
import { courtSchedulesService } from '@services/courts/shcedules.service';
import DayOfWeek from '@ui/common/DayOfWeek';
import Duration from '@ui/common/Duration';
import { courtsService } from '@services/courts/courts.service';

const FIELDS = ['courtId', 'dayOfWeek', 'duration'];

const ScheduleForm = ({ record }) => {
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
      service: courtSchedulesService,
      router,
      dirtyFields,
      enqueueSnackbar,
      reset,
      setLoading,
      fields: FIELDS,
    });
  };
  console.log(errors);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Select
            control={control}
            id="courtId"
            label="Cancha"
            disabled={loading}
            errors={errors.courtId}
            service={courtsService}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <DayOfWeek
            control={control}
            id="dayOfWeek"
            label="Día de la semana"
            disabled={loading}
            errors={errors.dayOfWeek}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <Duration
            control={control}
            id="duration"
            label="Duración (minutos)"
            disabled={loading}
            errors={errors.duration}
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

export default ScheduleForm;

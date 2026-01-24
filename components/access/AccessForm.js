import Grid from '@ui/common/Grid';
import Button from '@ui/common/Button';
import Loading from '@ui/common/Loading';
import Switch from '@ui/common/Switch';
import Select from '@ui/common/Select';
import { resolver } from '@validations/access.resolver';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useForm } from 'react-hook-form';
import { accessService } from '@services/access.service';
import { entityService } from '@services/entity.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';
import { isEmpty } from 'lodash';

const FIELDS = ['entityId', 'read', 'create', 'write', 'remove'];

const AccessForm = ({ record, roleId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = useForm({ resolver, defaultValues: form.defaultValues(record, FIELDS) });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = form.dirtyData(dirtyFields, data);
      const response = isEmpty(record)
        ? await accessService.create({ ...formData, roleId })
        : await accessService.update(record.id, formData);
      snackbar.success(enqueueSnackbar, 'Guardado exitoso');
      if (isEmpty(record)) router.replace(`${roleId}/access/${response.id}`);
      reset(form.defaultValues(response, FIELDS));
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} lg={4} xl={3}>
          <Select
            control={control}
            id="entityId"
            label="Entidad"
            disabled={loading}
            errors={errors.entityId}
            service={entityService}
          />
        </Grid>
        <Grid item container xs={6} sm={3} md={3} lg={2} xl={2}>
          <Switch
            control={control}
            id="read"
            label="Lectura"
            checked={record?.read}
          />
        </Grid>
        <Grid item container xs={6} sm={3} md={3} lg={2} xl={2}>
          <Switch
            control={control}
            id="create"
            label="Creación"
            checked={record?.create}
          />
        </Grid>
        <Grid item container xs={6} sm={3} md={3} lg={2} xl={2}>
          <Switch
            control={control}
            id="write"
            label="Modificación"
            checked={record?.write}
          />
        </Grid>
        <Grid item container xs={6} sm={3} md={3} lg={2} xl={2}>
          <Switch
            control={control}
            id="remove"
            label="Remoción"
            checked={record?.remove}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={3} md={3} lg={3} xl={3}>
          <Button
            type="submit"
            size="medium"
            fullWidth
            variant="contained"
            // color="primary"
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

export default AccessForm;

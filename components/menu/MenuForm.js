import Grid from '@material-ui/core/Grid';
import TextField from '@ui/common/TextField';
import Select from '@ui/common/Select';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import Switch from '@ui/common/Switch';
import { useState } from 'react';
import { resolver } from '@validations/menu.resolver';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { menuService } from '@services/menu.service';
import { moduleService } from '@services/module.service';
import { pageService } from '@services/page.service';
import { useRouter } from 'next/router';
import { form } from '@lib/form';

const FIELDS = [
  'name',
  'description',
  'icon',
  'priority',
  'moduleId',
  'pageId',
  'menuId',
  'header',
  'dashboard',
];

const MenuForm = ({ record }) => {
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
      service: menuService,
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
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <TextField
            control={control}
            id="icon"
            label="Icono"
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
          <TextField
            control={control}
            id="priority"
            label="Prioridad"
            disabled={loading}
            type="number"
            errors={errors.priority}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="moduleId"
            label="Módulo"
            disabled={loading}
            errors={errors.moduleId}
            service={moduleService}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="pageId"
            label="Página"
            disabled={loading}
            service={pageService}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <Select
            control={control}
            id="menuId"
            label="Menú"
            disabled={loading}
            service={menuService}
            exclude={record.id}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <Switch
            control={control}
            id="header"
            label="Es un título"
            checked={record?.header}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
          <Switch
            control={control}
            id="dashboard"
            label="Es un panel de control"
            checked={record?.header}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={12} xl={12}>
          <TextField
            control={control}
            id="description"
            label="Descripción"
            disabled={loading}
            errors={errors.description}
            multiline={true}
            rows={6}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
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

export default MenuForm;

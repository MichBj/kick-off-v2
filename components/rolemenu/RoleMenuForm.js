import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Loading from '@ui/common/Loading';
import roleMenuFormOptions from '@validations/rolemenu/roleMenuForm.schema';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';
import { useForm } from 'react-hook-form';
import { roleService } from '@services/role.service';
import { menuService } from '@services/menu.service';
import { roleMenuService } from '@services/rolemenu.service';
import { useRouter } from 'next/router';

const RoleMenuForm = ({ record, menuId, roleId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm(roleMenuFormOptions);

  useEffect(() => {
    const getRoles = async () => {
      if (!roleId) return await roleService.getAll();
      if (!record.id) return [await roleService.getById(roleId)];
      return [record.Role];
    };

    const getMenus = async () => {
      if (!menuId) return await menuService.getAll();
      if (!record.id) return [await menuService.getById(menuId)];
      return [record.Menu];
    };

    const load = async () => {
      // TODO: ? Disable modify
      if (record.id) await router.replace('/');
      try {
        const [roles, menus] = await Promise.all([getRoles(), getMenus()]);
        setRoles(roles);
        setMenus(menus);
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      }
      setLoading(false);
    };
    load();
  }, [enqueueSnackbar, record, roleId, menuId, router]);

  const onSubmit = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        if (!record.id) await roleMenuService.create(data);
        else
          await roleMenuService.update(
            record?.Role?.id || roleId || data.roleId,
            record?.Menu?.id || menuId || data.menuId,
            data,
          );
        snackbar.success(enqueueSnackbar, 'Guardado exitoso');
        router.back();
      } catch (error) {
        snackbar.error(enqueueSnackbar, error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <></>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            select
            disabled={loading || !!roleId}
            id="roleId"
            margin="dense"
            fullWidth
            label="Rol"
            size={'small'}
            variant="outlined"
            defaultValue={record?.Role?.id || roleId || ''}
            {...register('roleId')}
            helperText={errors.moduleId?.message}
            error={errors.moduleId ? true : false}
          >
            {roles.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <TextField
            select
            disabled={loading || !!menuId}
            id="menuId"
            margin="dense"
            fullWidth
            label="Menú"
            size={'small'}
            variant="outlined"
            defaultValue={record?.Menu?.id || menuId || ''}
            {...register('menuId')}
          >
            {menus.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
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
            Guardar
          </Button>
        </Grid>
      </Grid>
      {loading && <Loading />}
    </form>
  );
};

export default RoleMenuForm;

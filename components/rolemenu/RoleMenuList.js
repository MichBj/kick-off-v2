import Grid from '@material-ui/core/Grid';
import Loading from '@ui/common/Loading';
import Card from '@ui/common/Card';
import ActiveButton from '@ui/common/ActiveButton';
import { roleMenuService } from '@services/rolemenu.service';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';

const url = (roleId, menuId) => {
  return `/base/config/roles/${roleId}/menu/${menuId}`;
};

const RoleMenuList = ({ rows, forRole, forMenu, loading }) => {
  const { enqueueSnackbar } = useSnackbar();

  const name = (row) => {
    if (forRole) return row.Menu.name;
    if (forMenu) return row.Role.name;
  };

  const changeActive = async (id, active) => {
    try {
      const [roleId, menuId] = id;
      await roleMenuService.update(roleId, menuId, { active });
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    }
  };

  return (
    <Grid item container justifyContent="flex-start" xs={12}>
      {rows.map((row) => (
        <Grid item key={row.id} xs={12} sm={4} md={3} lg={3} xl={3}>
          <Card
            url={url(row.Role.id, row.Menu.id)}
            title={name(row)}
            active={row.active}
          >
            <ActiveButton
              rowId={[row.Role?.id, row.Menu?.id]}
              active={row.active}
              apiHandler={changeActive}
            />
          </Card>
        </Grid>
      ))}
      {loading && <Loading />}
    </Grid>
  );
};

export default RoleMenuList;

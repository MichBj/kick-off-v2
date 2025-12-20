import Stack from '@mui/material/Stack';
import ActiveButton from '@ui/common/ActiveButton';
import DataGrid from '@ui/common/DataGrid';
import { roleMenuService } from '@services/rolemenu.service';
import { useSnackbar } from 'notistack';
import { snackbar } from '@lib/snackbar';

const parseRows = (rows) => {
  return rows.map((row) => {
    row = {
      ...row,
      role: row?.Role?.name,
      menu: row?.Menu?.name,
      menuUrl: row?.Menu?.Page?.url,
    };
    return row;
  });
};

const RoleMenuTable = ({ rows, hideRoles, hideMenus, loading }) => {
  rows = parseRows(rows);
  const { enqueueSnackbar } = useSnackbar();

  const changeActive = async (id, active) => {
    try {
      const [roleId, menuId] = id;
      await roleMenuService.update(roleId, menuId, { active });
    } catch (error) {
      snackbar.error(enqueueSnackbar, error);
    }
  };

  const column = [
    {
      field: 'role',
      headerName: 'Rol',
      hide: !hideRoles,
      flex: 1,
    },
    {
      field: 'menu',
      headerName: 'Menú',
      hide: !hideMenus,
      flex: 1,
    },
    {
      field: 'menuUrl',
      headerName: 'Ruta',
      hide: !hideMenus,
      flex: 1,
    },
    {
      field: 'active',
      headerName: 'Activo',
      hide: true,
      flex: 1,
    },
    {
      field: 'Acciones',
      headerAlign: 'center',
      width: 130,
      headerAlign: 'center',
      align: 'center',
      renderCell: (cell) => {
        return (
          <Stack direction="row" spacing={1}>
            <ActiveButton
              rowId={[cell.row.Role.id, cell.row.Menu.id]}
              active={cell.row.active}
              apiHandler={changeActive}
            />
          </Stack>
        );
      },
    },
  ];
  return (
    <div style={{ width: '100%' }}>
      <DataGrid rows={rows} columns={column} loading={loading} />
    </div>
  );
};

export default RoleMenuTable;

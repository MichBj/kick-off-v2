import { Space } from 'antd';
//import ActiveChip from '@ui/common/ActiveChip';
import DataGrid from '@ui/common/DataGrid';
import UpdateButton from '@ui/common/UpdateButton';
import { selector } from '@redux/reducers/accessSlice';
import { useSelector } from 'react-redux';

const parseRows = (rows) => {
  return rows.map((row) => ({
    id: row.id,
    entity: row.Entity.name,
    read: row.read,
    create: row.create,
    write: row.write,
    remove: row.remove,
  }));
};

const field = (field, name, renderCell) => {
  return {
    field: field,
    headerName: name,
    headerAlign: 'center',
    align: 'center',
    width: 135,
    renderCell,
  };
};

const Chip = ({ active }) => <ActiveChip active={active} />;

const AccessTable = ({ rows, loading, roleId }) => {
  const access = useSelector(selector.access.access);

  rows = parseRows(rows);

  const url = (id) => {
    return `/base/config/roles/${roleId}/access/${id}`;
  };

  let column = [
    { field: 'entity', headerName: 'Entidad', flex: 3 },
    field('read', 'Leer', (cell) => <Chip active={cell.row.read} />),
    field('create', 'Crear', (cell) => <Chip active={cell.row.create} />),
    field('write', 'Modificar', (cell) => <Chip active={cell.row.write} />),
    field('remove', 'Remover', (cell) => <Chip active={cell.row.remove} />),
  ];
  if (access?.write)
    column.push({
      field: 'Acciones',
      headerAlign: 'center',
      align: 'center',
      width: 130,
      renderCell: (cellValues) => {
        return (
          <Space size={8}>
            {access?.write && <UpdateButton url={url(cellValues.id)} />}
          </Space>
        );
      },
    });
  return (
    <div style={{ width: '100%' }}>
      <DataGrid rows={rows} columns={column} loading={loading} />
    </div>
  );
};

export default AccessTable;

import DataGridServer from '@ui/common/DataGridServer';
import Forbidden from '@ui/common/Forbidden';
import ActionCell from '@ui/common/ActionCell';
import { courtSchedulesService } from '@services/courts/shcedules.service';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { sortHandler, filterHandler } from '@helper/filtering/base/user';

const parseHandler = (rows) => {
  return rows.map((row) => {
    return {
      ...row,
      courts: row.Court?.name,
      location: row.Court?.location,
    };
  });
};

const ScheduleTable = ({ where }) => {
  const access = useSelector(selector.access.courtSchedule);

  if (!access.read) return <Forbidden />;

  const column = [
    {
      field: 'courts',
      headerName: 'Cancha',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'location',
      headerName: 'Ubicación',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'dayOfWeek',
      headerName: 'Día de la semana',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'duration',
      headerName: 'Duración (minutos)',
      flex: 1,
      sortable: true,
      filterable: true,
    },
    {
      field: 'Acciones',
      align: 'center',
      headerAlign: 'center',
      width: 220,
      filterable: false,
      sortable: false,
      renderCell: (record) => {
        return (
          <ActionCell
            record={record}
            url="/courts/config/schedule"
            service={courtSchedulesService}
            access={access}
          />
        );
      },
    },
  ];

  return (
    <DataGridServer
      where={where}
      service={courtSchedulesService}
      columns={column}
      parseHandler={parseHandler}
      sortHandler={sortHandler}
      filterHandler={filterHandler}
    />
  );
};

export default ScheduleTable;

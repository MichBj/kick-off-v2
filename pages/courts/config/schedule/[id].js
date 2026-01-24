import Dashboard from '@ui/layout/Dashboard';
import Grid from '@ui/common/Grid';
import ScheduleForm from '@components/courts/schedule/ScheduleForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useState, useEffect } from 'react';
import { courtSchedulesService } from '@services/courts/shcedules.service';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Schedule = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.courtSchedule);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await courtSchedulesService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="HORARIO DE CANCHA">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={courtSchedulesService}
        />
      </FormTitle>
      <ScheduleForm record={record} />
    </Grid>
  );
};

Schedule.propTypes = {};
Schedule.Layout = Dashboard;

export default Schedule;

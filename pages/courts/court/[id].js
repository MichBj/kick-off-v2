import Dashboard from '@ui/layout/Dashboard';
import Grid from '@ui/common/Grid';
import CourtForm from '@components/courts/court/CourtForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useState, useEffect } from 'react';
import { courtsService } from '@services/courts/courts.service';
import { useSnackbar } from 'notistack';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Court = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.court);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await courtsService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="CANCHA">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={courtsService}
        />
      </FormTitle>
      <CourtForm record={record} />
    </Grid>
  );
};

Court.propTypes = {};
Court.Layout = Dashboard;

export default Court;

import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import CampusForm from '@components/campus/CampusForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import { campusService } from '@services/campus.service';
import { page, serverProps } from '@lib/page';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Campus = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.campus);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await campusService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="CAMPUS">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={campusService}
        />
      </FormTitle>
      <CampusForm record={record} />
    </Grid>
  );
};

Campus.propTypes = {};
Campus.Layout = Dashboard;

export default Campus;

import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import InstitutionForm from '@components/institution/InstitutionForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import Forbidden from '@ui/common/Forbidden';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { institutionService } from '@services/institution.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Institution = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.institution);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await institutionService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="INSTITUCIÓN">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={institutionService}
        />
      </FormTitle>
      <InstitutionForm record={record} />
    </Grid>
  );
};

Institution.propTypes = {};
Institution.Layout = Dashboard;

export default Institution;

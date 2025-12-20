import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import PageForm from '@components/page/PageForm';
import FormTitle from '@ui/common/FormTitle';
import ActiveButton from '@ui/common/ActiveButton';
import Loading from '@ui/common/Loading';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { pageService } from '@services/page.service';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import Forbidden from '@ui/common/Forbidden';

export const getServerSideProps = (context) => serverProps(context.query.id);

const Page = ({ id }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const access = useSelector(selector.access.page);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setRecord(await pageService.getById(id)),
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="PÁGINA">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={pageService}
        />
      </FormTitle>
      <PageForm record={record} />
    </Grid>
  );
};

Page.propTypes = {};
Page.Layout = Dashboard;

export default Page;

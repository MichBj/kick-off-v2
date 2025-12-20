import Grid from '@material-ui/core/Grid';
import Loading from '@ui/common/Loading';
import ModuleCard from '@components/module/ModuleCard';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

const ModulesList = ({ rows, loading }) => {
  const access = useSelector(selector.access.module);

  return (
    <Grid item container justifyContent="flex-start" xs={12}>
      {rows.map((module) => (
        <Grid item key={module.id} xs={12} sm={12} md={6} lg={4} xl={3}>
          <ModuleCard
            url={access?.write ? `/base/modules/${module.id}` : null}
            module={module}
          />
        </Grid>
      ))}
      {loading && <Loading />}
    </Grid>
  );
};

export default ModulesList;

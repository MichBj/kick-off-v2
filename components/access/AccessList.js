import Grid from '@material-ui/core/Grid';
import Card from '@ui/common/Card';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';
import PageSpinner from '@ui/common/PageSpinner';

const url = (id, roleId) => {
  return `/base/config/roles/${roleId}/access/${id}`;
};

const AccessList = ({ rows, roleId, loading }) => {
  const access = useSelector(selector.access.access);

  return (
    <Grid item container justifyContent="flex-start" xs={12}>
      {rows.map((row) => (
        <Grid item key={row.id} xs={12} sm={4} md={3} lg={3} xl={3}>
          <Card
            url={url(row.id, roleId)}
            title={row.Entity.name}
            description={row.code}
            pusheable={access?.write}
            active={row.active}
          />
        </Grid>
      ))}
      {loading && <PageSpinner />}
    </Grid>
  );
};

export default AccessList;

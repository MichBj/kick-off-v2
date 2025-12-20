import Grid from '@material-ui/core/Grid';
import Loading from '@ui/common/Loading';
import Card from '@ui/common/Dashboard/Card';
import { useSnackbar } from 'notistack';
import { menuService } from '@services/menu.service';
import { useState, useEffect } from 'react';
import { page } from '@lib/page';
import { Alert } from '@material-ui/lab';
import { isEmpty } from 'lodash';

const List = ({ menuCode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setData(await menuService.getDashboard(menuCode)),
      () => setLoading(false),
    );
  }, [enqueueSnackbar, menuCode]);

  if (loading) return <Loading />;

  return (
    <Grid item container justifyContent="flex-start" xs={12}>
      {data.map((menu) => (
        <Grid item key={menu.id} xs={12} sm={12} md={6} lg={4} xl={3}>
          <Card menu={menu} />
        </Grid>
      ))}
      {isEmpty(data) && (
        <Grid item xs={12} style={{ marginTop: 15 }}>
          <Alert severity="info">Sin registros</Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default List;

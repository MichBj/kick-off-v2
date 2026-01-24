import Dashboard from '@ui/layout/Dashboard';
import Grid from '@ui/common/Grid';
import Container from '@ui/common/Container';
import Title from '@ui/common/Title';
import List from '@ui/common/Dashboard/List';

const Config = () => {
  return (
    <Grid container spacing={1}>
      <Container>
        <Title title="PARÁMETROS DE CONFIGURACIÓN CANCHAS" />
      </Container>
      <Container>
        <List menuCode="courtsconfig" />
      </Container>
    </Grid>
  );
};

Config.propTypes = {};
Config.Layout = Dashboard;

export default Config;

import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import AccessForm from '@components/access/AccessForm';
import RoleMenuForm from '@components/rolemenu/RoleMenuForm';
import AccessDenied from '@ui/layout/AccessDenied';
import FormTitle from '@ui/common/FormTitle';
import Loading from '@ui/common/Loading';
import { serverRedirect } from '@lib/server';
import { accessService } from '@services/access.service';
import { menuService } from '@services/menu.service';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { page } from '@lib/page';

export const getServerSideProps = async (context) => {
  const slug = context.query.slug;
  if (!slug || slug.length > 3) return serverRedirect('/base/config/roles');
  const [id, entityName, _entityId] = slug;
  const entityId = _entityId === 'create' ? null : _entityId;
  return {
    props: { id, entityId, entityName },
  };
};

const RoleSubPage = ({ id, entityId, entityName }) => {
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => {
        if (entityName === 'access')
          setRecord(await accessService.getById(entityId));
        if (entityName === 'menu')
          setRecord(await menuService.getById(entityId));
      },
      () => setLoading(false),
    );
  }, [id, entityId, entityName, enqueueSnackbar]);

  if (loading) return <Loading />;

  if (entityName == 'access') {
    return (
      <Grid>
        <FormTitle record={record} title="PERMISO DE ACCESO" />
        <AccessForm record={record} roleId={id} />
      </Grid>
    );
  }
  if (entityName == 'menu') {
    return (
      <Grid>
        <FormTitle record={record} title="RELACIÓN ROL-MENU" />
        <RoleMenuForm record={record} roleId={id} />
      </Grid>
    );
  }
  return <AccessDenied />;
};

RoleSubPage.propTypes = {};
RoleSubPage.Layout = Dashboard;

export default RoleSubPage;

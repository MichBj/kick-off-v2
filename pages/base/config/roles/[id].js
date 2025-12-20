import Dashboard from '@ui/layout/Dashboard';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import RoleForm from '@components/role/RoleForm';
import Title from '@ui/common/Title';
import ActiveButton from '@ui/common/ActiveButton';
import CreateButton from '@ui/common/CreateButton';
import Loading from '@ui/common/Loading';
import AccessList from '@components/access/AccessList';
import AccessTable from '@components/access/AccessTable';
import RoleMenuList from '@components/rolemenu/RoleMenuList';
import RoleMenuTable from '@components/rolemenu/RoleMenuTable';
import FormTitle from '@ui/common/FormTitle';
import MobilePicker from '@ui/common/MobilePicker';
import Forbidden from '@ui/common/Forbidden';
import { useState, useEffect } from 'react';
import { roleService } from '@services/role.service';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { isMobile } from 'react-device-detect';
import { page, serverProps } from '@lib/page';
import { useSelector } from 'react-redux';
import { selector } from '@redux/reducers/accessSlice';

const useStyles = makeStyles(() => ({
  tabPanel: { minHeight: '90vh' },
  tab: { padding: 5 },
}));

const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
    >
      {children}
    </div>
  );
};

export const getServerSideProps = (context) => serverProps(context.query.id);

const Role = ({ id }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);
  const access = useSelector(selector.access.role);
  const [record, setRecord] = useState({});
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const parseMenus = (record) => {
    if (!record.id) return;
    record.menus = record.menus.map((menu) => ({
      ...menu,
      id: menu.Menu?.id,
      Role: { id: record.id, name: record.name },
    }));
  };

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => {
        const record = await roleService.getById(id);
        parseMenus(record);
        setRecord(record);
      },
      () => setLoading(false),
    );
  }, [id, enqueueSnackbar]);

  const handleTab = (event, selected) => {
    setTab(selected);
  };

  if (loading) return <Loading />;
  if (!access.read) return <Forbidden />;
  if (!id && !access.create) return <Forbidden />;
  if (id && !access.write) return <Forbidden />;

  return (
    <Grid>
      <FormTitle record={record} title="ROL">
        <ActiveButton
          rowId={record.id}
          active={record.active}
          service={roleService}
        />
      </FormTitle>
      <RoleForm record={record} />
      <br />
      {record.id ? (
        <Grid item xs={12}>
          <Grid item xs={12}>
            <Paper className={classes.tabPanel}>
              <Tabs
                value={tab}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                onChange={handleTab}
              >
                <Tab label="Accesos" />
                <Tab label="Menus" />
              </Tabs>
              <TabPanel value={tab} index={0}>
                <Grid className={classes.tab}>
                  <Title title={' '}>
                    <CreateButton
                      url={`/base/config/roles/${record.id}/access/create`}
                      selector={selector.access.access}
                    >
                      Agregar
                    </CreateButton>
                  </Title>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  xs={12}
                  className={classes.tab}
                >
                  <MobilePicker
                    mobile={
                      <AccessList
                        rows={record.access || []}
                        loading={loading}
                      />
                    }
                    web={
                      <AccessTable
                        rows={record.access || []}
                        roleId={record.id}
                        loading={false}
                      />
                    }
                  />
                </Grid>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <Grid className={classes.tab}>
                  <Title title={' '}>
                    <CreateButton
                      url={`/base/config/roles/${record.id}/menu/create`}
                      selector={selector.access.rolemenu}
                    >
                      Agregar
                    </CreateButton>
                  </Title>
                </Grid>
                <Grid
                  item
                  container
                  justifyContent="flex-start"
                  xs={12}
                  className={classes.tab}
                >
                  {isMobile ? (
                    <RoleMenuList
                      rows={record.menus || []}
                      forRole={true}
                      loading={false}
                    />
                  ) : (
                    <RoleMenuTable
                      rows={record.menus || []}
                      hideMenus={true}
                      loading={false}
                    />
                  )}
                </Grid>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
};

Role.propTypes = {};
Role.Layout = Dashboard;
export default Role;

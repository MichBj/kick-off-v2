import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import PagesList from '@components/page/PagesList';
import PagesTable from '@components/page/PagesTable';
import MenusList from '@components/menu/MenusList';
import MenusTable from '@components/menu/MenusTable';
import RolesList from '@components/role/RolesList';
import RolesTable from '@components/role/RolesTable';
import InstallButton from './InstallButton';
import MobilePicker from '@ui/common/MobilePicker';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  tabPanel: { minHeight: '90vh' },
  tab: { padding: '1em' },
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

const ModuleForm = ({ record }) => {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  const handleTab = (_, selected) => {
    setTab(selected);
  };

  const moduleFilter = () => {
    return { Module: { id: record.id } };
  };

  return (
    <Grid item container xs={12}>
      <Grid item container style={{ marginTop: 5 }} xs={12}>
        <Grid item container justifyContent="space-between" xs={12}>
          <Grid>
            <Typography variant="h6" gutterBottom>
              {record.name}
            </Typography>
          </Grid>
          <Grid>
            <InstallButton module={record} />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" gutterBottom>
          {record.description}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.tabPanel}>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            onChange={handleTab}
          >
            <Tab label="Páginas" />
            <Tab label="Menús" />
            <Tab label="Roles" />
          </Tabs>
          <TabPanel value={tab} index={0}>
            <Grid
              item
              container
              justifyContent="flex-start"
              xs={12}
              spacing={1}
              className={classes.tab}
            >
              <MobilePicker
                mobile={<PagesList where={moduleFilter()} />}
                web={<PagesTable where={moduleFilter()} />}
              />
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <Grid
              item
              container
              justifyContent="flex-start"
              xs={12}
              spacing={1}
              className={classes.tab}
            >
              <MobilePicker
                mobile={<MenusList where={moduleFilter()} />}
                web={<MenusTable where={moduleFilter()} />}
              />
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <Grid
              item
              container
              justifyContent="flex-start"
              xs={12}
              spacing={1}
              className={classes.tab}
            >
              <MobilePicker
                mobile={<RolesList where={moduleFilter()} />}
                web={<RolesTable where={moduleFilter()} />}
              />
            </Grid>
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ModuleForm;

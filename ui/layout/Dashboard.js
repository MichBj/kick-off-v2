import { Layout, Drawer, Button, Space, Row, Col, Typography } from 'antd';
import { MenuOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import UserSettingMenu from '@ui/layout/UserSettingMenu';
import SidebarList from '@ui/layout/SidebarList';
import AppBar from '@ui/layout/AppBar';
import DrawerHeader from '@ui/layout/DrawerHeader';
import Main from '@ui/layout/Main';
import Logo from '@ui/layout/Logo';
import { isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { authService } from '@services/auth.service';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { set } from '@redux/reducers/accessSlice';
import { set as setRoles } from '@redux/reducers/rolesSlice';
import { userService } from '@services/user.service';
import styled from 'styled-components';

const { Content, Sider } = Layout;
const { Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledSider = styled(Sider)`
  .ant-layout-sider-children {
    background: #fff;
  }
`;

const TitleContainer = styled.div`
  color: #fff;
  margin-top: 10px;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 12px;
`;

const HeaderMock = styled.div`
  width: 280px;
  min-height: 60px;
  background-color: #fff;
`;

const ContentHeaderMock = styled.div`
  min-height: 60px;
`;

const CloseButton = styled(Button)`
  color: white;
  &:hover {
    color: #e6f7ff !important;
  }
`;

const drawerWidth = 300;

const Dashboard = (props) => {
  const [open, setOpen] = useState(!isMobile);
  const [user, setUser] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await authService.public.user();
        setUser(user);
        const access = await userService.getAccess();
        dispatch(set(access || {}));
        const roles = await userService.roles();
        dispatch(setRoles(roles || {}));
      } catch (error) {
        if (error === 'No autorizado' || error === 'Sesión caducada')
          return await router.replace('/auth/signin');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [dispatch, router]);

  const handleOpen = () => {
    isMobile ? setOpen(!open) : null;
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getCompanyName = () => {
    const name = user?.Institution?.name;
    if (name) return name.toUpperCase();
  };

  const getCompanyIsologo = () => {
    return user?.Institution?.logo;
  };

  if (loading) return <></>;

  const siderContent = (
    <>
      <DrawerHeader>
        <Row justify="center">
          <Logo logo={getCompanyIsologo()} />
        </Row>
        <Row justify="center">
          <TitleContainer>{getCompanyName()}</TitleContainer>
        </Row>
        <CloseButton
          type="text"
          icon={<LeftOutlined />}
          onClick={handleDrawerClose}
        />
      </DrawerHeader>
      <HeaderMock />
      <SidebarList handleOpen={handleOpen} />
    </>
  );

  return (
    <StyledLayout>
      <AppBar open={open}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexGrow: 1 }}>
            {!open && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={handleDrawerOpen}
                style={{ color: 'white' }}
              />
            )}
          </div>
          <UserSettingMenu user={user} />
        </Space>
      </AppBar>

      {isMobile ? (
        <Drawer
          placement="left"
          onClose={handleDrawerClose}
          open={open}
          width={drawerWidth}
          bodyStyle={{ padding: 0 }}
        >
          {siderContent}
        </Drawer>
      ) : (
        <StyledSider
          width={drawerWidth}
          collapsed={!open}
          collapsedWidth={0}
          trigger={null}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          {siderContent}
        </StyledSider>
      )}

      <Main open={open}>
        <ContentHeaderMock />
        {props.children}
      </Main>
    </StyledLayout>
  );
};

export default Dashboard;

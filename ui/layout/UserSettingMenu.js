import { Dropdown, Space, Avatar, Typography, Button } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import { authService } from '@services/auth.service';
import styled from 'styled-components';

const { Text } = Typography;

const StyledButton = styled(Button)`
  color: white;
  border: none;
  &:hover {
    color: #e6f7ff !important;
    background: rgba(255, 255, 255, 0.1) !important;
  }
`;

const UserSettingMenu = ({ user }) => {
  const router = useRouter();

  const signOut = async () => {
    try {
      await authService.signout();
      await router.replace('/auth/signin');
    } catch (error) {}
  };

  const items = [
    {
      key: 'profile',
      label: 'Perfil',
      icon: <UserOutlined />,
      onClick: () => router.push('/'),
    },
    {
      key: 'logout',
      label: 'Cerrar Sesión',
      icon: <LogoutOutlined />,
      onClick: signOut,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <StyledButton type="text" icon={<UserOutlined />}>
        {!isMobile && (
          <Text style={{ color: 'white', marginLeft: 8 }}>
            {user.Person?.name || user.username}
          </Text>
        )}
      </StyledButton>
    </Dropdown>
  );
};

export default UserSettingMenu;

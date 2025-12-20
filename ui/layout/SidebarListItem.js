import React from 'react';
import { Menu, Tooltip } from 'antd';
import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import * as Icons from '@ant-design/icons';
import styled from 'styled-components';

const StyledMenuItem = styled(Menu.Item)`
  font-size: 14px;
  font-weight: 500;

  &:hover {
    border-radius: 2px;
    background: rgba(57, 57, 251, 0.05);
    border-right: 3px solid #1890ff;

    .anticon {
      color: #1890ff;
    }

    span {
      font-weight: 520;
      color: #1890ff;
    }
  }
`;

const SidebarListItem = ({ icon, text, dir, urls, handleOpen }) => {
  const router = useRouter();
  const link = `${dir}`.concat('/').concat(urls);

  const onClick = async () => {
    await router.push(link);
    if (isMobile) handleOpen();
  };

  // Convertir el nombre del icono de Material-UI a Ant Design
  const getIcon = (iconName) => {
    if (!iconName) return null;

    // Mapeo de iconos comunes de Material-UI a Ant Design
    const iconMap = {
      'dashboard': 'DashboardOutlined',
      'person': 'UserOutlined',
      'settings': 'SettingOutlined',
      'home': 'HomeOutlined',
      'menu': 'MenuOutlined',
      'folder': 'FolderOutlined',
      'description': 'FileTextOutlined',
      'assignment': 'FormOutlined',
      'people': 'TeamOutlined',
      'business': 'BankOutlined',
      'list': 'UnorderedListOutlined',
      'edit': 'EditOutlined',
      'delete': 'DeleteOutlined',
      'add': 'PlusOutlined',
    };

    const antIconName = iconMap[iconName.toLowerCase()] || 'FileOutlined';
    const IconComponent = Icons[antIconName];

    return IconComponent ? <IconComponent style={{ fontSize: '19px', color: '#1890ff' }} /> : null;
  };

  return (
    <Tooltip title={text} placement="right">
      <StyledMenuItem
        key={link}
        icon={getIcon(icon)}
        onClick={onClick}
      >
        {text}
      </StyledMenuItem>
    </Tooltip>
  );
};

export default SidebarListItem;

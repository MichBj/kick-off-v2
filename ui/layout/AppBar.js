import { Layout } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;
const drawerWidth = 300;

const AppBar = styled(Header)`
  background: #1890ff;
  transition: margin 0.2s cubic-bezier(0.4, 0, 0.6, 1);
  margin-left: ${props => props.open ? `${drawerWidth}px` : 0};
  padding: 0 24px;
  height: 64px;
  line-height: 64px;
`;

export default AppBar;

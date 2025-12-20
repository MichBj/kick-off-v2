import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

const Main = styled.main`
  flex-grow: 1;
  padding: 16px;
  transition: margin 0.2s cubic-bezier(0.4, 0, 0.6, 1);
  margin-left: ${props => props.open ? (isMobile ? 0 : 280) : 5}px;
`;

export default Main;

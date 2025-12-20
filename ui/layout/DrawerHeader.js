import styled from 'styled-components';

const DrawerHeader = styled.div`
  position: fixed;
  top: 0;
  left: -20px;
  z-index: 999;
  display: flex;
  align-items: center;
  width: 300px;
  height: 60px;
  border-bottom: 1px solid #384152;
  padding: 0 8px;
  justify-content: flex-end;
  background-color: #1890ff;
`;

export default DrawerHeader;

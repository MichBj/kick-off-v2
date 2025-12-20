import { Result } from 'antd';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  padding: 24px 16px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const AccessDenied = () => {
  return (
    <Container>
      <Result
        status="403"
        title="403"
        subTitle="Página no autorizada"
      />
    </Container>
  );
};

export default AccessDenied;

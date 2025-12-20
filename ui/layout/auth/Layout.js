import Image from 'next/image';
import { Row, Col, Typography, Space } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

const { Title, Text } = Typography;

const Wrap = styled.div`
  overflow: hidden;
  position: relative;
  min-height: 100vh;
`;

const Main = styled(Row)`
  background-image: url(/assets/images/signin.png);
  background-repeat: no-repeat;
  background-size: cover;
  min-height: calc(100vh - 20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Container = styled(Row)`
  min-height: 500px;
  width: 100%;

  @media (min-width: 768px) {
    width: 80%;
    max-height: 500px;
  }

  @media (min-width: 992px) {
    max-width: 800px;
    max-height: 500px;
  }
`;

const LogoContainer = styled(Col)`
  background-color: rgba(56, 65, 82, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  min-height: 170px;
  padding: 24px;

  @media (max-width: 767px) {
    width: 100%;
  }

  @media (min-width: 768px) {
    width: 300px;
    height: 100%;
  }
`;

const FormContainer = styled(Col)`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px;

  @media (max-width: 767px) {
    width: 100%;
  }

  @media (min-width: 768px) {
    flex: 1;
    height: 100%;
  }
`;

const ChildrenContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LinksContainer = styled(Row)`
  width: 100%;
  max-width: 300px;
  margin-top: 25px;
`;

const StyledLink = styled.a`
  color: #1890ff;
  cursor: pointer;

  &:hover {
    color: #40a9ff;
  }
`;

const CopyrightContainer = styled(Row)`
  background-color: #bdca32;
  justify-content: center;
  align-items: center;
  height: 20px;
  color: #384152;
  font-weight: bold;
  font-size: 12px;
`;

const TitleContainer = styled.div`
  padding: 0 5px;
  margin-top: 16px;
`;

const Signin = ({
  children,
  logo,
  institution,
  subtitle,
  signin = true,
  forgot = true,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <Wrap>
      <Main>
        <Container>
          <LogoContainer>
            <Image
              width={150}
              height={150}
              src={logo || '/assets/images/react.png'}
              alt="uea_logo"
            />
            <TitleContainer>
              <Title level={3} style={{ color: '#fff', margin: 0 }}>
                {institution}
              </Title>
              <Text style={{ color: '#fff', fontSize: institution ? 14 : 20 }}>
                Portal Transaccional
              </Text>
              {subtitle && (
                <div>
                  <Text style={{ color: '#fff', fontSize: 14 }}>{subtitle}</Text>
                </div>
              )}
            </TitleContainer>
          </LogoContainer>

          <FormContainer>
            <ChildrenContainer>{children}</ChildrenContainer>

            <LinksContainer>
              <Col span={12} style={{ textAlign: 'left' }}>
                {signin && (
                  <Link href="/auth/signin" passHref legacyBehavior>
                    <StyledLink>Iniciar sesión</StyledLink>
                  </Link>
                )}
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                {forgot && (
                  <Link href="/auth/recover" passHref legacyBehavior>
                    <StyledLink>Olvidaste tu contraseña?</StyledLink>
                  </Link>
                )}
              </Col>
              <Col span={24} style={{ marginTop: 16, textAlign: 'left' }}>
                <Link href="/policies" passHref legacyBehavior>
                  <StyledLink>Política de Privacidad</StyledLink>
                </Link>
              </Col>
            </LinksContainer>
          </FormContainer>
        </Container>
      </Main>
      <CopyrightContainer>
        Copyright © Universidad Estatal Amazónica {currentYear}
      </CopyrightContainer>
    </Wrap>
  );
};

export default Signin;

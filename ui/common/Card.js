import { Card as AntCard, Row, Col, Avatar, Typography } from 'antd';
import { useRouter } from 'next/router';
import Image from 'next/image';

const { Text } = Typography;

const Card = ({
  children,
  title,
  description,
  active,
  icon,
  url,
  pusheable,
}) => {
  const router = useRouter();

  const push = async () => (pusheable ? await router.push(url) : undefined);

  const cardStyle = {
    maxWidth: 'auto',
    borderLeft: active ? '8px solid #BDCA32' : '8px solid #5BA3A1',
    margin: 2,
    height: active ? '98%' : '95%',
    cursor: pusheable ? 'pointer' : 'default',
  };

  const avatarStyle = {
    backgroundColor: '#FFF',
    borderColor: active ? '#BDCA32' : '#5BA3A1',
    height: 50,
    width: 50,
  };

  return (
    <AntCard style={cardStyle} onClick={push} bodyStyle={{ padding: 16 }}>
      <Row gutter={16} align="middle">
        <Col flex={children ? '1 1 auto' : '1'}>
          <Row gutter={16} align="middle">
            {icon && (
              <Col>
                <Avatar
                  shape="square"
                  size={50}
                  style={avatarStyle}
                  icon={
                    <Image
                      width={64}
                      height={64}
                      src={icon}
                      alt="icono"
                      style={{ objectFit: 'contain' }}
                    />
                  }
                />
              </Col>
            )}
            <Col flex="1">
              <div>
                <Text strong style={{ textTransform: 'uppercase', fontSize: 14 }}>
                  {title}
                </Text>
                {description && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {description}
                    </Text>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Col>
        {children && (
          <Col flex="0 0 auto">
            <div style={{ marginRight: 5 }}>{children}</div>
          </Col>
        )}
      </Row>
    </AntCard>
  );
};

export default Card;

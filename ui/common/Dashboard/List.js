import { Row, Col } from 'antd';
import Loading from '@ui/common/Loading';
import Card from '@ui/common/Dashboard/Card';
import { useSnackbar } from 'notistack';
import { menuService } from '@services/menu.service';
import { useState, useEffect } from 'react';
import { page } from '@lib/page';
import { Alert } from 'antd';
import { isEmpty } from 'lodash';

const List = ({ menuCode }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    page.loader(
      enqueueSnackbar,
      async () => setData(await menuService.getDashboard(menuCode)),
      () => setLoading(false),
    );
  }, [enqueueSnackbar, menuCode]);

  if (loading) return <Loading />;

  return (
    <Row gutter={[16, 16]}>
      {data.map((menu) => (
        <Col key={menu.id} xs={24}>
          <Card menu={menu} />
        </Col>
      ))}
      {isEmpty(data) && (
        <Col xs={24}>
          <Alert
            type="info"
            showIcon
            message="Sin registros"
            description="No hay accesos rápidos disponibles en este momento"
            style={{ borderRadius: 16 }}
          />
        </Col>
      )}
    </Row>
  );
};

export default List;

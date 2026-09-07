import { Layout, Typography, Alert, Spin } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import ERDEAxios from '@api/ERDEAxios';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const useBackendActive = () =>
  useQuery({
    queryKey: ['active-response'],
    queryFn: async () => {
      const { data } = await ERDEAxios.get<{ active: boolean }>('/active-response');
      return data;
    },
    retry: false,
  });

const Home = () => {
  const { data, isLoading, isError } = useBackendActive();

  return (
    <Content style={{ padding: 48, maxWidth: 720, margin: '0 auto' }}>
      <Title level={2}>Misioneros</Title>
      <Paragraph>
        Frontend inicializado con React, Vite, Ant Design, TanStack Query y Axios
        (ERDEAxios).
      </Paragraph>
      {isLoading && <Spin />}
      {isError && (
        <Alert
          type="warning"
          showIcon
          message="No se pudo conectar con el backend"
          description="Arranca el API en http://localhost:3040 y recarga."
        />
      )}
      {data?.active && (
        <Alert type="success" showIcon message="Backend conectado" />
      )}
    </Content>
  );
};

const Login = () => (
  <Content style={{ padding: 48, maxWidth: 720, margin: '0 auto' }}>
    <Title level={3}>Iniciar sesión</Title>
    <Paragraph>La pantalla de autenticación se conectará aquí.</Paragraph>
  </Content>
);

const App = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </Layout>
);

export default App;

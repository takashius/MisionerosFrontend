import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import PortalLayout from '@layouts/PortalLayout';
import MobileLayout from '@layouts/MobileLayout';
import AdminLayout from '@layouts/AdminLayout';
import Portal from '@pages/Portal';
import Registro from '@pages/Registro';
import Pase from '@pages/Pase';
import Escaner from '@pages/Escaner';
import Admin from '@pages/Admin';
import Participantes from '@pages/admin/Participantes';
import Login from '@pages/Login';
import RecoverPassword from '@pages/RecoverPassword';
import RecoveryStep2 from '@pages/RecoveryStep2';
import Users from '@pages/users/Users';
import RequireAdmin from '@components/RequireAdmin';
import RequireAdminOnly from '@components/RequireAdminOnly';
import RequireScan from '@components/RequireScan';
import Cronograma from '@pages/Cronograma';
import CronogramaAdmin from '@pages/admin/CronogramaAdmin';
import Perfil from '@pages/Perfil';
import Mapa from '@pages/Mapa';
import Contacto from '@pages/Contacto';

const App = () => (
  <Layout style={{ minHeight: '100vh', background: '#F8F9FF' }}>
    <Routes>
      <Route element={<PortalLayout />}>
        <Route path="/" element={<Portal />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/ponentes" element={<Navigate to="/" replace />} />
        <Route path="/vivo" element={<Navigate to="/" replace />} />
        <Route path="/ayuda" element={<Navigate to="/" replace />} />
      </Route>

      <Route element={<MobileLayout />}>
        <Route path="/pase" element={<Pase />} />
        <Route path="/pase/:token" element={<Pase />} />
        <Route
          path="/programa"
          element={
            <Cronograma
              title="Programa"
              description="Itinerario de la asamblea para acreditados en sede."
            />
          }
        />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route element={<RequireScan />}>
        <Route element={<MobileLayout />}>
          <Route path="/escaner" element={<Escaner />} />
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Admin />} />
          <Route path="participantes" element={<Participantes />} />
          <Route path="cronograma" element={<CronogramaAdmin />} />
          <Route
            path="usuarios"
            element={
              <RequireAdminOnly>
                <Users />
              </RequireAdminOnly>
            }
          />
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/recuperar" element={<RecoverPassword />} />
      <Route path="/recuperar/codigo" element={<RecoveryStep2 />} />
    </Routes>
  </Layout>
);

export default App;

import { Layout } from 'antd';
import { Route, Routes } from 'react-router-dom';
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
import InfoPage from '@pages/InfoPage';

const App = () => (
  <Layout style={{ minHeight: '100vh', background: '#F8F9FF' }}>
    <Routes>
      <Route element={<PortalLayout />}>
        <Route path="/" element={<Portal />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/cronograma"
          element={
            <InfoPage
              title="Cronograma"
              description="Agenda oficial de ponencias, liturgia y mesas de trabajo."
            />
          }
        />
        <Route
          path="/ponentes"
          element={
            <InfoPage
              title="Ponentes"
              description="Voces de la misión digital en las 24 diócesis y vicariatos."
            />
          }
        />
        <Route
          path="/vivo"
          element={
            <InfoPage
              title="Transmisión en Vivo"
              description="Señal oficial de la asamblea para quienes siguen desde sus diócesis."
            />
          }
        />
        <Route
          path="/ayuda"
          element={
            <InfoPage
              title="Ayuda / Soporte"
              description="Acreditación, hospedaje y mesa técnica pastoral."
            />
          }
        />
        <Route
          path="/contacto"
          element={
            <InfoPage
              title="Contacto CEV"
              description="Conferencia Episcopal Venezolana · Sede Montalbán."
            />
          }
        />
      </Route>

      <Route element={<MobileLayout />}>
        <Route path="/pase" element={<Pase />} />
        <Route path="/pase/:token" element={<Pase />} />
        <Route
          path="/programa"
          element={
            <InfoPage
              title="Programa"
              description="Itinerario de la asamblea para acreditados en sede."
            />
          }
        />
        <Route
          path="/mapa"
          element={
            <InfoPage
              title="Mapa CEV"
              description="Salón San Juan Pablo II, capilla, comedor y residencias."
            />
          }
        />
        <Route
          path="/perfil"
          element={
            <InfoPage
              title="Mi Perfil"
              description="Datos de acreditación, hospedaje y contacto diocesano."
            />
          }
        />
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
          <Route
            path="usuarios"
            element={
              <RequireAdminOnly>
                <Users />
              </RequireAdminOnly>
            }
          />
          <Route
            path="alojamientos"
            element={
              <InfoPage title="Alojamientos" description="Asignación de habitaciones en sede CEV." />
            }
          />
          <Route
            path="finanzas"
            element={<InfoPage title="Finanzas" description="Aportes eclesiásticos y conciliación." />}
          />
          <Route
            path="reportes"
            element={<InfoPage title="Reportes" description="Indicadores de inscripción y check-in." />}
          />
          <Route
            path="ajustes"
            element={<InfoPage title="Ajustes Generales" description="Configuración del evento y del portal CEV." />}
          />
          <Route
            path="delegaciones"
            element={<InfoPage title="Delegaciones" description="Equipos diocesanos acreditados en Caracas 2026." />}
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

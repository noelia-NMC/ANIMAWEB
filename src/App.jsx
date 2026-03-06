// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { AuthLayout, WebOnlyRoute, PublicOnly, PermissionRoute } from './components/PrivateRoute';

import WelcomeAnima from './pages/WelcomeAnima';
import OnboardingClinica from './pages/OnboardingClinica';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Mascotas from './pages/Mascotas';
import Turnos from './pages/Turnos';
import Veterinarios from './pages/Veterinarios';
import Teleconsultas from './pages/Teleconsultas';
import Roles from './pages/Roles';
import ProfilePage from './pages/ProfilePage';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import ExpedienteClinico from './pages/ExpedienteClinico';
import Bitacora from './pages/Bitacora';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/bienvenida" replace />} />

          {/* Públicas */}
          <Route
            path="/bienvenida"
            element={
              <PublicOnly>
                <WelcomeAnima />
              </PublicOnly>
            }
          />
          <Route
            path="/onboarding"
            element={
              <PublicOnly>
                <OnboardingClinica />
              </PublicOnly>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnly>
                <Login />
              </PublicOnly>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnly>
                <Register />
              </PublicOnly>
            }
          />

          {/* Privadas */}
          <Route element={<Layout />}>
            <Route element={<AuthLayout />}>
              {/* ✅ WEB: deja pasar cualquier rol (excepto dueño/dueno) */}
              <Route element={<WebOnlyRoute />}>
                {/* ✅ Dashboard */}
                <Route element={<PermissionRoute anyOf={['dashboard:read']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                </Route>

                {/* ✅ Clientes */}
                <Route element={<PermissionRoute anyOf={['clientes:read']} />}>
                  <Route path="/clientes" element={<Clientes />} />
                </Route>

                {/* ✅ Mascotas */}
                <Route element={<PermissionRoute anyOf={['mascotas:read']} />}>
                  <Route path="/mascotas" element={<Mascotas />} />
                </Route>

                {/* ✅ Turnos */}
                <Route element={<PermissionRoute anyOf={['turnos:read']} />}>
                  <Route path="/turnos" element={<Turnos />} />
                </Route>

                {/* ✅ Historial */}
                <Route element={<PermissionRoute anyOf={['expediente:read']} />}>
                  <Route path="/historial" element={<ExpedienteClinico />} />
                </Route>

                {/* ✅ Teleconsultas */}
                <Route element={<PermissionRoute anyOf={['teleconsultas:read']} />}>
                  <Route path="/teleconsultas" element={<Teleconsultas />} />
                </Route>

                {/* ✅ Productos */}
                <Route element={<PermissionRoute anyOf={['productos:read']} />}>
                  <Route path="/productos" element={<Productos />} />
                </Route>

                {/* ✅ Veterinarios */}
                <Route element={<PermissionRoute anyOf={['veterinarios:read']} />}>
                  <Route path="/veterinarios" element={<Veterinarios />} />
                </Route>

                {/* ✅ Roles */}
                <Route element={<PermissionRoute anyOf={['roles:read']} />}>
                  <Route path="/roles" element={<Roles />} />
                </Route>

                {/* ✅ Bitacora */}
                <Route element={<PermissionRoute anyOf={['bitacora:read']} />}>
                  <Route path="/bitacora" element={<Bitacora />} />
                </Route>

                {/* Perfil: libre para cualquier logueado web */}
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<h1 style={{ padding: 20 }}>Página no encontrada</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
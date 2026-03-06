// src/components/PrivateRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ✅ Solo verifica sesión
export function AuthLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

/**
 * ✅ WebOnlyRoute (REEMPLAZA RoleBasedRoute)
 * - Deja entrar a CUALQUIER rol creado en la web (inventario, etc.)
 * - Bloquea solo dueño/dueno (porque es exclusivo móvil)
 */
export function WebOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const rol = String(user?.rol || user?.rol_nombre || '').toLowerCase();

  if (rol === 'dueño' || rol === 'dueno') {
    return (
      <div style={{ padding: 20 }}>
        <h1>403: Acceso denegado</h1>
        <p>Este rol es exclusivo de la app móvil.</p>
      </div>
    );
  }

  return <Outlet />;
}

// ✅ Proteger por PERMISOS (TU LÓGICA ESTÁ BIEN)
export function PermissionRoute({ anyOf = [], allOf = [] }) {
  const { user, loading, hasAnyPermission, hasPermission } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Admin ve todo
  const rol = String(user?.rol || user?.rol_nombre || '').toLowerCase();
  if (rol === 'admin') return <Outlet />;

  const safeHasAny = typeof hasAnyPermission === 'function' ? hasAnyPermission : () => false;
  const safeHas = typeof hasPermission === 'function' ? hasPermission : () => false;

  const okAny = anyOf?.length ? safeHasAny(anyOf) : true;
  const okAll = allOf?.length ? allOf.every((p) => safeHas(p)) : true;

  if (!okAny || !okAll) {
    return (
      <div style={{ padding: 20 }}>
        <h1>403: Acceso denegado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <small style={{ opacity: 0.8 }}>
          anyOf: {JSON.stringify(anyOf)} | allOf: {JSON.stringify(allOf)}
        </small>
      </div>
    );
  }

  return <Outlet />;
}

// ✅ Si ya está logueado, no entra a login/onboarding/welcome
export function PublicOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 20 }}>Cargando...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
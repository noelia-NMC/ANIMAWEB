import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API = import.meta.env.VITE_API_URL;

export function useAuth() {
  return useContext(AuthContext);
}

const getAuthHeaders = (tk) => ({
  headers: { Authorization: `Bearer ${tk}` },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // ✅ helpers por permisos
  const hasPermission = (perm) => {
    if (user?.rol === 'admin') return true; // admin ve todo
    if (!user?.permisos) return false;
    return user.permisos.includes(perm);
  };

  const hasAnyPermission = (perms = []) => {
    if (user?.rol === 'admin') return true;
    if (!perms?.length) return true;
    if (!user?.permisos) return false;
    return perms.some((p) => user.permisos.includes(p));
  };

  // ✅ trae user real + permisos desde backend (SIEMPRE ACTUALIZADO)
  const refreshMe = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return null;
    }

    try {
      const res = await axios.get(`${API}/auth/me`, getAuthHeaders(storedToken));
      setUser(res.data);
      setToken(storedToken);
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      console.error('refreshMe error:', e?.response?.data || e.message);
      logout();
      return null;
    }
  };

  // 🔄 Cargar desde localStorage + refrescar permisos al iniciar (clave)
  useEffect(() => {
    (async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      await refreshMe();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔄 EXTRA: refrescar permisos cuando vuelves al tab (admin cambió roles)
  useEffect(() => {
    const onFocus = async () => {
      if (localStorage.getItem('token')) {
        await refreshMe();
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔐 Login tradicional (loginUser devuelve token + user + permisos)
  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  // 🔐 Login desde onboarding
  const loginWithToken = async (userToken, userData) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);

    if (!userData?.permisos) {
      await refreshMe();
      return;
    }

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  // 🔄 Actualizar usuario (preserva rol y clinica)
  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const base = prev || {};
      const newUser = {
        ...base,
        ...updatedUserData,
        rol_id: updatedUserData?.rol_id ?? base.rol_id,
        rol: updatedUserData?.rol ?? base.rol,
        clinica_id: updatedUserData?.clinica_id ?? base.clinica_id,
        permisos: updatedUserData?.permisos ?? base.permisos ?? [],
      };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: !!token,
      loading,
      login,
      loginWithToken,
      logout,
      updateUser,
      refreshMe,
      hasPermission,
      hasAnyPermission,
    }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div style={{ padding: 20 }}>Cargando...</div> : children}
    </AuthContext.Provider>
  );
}
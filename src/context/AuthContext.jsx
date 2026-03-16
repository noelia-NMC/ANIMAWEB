import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const rawApi = import.meta.env.VITE_API_URL || '';

const normalizeBase = (base) => {
  const clean = String(base || '').trim().replace(/\/+$/, '');
  return clean.replace(/\/api$/i, '');
};

const API = `${normalizeBase(rawApi)}/api`;

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

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const hasPermission = (perm) => {
    if (user?.rol === 'admin') return true;
    if (!user?.permisos) return false;
    return user.permisos.includes(perm);
  };

  const hasAnyPermission = (perms = []) => {
    if (user?.rol === 'admin') return true;
    if (!perms?.length) return true;
    if (!user?.permisos) return false;
    return perms.some((p) => user.permisos.includes(p));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  const refreshMe = async ({ silent = false } = {}) => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      if (!silent) {
        setUser(null);
        setToken(null);
      }
      return null;
    }

    try {
      const res = await axios.get(`${API}/auth/me`, getAuthHeaders(storedToken));

      setUser(res.data);
      setToken(storedToken);
      localStorage.setItem('user', JSON.stringify(res.data));

      return res.data;
    } catch (e) {
      const status = e?.response?.status;
      console.error('refreshMe error:', e?.response?.data || e.message);

      if (status === 401 || status === 403) {
        logout();
      } else {
        setToken(storedToken);

        try {
          const rawUser = localStorage.getItem('user');
          const parsedUser = rawUser ? JSON.parse(rawUser) : null;
          if (parsedUser) setUser(parsedUser);
        } catch (err) {
          console.warn('No se pudo restaurar el usuario desde localStorage');
        }
      }

      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        if (mounted) setLoading(false);
        return;
      }

      await refreshMe();

      if (mounted) setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onFocus = async () => {
      if (localStorage.getItem('token')) {
        await refreshMe({ silent: true });
      }
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

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
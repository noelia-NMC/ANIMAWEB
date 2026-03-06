// src/components/Layout.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chatbot from '../pages/Chatbot';

import {
  MainWrapper,
  SidebarContainer,
  SidebarHeader,
  Brand,
  BrandIcon,
  NavLinksContainer,
  NavLink,
  NavIcon,
  NavLabel,
  LogoutButton,
  PageWrapper,
  HeaderContainer,
  HeaderLeft,
  HeaderCenter,
  HeaderRight,
  HeaderLink,
  ToggleButton,
  HeaderUserInfo,
  UserAvatarContainer,
  UserAvatar,
  UserAvatarInitials,
  UserName,
  ContentContainer,
  DropdownMenu,
  DropdownItem,
  DropdownButton,
} from './Layout.styles';

export default function Layout() {
  const [isExpanded, setIsExpanded] = useState(window.innerWidth > 992);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) setIsExpanded(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsExpanded((s) => !s);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getUserInitials = () => (user?.nombre || user?.email || 'U').charAt(0).toUpperCase();

  // ✅ ALL LINKS (pero con categoría)
  const allLinks = useMemo(
    () => [
      // NO CRUDs (van al header)
      { to: '/teleconsultas', icon: '💻', label: 'Teleconsultas', perm: 'teleconsultas:read', group: 'header' },
      { to: '/bitacora', icon: '🧾', label: 'Bitácora', perm: 'bitacora:read', group: 'header' },
      { to: '/roles', icon: '⚙️', label: 'Roles', perm: 'roles:read', group: 'header' },

      // CRUDs (van al sidebar)
      { to: '/dashboard', icon: '📊', label: 'Dashboard', perm: 'dashboard:read', group: 'crud' },
      { to: '/clientes', icon: '👥', label: 'Clientes', perm: 'clientes:read', group: 'crud' },
      { to: '/mascotas', icon: '🐾', label: 'Mascotas', perm: 'mascotas:read', group: 'crud' },
      { to: '/turnos', icon: '📅', label: 'Turnos', perm: 'turnos:read', group: 'crud' },
      { to: '/historial', icon: '📋', label: 'Expediente', perm: 'historial:read', group: 'crud' },
      { to: '/productos', icon: '📦', label: 'Inventario', perm: 'productos:read', group: 'crud' },
      { to: '/veterinarios', icon: '👨‍⚕️', label: 'Usuarios', perm: 'veterinarios:read', group: 'crud' },
    ],
    []
  );

  const permisos = useMemo(() => (Array.isArray(user?.permisos) ? user.permisos : []), [user?.permisos]);
  const permisosKey = useMemo(() => permisos.join('|'), [permisos]);

  // ✅ lógica permisos + admin ve todo
  const linksAllowed = useMemo(() => {
    if (!user) return [];

    if (user.rol === 'admin') return allLinks;

    // fallback si no cargó permisos
    if (!permisos.length) {
      const minimal = new Set(['/dashboard', '/turnos', '/historial', '/teleconsultas', '/productos']);
      return allLinks.filter((l) => minimal.has(l.to));
    }

    return allLinks.filter((l) => permisos.includes(l.perm));
  }, [user, allLinks, permisosKey]);

  // ✅ separar por grupo
  const crudLinks = useMemo(() => linksAllowed.filter((l) => l.group === 'crud'), [linksAllowed]);
  const headerLinks = useMemo(() => linksAllowed.filter((l) => l.group === 'header'), [linksAllowed]);

  return (
    <MainWrapper>
      {/* SIDEBAR: SOLO CRUDs */}
      <SidebarContainer isExpanded={isExpanded}>
        <SidebarHeader isExpanded={isExpanded}>
          <Brand to="/dashboard" isExpanded={isExpanded}>ANIMA</Brand>
          <BrandIcon to="/dashboard" isExpanded={isExpanded}>A</BrandIcon>
        </SidebarHeader>

        <NavLinksContainer>
          {crudLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'active' : ''}
            >
              <NavIcon isExpanded={isExpanded}>{link.icon}</NavIcon>
              <NavLabel isExpanded={isExpanded}>{link.label}</NavLabel>
            </NavLink>
          ))}
        </NavLinksContainer>

        <LogoutButton onClick={handleLogout} isExpanded={isExpanded}>
          <NavIcon isExpanded={isExpanded}>🚪</NavIcon>
          <NavLabel isExpanded={isExpanded}>Cerrar sesión</NavLabel>
        </LogoutButton>
      </SidebarContainer>

      <PageWrapper isExpanded={isExpanded}>
        {/* HEADER: lo que NO es CRUD */}
        <HeaderContainer>
          <HeaderLeft>
            <ToggleButton onClick={toggleSidebar}>☰</ToggleButton>
          </HeaderLeft>

          <HeaderCenter>
            {headerLinks.map((link) => (
              <HeaderLink
                key={link.to}
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </HeaderLink>
            ))}
          </HeaderCenter>

          <HeaderRight>
            <HeaderUserInfo ref={dropdownRef}>
              <UserAvatarContainer onClick={() => setDropdownOpen((s) => !s)}>
                <UserName>¡Hola, {user?.nombre || user?.email}!</UserName>

                {user?.avatar_url ? (
                  <UserAvatar src={user.avatar_url} alt="Avatar" />
                ) : (
                  <UserAvatarInitials>{getUserInitials()}</UserAvatarInitials>
                )}
              </UserAvatarContainer>

              {dropdownOpen && (
                <DropdownMenu>
                  <DropdownItem to="/profile">Editar perfil</DropdownItem>
                  <DropdownButton onClick={handleLogout}>Cerrar sesión</DropdownButton>
                </DropdownMenu>
              )}
            </HeaderUserInfo>
          </HeaderRight>
        </HeaderContainer>

        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </PageWrapper>

      <Chatbot />
    </MainWrapper>
  );
}
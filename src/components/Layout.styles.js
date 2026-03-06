// src/components/Layout.styles.js
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

export const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
  danger: '#e74c3c',
  sidebarBg: '#2c3e50',
  sidebarText: '#ecf0f1',
  sidebarHover: '#34495e',
  sidebarActive: '#42a8a1',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const MainWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.background};
`;

export const SidebarContainer = styled.aside`
  width: ${(props) => (props.isExpanded ? '260px' : '88px')};
  background: ${colors.sidebarBg};
  color: ${colors.sidebarText};
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transition: width 0.3s ease-in-out;
  z-index: 1001;
  box-shadow: 4px 0 15px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    width: ${(props) => (props.isExpanded ? '260px' : '0')};
    overflow: hidden;
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isExpanded ? 'space-between' : 'center')};
  height: 70px;
  background: #25394b;
`;

export const Brand = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: ${colors.white};
  text-decoration: none;
  display: ${(props) => (props.isExpanded ? 'block' : 'none')};
`;

export const BrandIcon = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: ${colors.primary};
  text-decoration: none;
  display: ${(props) => (props.isExpanded ? 'none' : 'block')};
`;

export const NavLinksContainer = styled.nav`
  flex-grow: 1;
  overflow-y: auto;
  margin-top: 20px;
`;

export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 15px 30px;
  color: ${colors.sidebarText};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-left: 4px solid transparent;

  &:hover {
    background: ${colors.sidebarHover};
    color: ${colors.white};
  }

  &.active {
    background: ${colors.sidebarActive};
    color: ${colors.white};
    border-left: 4px solid ${colors.secondary};
    padding-left: 26px;
  }
`;

export const NavIcon = styled.span`
  font-size: 22px;
  margin-right: ${(props) => (props.isExpanded ? '15px' : '0')};
  min-width: 24px;
  text-align: center;
  transition: margin-right 0.3s ease-in-out;
`;

export const NavLabel = styled.span`
  opacity: ${(props) => (props.isExpanded ? 1 : 0)};
  transition: opacity 0.2s ease-in-out;
  display: ${(props) => (props.isExpanded ? 'inline' : 'none')};
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.isExpanded ? 'flex-start' : 'center')};
  width: 100%;
  background: transparent;
  color: ${colors.danger};
  border: none;
  padding: 20px 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
  font-size: 16px;
  border-top: 1px solid ${colors.sidebarHover};

  &:hover {
    background: #e74c3c20;
  }
`;

export const PageWrapper = styled.div`
  flex-grow: 1;
  margin-left: ${(props) => (props.isExpanded ? '260px' : '88px')};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

export const HeaderContainer = styled.header`
  height: 70px;
  background: ${colors.white};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  gap: 16px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const HeaderCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow-x: auto;
  padding: 0 8px;

  /* scroll elegante */
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 999px; }
`;

export const HeaderLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: ${colors.textPrimary};
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: ${colors.background};
    border-color: ${colors.border};
  }

  &.active {
    background: ${colors.primary}15;
    border-color: ${colors.primary}40;
    color: ${colors.primary};
  }
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${colors.textPrimary};
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary};
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderUserInfo = styled.div`
  position: relative;
`;

export const UserAvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${colors.primary};
`;

export const UserAvatarInitials = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-weight: 700;
  border: 2px solid ${colors.primary};
`;

export const UserName = styled.span`
  font-weight: 600;
  color: ${colors.textPrimary};

  @media (max-width: 500px) {
    display: none;
  }
`;

export const ContentContainer = styled.main`
  padding: 2rem;
  width: 100%;
  height: calc(100vh - 70px);
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 120%;
  right: 0;
  background: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.1);
  width: 200px;
  z-index: 1002;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: ${colors.textPrimary};
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    background-color: ${colors.background};
  }
`;

export const DropdownButton = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 20px;
  color: ${colors.danger};
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background-color: ${colors.background};
  }
`;
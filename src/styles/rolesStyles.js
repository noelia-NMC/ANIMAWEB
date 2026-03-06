// src/styles/rolesStyles.js
import styled from 'styled-components';

const colors = {
  primary: '#42a8a1', primaryDark: '#358a82', white: '#ffffff', textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d', background: '#f4f7f6', lightGray: '#e0e0e0', border: '#eef2f1',
  danger: '#e74c3c'
};

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.border};
  flex-wrap: wrap;
  gap: 1rem;
`;

export const PageTitle = styled.h1`
  grid-column: 1 / -1; font-size: 1.5rem; font-weight: 600; color: ${colors.textSecondary};
  padding-bottom: 1rem; margin-bottom: -0.5rem; text-align: left;
`;

export const AddButton = styled.button`
  background: ${colors.primary}; color: white; border: none; padding: 0.7rem 1.5rem;
  font-size: 0.9rem; font-weight: 600; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; gap: 0.5rem; transition: background-color 0.2s ease;
  &:hover { background: ${colors.primaryDark}; }
`;

export const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 2rem;
  align-items: start;
  margin-top: -1.5rem;
`;

export const RolCard = styled.div`
  background: ${colors.white}; border-radius: 12px;
  box-shadow: 0 4px 15px rgba(44, 62, 80, 0.07);
  display: flex; flex-direction: column; border: 1px solid ${colors.border};
`;

export const RolHeader = styled.div`
  padding: 1.2rem; border-bottom: 1px solid ${colors.border};
  display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
`;

export const RolTitle = styled.h2`
  font-size: 1.25rem; color: ${colors.primary}; margin: 0 0 0.3rem 0;
  font-weight: 600; text-transform: capitalize;
`;

export const RolDescription = styled.p`
  color: ${colors.textSecondary}; font-size: 0.85rem; margin: 0; line-height: 1.4;
`;

export const RolActions = styled.div`
  display: flex; gap: 0.5rem; flex-shrink: 0;
`;

export const ActionButton = styled.button`
  background: transparent; border: 1px solid ${colors.border}; border-radius: 8px;
  cursor: pointer; color: ${colors.textSecondary}; font-size: 1rem; padding: 0.4rem;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease;
  &:hover:not(:disabled) { color: ${colors.primary}; border-color: ${colors.primary}; background-color: #f8f9fa; }
  &:disabled { color: ${colors.lightGray}; cursor: not-allowed; opacity: 0.7; }
`;

export const PermisosContainer = styled.div`
  padding: 1.2rem; flex-grow: 1; background-color: #fafdfc;
  max-height: 300px; overflow-y: auto;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: ${colors.border}; }
  &::-webkit-scrollbar-thumb { background: ${colors.lightGray}; border-radius: 3px; }
  &::-webkit-scrollbar-thumb:hover { background: ${colors.textSecondary}; }
`;

export const PermissionGroup = styled.div`
  margin-bottom: 1.2rem;
  &:last-child { margin-bottom: 0; }
`;

export const GroupTitle = styled.h3`
  font-size: 0.9rem; color: ${colors.textPrimary}; font-weight: 600;
  text-transform: capitalize; margin: 0 0 0.8rem 0; padding-bottom: 0.4rem;
  border-bottom: 1px solid ${colors.border};
`;

export const CheckboxGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 0.5rem;
`;

export const PermisoCheckbox = styled.div`
  display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem;
  color: ${colors.textPrimary};
  label { cursor: pointer; text-transform: capitalize; }
  input[type="checkbox"] {
    width: 14px; height: 14px; accent-color: ${colors.primary}; cursor: pointer;
    &:disabled { cursor: not-allowed; accent-color: ${colors.lightGray}; }
  }
  input:disabled + label { cursor: not-allowed; color: ${colors.textSecondary}; }
`;

export const CardFooter = styled.div`
  padding: 1rem 1.2rem; border-top: 1px solid ${colors.border};
  background: ${colors.white}; display: flex; justify-content: flex-end;
`;

export const SaveButton = styled.button`
  background: ${colors.primary}; color: white; border: none; padding: 0.7rem 1.5rem;
  font-size: 0.9rem; font-weight: 500; border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
  &:hover:not(:disabled) { background: ${colors.primaryDark}; }
  &:disabled { background: ${colors.lightGray}; color: ${colors.textSecondary}; cursor: not-allowed; }
`;

export const CancelButton = styled(SaveButton)`
  background: ${colors.white}; color: ${colors.textSecondary}; border: 1px solid ${colors.lightGray};
  &:hover:not(:disabled) { background: #f8f9fa; color: ${colors.textPrimary}; }
`;

export const LoadingState = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  height: 60vh; font-size: 1.2rem; color: ${colors.textSecondary};
  &::before { content: ''; width: 40px; height: 40px; border: 4px solid ${colors.border};
  border-top: 4px solid ${colors.primary}; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1rem; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

export const ErrorState = styled.div`
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  height: 60vh; font-size: 1.2rem; color: ${colors.danger}; text-align: center; padding: 2rem;
  &::before { content: '⚠️'; font-size: 3rem; margin-bottom: 1rem; }
`;

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(10, 20, 30, 0.5);
  display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(5px);
`;
export const ModalContent = styled.div`
  background: white; padding: 1rem; border-radius: 12px;
  width: 90%; max-width: 480px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;
export const ModalTitle = styled.h2`
  margin: 0 0 1.5rem 0; color: ${colors.textPrimary}; font-size: 1.5rem;
  font-weight: 600; text-align: center;
`;
export const Input = styled.input`
  width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid ${colors.lightGray};
  margin-bottom: 1rem; font-size: 1rem; box-sizing: border-box; transition: border-color 0.2s ease;
  &:focus { border-color: ${colors.primary}; outline: none; }
  &:disabled { background: ${colors.background}; cursor: not-allowed; }
`;
export const TextArea = styled.textarea`
  width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid ${colors.lightGray};
  min-height: 100px; resize: vertical; font-size: 1rem; font-family: inherit;
  box-sizing: border-box; transition: border-color 0.2s ease;
  &:focus { border-color: ${colors.primary}; outline: none; }
`;
export const ModalActions = styled.div`
  display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.5rem;
`;
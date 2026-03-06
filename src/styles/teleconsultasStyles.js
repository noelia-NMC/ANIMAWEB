// ARCHIVO COMPLETO Y LISTO: src/styles/teleconsultasStyles.js
// (Mantiene tu diseño original y solo añade lo necesario)

import styled, { css } from 'styled-components';

const colors = {
  primary: '#42a8a1', primaryDark: '#358a82', white: '#ffffff', textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d', background: '#f4f7f6', lightGray: '#e0e0e0', border: '#eef2f1',
  danger: '#e74c3c', warning: '#f39c12', success: '#27ae60', info: '#3498db'
};

// --- Contenedor principal de la página (tu original) ---
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-align: left;
  margin: 0;
`;

// --- Tarjeta de Controles (tu original) ---
export const HeaderSection = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.05);
  border: 1px solid ${colors.border};
`;

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

// --- Inputs y Botones (tus originales) ---
const baseInputStyles = css`
  padding: 10px 14px;
  border: 1px solid ${colors.lightGray};
  border-radius: 8px;
  font-size: 0.9rem;
  background-color: ${colors.white};
  color: ${colors.textPrimary};
  &:focus { outline: none; border-color: ${colors.primary}; box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.2); }
`;
export const SearchInput = styled.input`
  ${baseInputStyles}
  min-width: 250px;
  flex: 1;
`;
export const Select = styled.select`${baseInputStyles}`;

const BaseButton = styled.button`
  padding: 10px 22px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover { transform: translateY(-2px); }
`;

export const ExportButton = styled(BaseButton)`
  background-color: ${props => props.color || colors.textSecondary};
  color: ${colors.white};
  &:hover {
    background-color: ${props => props.hoverColor || colors.textPrimary};
  }
`;

// --- NUEVO COMPONENTE AÑADIDO ---
// Contenedor para los botones de exportación, para que se alineen a la derecha.
export const ExportButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-left: auto;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
    justify-content: stretch;
    > button {
      flex: 1;
    }
  }
`;

// --- Lista de Tarjetas (tu original) ---
export const ConsultasList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
  margin: -0.5rem;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }
`;

export const ConsultaCard = styled.div`
  background: ${colors.white};
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid ${colors.border};
  border-left: 4px solid ${props => {
    if (props.estado === 'pendiente') return colors.warning;
    if (props.estado === 'aceptada') return colors.success;
    return colors.textSecondary;
  }};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
`;

export const CardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

export const PetName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.primary};
  margin: 0;
  &::before { content: '🖥️'; margin-right: 0.5rem; }
`;

export const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: capitalize;
  color: ${colors.white};
  background-color: ${({ estado }) => {
    if (estado === 'pendiente') return colors.warning;
    if (estado === 'aceptada') return colors.success;
    if (estado === 'finalizada') return colors.textSecondary;
    return colors.lightGray;
  }};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: auto; 
  padding-bottom: 1rem;
`;

export const InfoRow = styled.div`
  &.full-width { grid-column: 1 / -1; }
`;

export const Label = styled.p`
  font-weight: 600; color: ${colors.textPrimary}; font-size: 0.7rem;
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.25rem 0;
`;

export const Value = styled.div`
  color: ${colors.textSecondary}; font-size: 0.9rem;
  line-height: 1.5; word-break: break-all;
`;

export const MeetLink = styled.a`
  color: ${colors.primary}; text-decoration: none; font-weight: 500;
  &:hover { text-decoration: underline; }
`;

export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 0.75rem;
  margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid ${colors.border};
`;

export const AcceptButton = styled(BaseButton)`
  background: ${colors.success}; color: ${colors.white}; padding: 8px 18px;
  &:hover { background: #229954; }
`;

export const FinishButton = styled(BaseButton)`
  background: ${colors.textSecondary}; color: ${colors.white}; padding: 8px 18px;
  &:hover { background: ${colors.textPrimary}; }
`;

export const EmptyState = styled.div`
  text-align: center; padding: 2rem 1rem; color: ${colors.textSecondary}; font-size: 0.9rem;
  grid-column: 1 / -1;
  &::before { content: '🖥️'; font-size: 2.5rem; display: block; margin-bottom: 1rem; }
`;
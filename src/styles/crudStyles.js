// src/styles/crudStyles.js
import styled, { css } from 'styled-components';

const colors = {
  primary: '#42a8a1', primaryDark: '#358a82', white: '#ffffff', textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d', background: '#f4f7f6', lightGray: '#e0e0e0', border: '#eef2f1',
  danger: '#e74c3c', dangerDark: '#c0392b', warning: '#f39c12', warningDark: '#e67e22'
};

// --- Contenedor Principal de la Página ---
export const PageGridContainer = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: 400px 1fr;
  grid-template-rows: auto 1fr;
  height: 100%;
  overflow: hidden;
  @media (max-width: 1024px) {
    display: flex; flex-direction: column; overflow: visible; height: auto;
  }
`;

// --- Título de la Página ---
export const PageTitle = styled.h1`
  grid-column: 1 / -1; font-size: 1.5rem; font-weight: 600; color: ${colors.textSecondary};
  padding-bottom: 1rem; margin-bottom: -0.5rem; text-align: left;
`;

// --- Columna Derecha (Búsqueda + Lista) ---
export const RightColumn = styled.div`
  grid-row: 2; grid-column: 2; display: flex; flex-direction: column;
  gap: 1.5rem; overflow: hidden;
`;

// --- Estilo Base para las Tarjetas ---
const CardBase = styled.div`
  background: ${colors.white}; border-radius: 12px; padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.05); border: 1px solid ${colors.border};
  display: flex; flex-direction: column;
`;

// --- Tarjetas Específicas ---
export const FormCard = styled(CardBase)`
  grid-row: 2; grid-column: 1;
`;
export const SearchSection = styled(CardBase)`
  padding: 1rem;
`;
export const ListCard = styled(CardBase)`
  flex: 1; min-height: 0;
`;

// --- Título dentro de las Tarjetas ---
export const SectionTitle = styled.h2`
  color: ${colors.textPrimary}; font-size: 1.1rem; font-weight: 600; margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem; border-bottom: 1px solid ${colors.border};
`;

// --- Lista con Scroll ---
export const CrudList = styled.div`
  flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;
  padding: 0.25rem; margin: -0.25rem;
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }
`;

// --- Tarjeta Individual de la Lista ---
export const CrudCard = styled.div`
  background: ${colors.white}; border-radius: 8px; padding: 1.25rem;
  border-left: 4px solid ${colors.primary}; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;
export const CardHeader = styled.header`
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 1rem; gap: 1rem;
`;
export const CardTitle = styled.h3`
  font-size: 1.1rem; font-weight: 700; color: ${colors.primary}; margin: 0;
  display: flex; align-items: center; gap: 0.5rem;
`;
export const CardInfo = styled.span`
  color: ${colors.textSecondary}; font-size: 0.85rem; white-space: nowrap;
`;
export const InfoGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem; margin-bottom: 1rem;
`;
export const InfoRow = styled.div`
  &.full-width { grid-column: 1 / -1; }
`;
export const Label = styled.p`
  font-weight: 600; color: ${colors.textPrimary}; font-size: 0.7rem;
  text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.25rem 0;
`;
export const Value = styled.p`
  color: ${colors.textSecondary}; font-size: 0.9rem; margin: 0; line-height: 1.5;
  text-transform: capitalize;
`;

// --- Formularios y Botones ---
export const Form = styled.form`
  display: grid;  grid-template-columns: 1fr;
`;
export const FormGroup = styled.div`
  &.full-width { grid-column: 1 / -1; }
  &.half-width { @media (min-width: 768px) { grid-column: span 1; } }
`;
export const FormGrid = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.25rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const baseInputStyles = css`
  width: 100%; padding: 10px 14px; border: 1px solid ${colors.lightGray};
  border-radius: 8px; font-size: 0.9rem;
  &:focus { outline: none; border-color: ${colors.primary}; box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.2); }
`;
export const Input = styled.input`${baseInputStyles}`;
export const Select = styled.select`${baseInputStyles}`;
export const TextArea = styled.textarea`${baseInputStyles} resize: vertical; min-height: 100px;`;
export const SearchInput = styled(Input)``;

export const FormActions = styled.div`
  grid-column: 1 / -1; display: flex; justify-content: flex-end;
  gap: 0.75rem; margin-top: 0.5rem;
`;
const BaseButton = styled.button`
  padding: 10px 22px; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { transform: translateY(-2px); }
`;
export const SubmitButton = styled(BaseButton)`
  background-color: ${colors.primary}; color: ${colors.white};
  &:hover { background-color: ${colors.primaryDark}; }
`;
export const CancelButton = styled(BaseButton)`
  background-color: ${colors.lightGray}; color: ${colors.textPrimary};
  &:hover { background-color: #d1d1d1; }
`;
export const EditButton = styled(BaseButton)`
  background: ${colors.warning}; color: ${colors.white}; padding: 8px 18px;
  &:hover { background: ${colors.warningDark}; }
`;
export const DeleteButton = styled(BaseButton)`
  background: ${colors.danger}; color: ${colors.white}; padding: 8px 18px;
  &:hover { background: ${colors.dangerDark}; }
`;
export const ButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 0.75rem;
  margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid ${colors.border};
`;

// --- Estados y Mensajes ---
export const EmptyState = styled.div`
  text-align: center; padding: 2rem 1rem; color: ${colors.textSecondary}; font-size: 0.9rem;
  height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;
  &::before { content: '${props => props.icon || '📂'}'; font-size: 2.5rem; display: block; margin-bottom: 1rem; }
`;
export const ErrorMessage = styled.div`
  color: #e53e3e; font-size: 0.8rem; font-weight: 500; margin-top: 4px;
  min-height: 1.2rem; text-align: left; width: 100%;
`;
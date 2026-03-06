// src/styles/productosGridStyles.js
import styled from 'styled-components';

export const colors = {
  primary: '#42a8a1',
  primaryDark: '#358a82',
  secondary: '#5dc1b9',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
};

/* ✅ Layout general con scroll interno */
export const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const TopBar = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 14px 16px;
  box-shadow: 0 8px 28px rgba(44, 62, 80, 0.06);
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 0 0 auto;
`;

export const TopLeft = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.textSecondary};
`;

export const SubTitle = styled.div`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`;

export const Controls = styled.div`
  display: flex;
  gap: 10px;
`;

const baseInput = `
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  outline: none;
  background: ${colors.white};
  color: ${colors.textPrimary};
  font-size: 0.92rem;
  width: 100%;

  &::placeholder{
    color: ${colors.textSecondary};
  }

  &:focus{
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.18);
  }
`;

export const Search = styled.input`
  ${baseInput};
  min-width: 250px;
`;

export const Select = styled.select`
  ${baseInput};
  min-width: 120px;
  width: auto;
`;

export const Btn = styled.button`
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 600; /* ✅ como tus CRUD */
  font-size: 0.9rem;
  transition: 0.12s;
  white-space: nowrap;

  &:hover { opacity: 0.92; }
  &:disabled { opacity: 0.65; cursor: not-allowed; }
`;

export const PrimaryBtn = styled(Btn)`
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: white;
`;

export const SoftBtn = styled(Btn)`
  background: ${colors.background};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
`;

export const LayoutGrid = styled.div`
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  margin-top: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    min-height: auto;
  }
`;

export const LeftPanel = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 8px 28px rgba(44, 62, 80, 0.05);
  overflow: hidden;
  min-height: 0;
`;

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid ${colors.border};
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const PanelTitle = styled.div`
  color: ${colors.textPrimary};
  font-size: 1.1rem;
  font-weight: 600; /* ✅ */
`;

export const PanelBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  max-height: calc(100vh - 260px);

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }

  @media (max-width: 1100px) {
    max-height: none;
    overflow: visible;
    padding-right: 0;
  }
`;

export const Field = styled.div`
  margin-bottom: 10px;
`;

export const Input = styled.input`
  ${baseInput};
`;

export const TextArea = styled.textarea`
  ${baseInput};
  resize: vertical;
  min-height: 90px;
`;

export const ErrorText = styled.div`
  min-height: 16px;
  margin-top: 4px;
  font-size: 0.78rem;
  font-weight: 600; /* ✅ no pesado */
  color: ${colors.danger};
`;

export const Hint = styled.div`
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px dashed ${colors.border};
  background: ${colors.background};
  color: ${colors.textSecondary};
  font-size: 0.92rem;
`;

/* ✅ panel derecho con scroll interno */
export const RightPanel = styled.div`
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;

  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }

  @media (max-width: 1100px) {
    overflow: visible;
    padding-right: 0;
  }
`;

export const Section = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 14px;
  box-shadow: 0 8px 28px rgba(44, 62, 80, 0.05);
`;

export const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

export const SectionName = styled.div`
  font-weight: 600; 
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SmallInfo = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.8rem;
`;

/* ✅ tarjetas compactas y limpias */
export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(235px, 1fr));
  gap: 12px;
`;

export const Card = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 12px;
  background: ${colors.white};
  box-shadow: 0 6px 16px rgba(44, 62, 80, 0.06);
`;

export const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
`;

export const CardTitle = styled.div`
  font-weight: 600; /* ✅ no pesado */
  color: ${colors.textPrimary};
  font-size: 0.98rem;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const AlertPill = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600; /* ✅ */
  font-size: 0.72rem;
  background: ${colors.danger}10;
  border: 1px solid ${colors.danger}45;
  color: ${colors.danger};
  white-space: nowrap;
  line-height: 1.1;
`;

/* ✅ chips MUY compactos */
export const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

export const Chip = styled.span`
  padding: 3px 8px;      /* ✅ más pequeño */
  border-radius: 999px;
  font-weight: 600;      /* ✅ */
  font-size: 0.72rem;
  border: 1px solid ${colors.border};
  background: ${colors.background};
  color: ${colors.textPrimary};
  white-space: nowrap;
  line-height: 1.1;
`;

export const StockChip = styled(Chip)`
  background: ${(p) => (p.$low ? `${colors.warning}18` : `${colors.primary}14`)};
  border-color: ${(p) => (p.$low ? `${colors.warning}55` : `${colors.primary}40`)};
  color: ${(p) => (p.$low ? colors.warning : colors.primaryDark)};
`;

export const CollarChip = styled(Chip)`
  background: ${colors.info}12;
  border-color: ${colors.info}45;
  color: ${colors.info};
`;

/* ✅ descripción solo si existe (y compacta) */
export const Desc = styled.div`
  margin-top: 8px;
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  line-height: 1.25;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ✅ acciones limpias */
export const CardActions = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid ${colors.border};
`;

export const MiniBtn = styled.button`
  border: none;
  border-radius: 12px;
  padding: 7px 10px;
  font-weight: 600; /* ✅ */
  font-size: 0.76rem;
  cursor: pointer;
  transition: 0.12s;
  white-space: nowrap;

  &:hover { opacity: 0.92; }
`;

export const MiniSoft = styled(MiniBtn)`
  background: ${colors.background};
  border: 1px solid ${colors.border};
  color: ${colors.textPrimary};
`;

export const MiniPrimary = styled(MiniBtn)`
  background: ${colors.primary};
  color: white;
`;

export const MiniDanger = styled(MiniBtn)`
  background: ${colors.danger};
  color: white;
`;

/* ===== Modal ===== */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 560px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 18px 44px rgba(0,0,0,0.18);
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 16px 18px;
  background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
  color: white;
  font-weight: 600; /* ✅ */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseX = styled.button`
  background: rgba(255,255,255,0.22);
  border: none;
  color: white;
  font-size: 18px;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  cursor: pointer;

  &:hover { opacity: 0.9; }
`;

export const ModalBody = styled.div`
  padding: 16px 18px;
`;

export const ModalActions = styled.div`
  padding: 14px 18px;
  border-top: 1px solid ${colors.border};
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

/* ✅ Movimientos (limpio y sin cajas gigantes) */
export const MovList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const MovItem = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 14px;
  padding: 12px;
  background: ${colors.background};
`;

export const MovTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const MovMeta = styled.div`
  font-weight: 500;
  color: ${colors.textSecondary};
  font-size: 0.82rem;
  white-space: nowrap;
`;

export const MovObs = styled.div`
  margin-top: 8px;
  color: ${colors.textPrimary};
  font-size: 0.9rem;
  line-height: 1.25;
`;

export const MovBy = styled.div`
  margin-top: 8px;
  color: ${colors.textSecondary};
  font-size: 0.82rem;
`;
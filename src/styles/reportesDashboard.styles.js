import styled, { keyframes } from 'styled-components';

/* ─── Tokens ─────────────────────────────────────────────── */
export const colors = {
  primary:        '#42a8a1',
  primaryDark:    '#358a82',
  primaryGlow:    'rgba(66,168,161,.13)',
  primaryLine:    'rgba(66,168,161,.5)',
  white:          '#ffffff',
  textPrimary:    '#2c3e50',
  textSecondary:  '#7f8c8d',
  background:     '#f4f7f6',
  lightGray:      '#e0e0e0',
  border:         '#eef2f1',
  danger:         '#e74c3c',
  dangerDark:     '#c0392b',
  warning:        '#f39c12',
  warningDark:    '#e67e22',
  shadow:         '0 16px 48px rgba(44,62,80,.12)',
};

/* ─── Animations — solo las necesarias ───────────────────── */
const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`;
const slideUp = keyframes`
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0);    }
`;
const spin = keyframes`to{transform:rotate(360deg)}`;

/* ─── Layout shell ───────────────────────────────────────── */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44,62,80,.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 12px;
  animation: ${fadeIn} .18s ease;
`;

export const Modal = styled.div`
  width: min(1120px, 100%);
  height: min(94vh, 800px);
  background: ${colors.background};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: ${colors.shadow};
  display: flex;
  flex-direction: column;
  animation: ${slideUp} .2s ease-out;
  border: 1px solid ${colors.border};
`;

/* ─── Header ─────────────────────────────────────────────── */
export const Header = styled.div`
  background: ${colors.primary};
  color: ${colors.white};
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: -.01em;
  }
`;

export const CloseBtn = styled.button`
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255,255,255,.18);
  color: ${colors.white};
  font-size: 20px;
  display: grid;
  place-items: center;
  line-height: 1;
  transition: background .15s;
  flex-shrink: 0;

  &:hover { background: rgba(255,255,255,.28); }
`;

/* ─── Body ───────────────────────────────────────────────── */
export const Body = styled.div`
  padding: 14px;
  overflow: auto;
  flex: 1;

  scrollbar-width: thin;
  scrollbar-color: ${colors.lightGray} transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: ${colors.lightGray}; border-radius: 99px; }
`;

/* ─── Cards ──────────────────────────────────────────────── */
export const Card = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 12px;
`;

/* ─── Top sticky bar ─────────────────────────────────────── */
export const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  padding-bottom: 12px;
  background: linear-gradient(to bottom, ${colors.background} 72%, transparent);
`;

export const TopBar = styled(Card)`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 680px) {
    grid-template-columns: 1fr 1fr;
    & > *:last-child { grid-column: 1 / -1; }
  }
`;

export const RightControls = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Form group ─────────────────────────────────────────── */
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  label {
    font-size: .72rem;
    font-weight: 600;
    color: ${colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  input {
    border: 1px solid ${colors.lightGray};
    border-radius: 8px;
    padding: 9px 11px;
    font-size: .88rem;
    outline: none;
    background: ${colors.white};
    color: ${colors.textPrimary};
    transition: border-color .15s, box-shadow .15s;
  }

  input:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryGlow};
  }
`;

/* ─── Buttons ────────────────────────────────────────────── */
const variantColor = (v) => {
  if (v === 'ok')   return '#27ae60';
  if (v === 'info') return '#2980b9';
  return colors.primary;
};

export const Btn = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 9px 14px;
  font-weight: 600;
  font-size: .86rem;
  color: ${colors.white};
  background: ${(p) => variantColor(p.$v)};
  display: inline-flex;
  align-items: center;
  gap: 7px;
  transition: filter .15s;
  white-space: nowrap;

  &:hover:not(:disabled) { filter: brightness(.93); }

  &:disabled {
    background: ${colors.lightGray};
    color: ${colors.textSecondary};
    cursor: not-allowed;
  }
`;

export const GhostBtn = styled.button`
  border: 1px solid ${colors.lightGray};
  background: ${colors.white};
  cursor: pointer;
  border-radius: 8px;
  padding: 6px 10px;
  font-weight: 500;
  font-size: .8rem;
  color: ${colors.textSecondary};
  transition: border-color .15s, color .15s;
  white-space: nowrap;

  &:hover {
    border-color: ${colors.primaryLine};
    color: ${colors.primaryDark};
  }
`;

/* ─── Section chips ──────────────────────────────────────── */
export const Chips = styled.div`
  min-width: min(500px, 100%);

  .chipsHead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }

  .ttl {
    font-size: .72rem;
    font-weight: 700;
    color: ${colors.textSecondary};
    text-transform: uppercase;
    letter-spacing: .04em;
  }

  .miniBtns {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .chipsGrid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;

    @media (max-width: 520px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

export const Chip = styled.button`
  border: 1px solid ${(p) => p.$on ? colors.primaryLine : colors.lightGray};
  background: ${(p) => p.$on ? colors.primaryGlow : colors.white};
  color: ${(p) => p.$on ? colors.primaryDark : colors.textSecondary};
  cursor: ${(p) => p.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${(p) => p.$disabled ? .45 : 1};
  border-radius: 999px;
  padding: 7px 10px;
  font-weight: ${(p) => p.$on ? 600 : 400};
  font-size: .8rem;
  transition: border-color .13s, background .13s, color .13s;
  text-align: center;
  white-space: nowrap;
`;

/* ─── Export buttons ─────────────────────────────────────── */
export const ExportBtns = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 960px) {
    justify-content: flex-start;
  }
`;

/* ─── Banners / errors ───────────────────────────────────── */
export const Banner = styled.div`
  background: #fef9ee;
  border: 1px solid #f9e4b7;
  color: ${colors.warningDark};
  padding: 9px 12px;
  border-radius: 10px;
  font-size: .85rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

export const ErrorBox = styled.div`
  background: #fdf2f2;
  border: 1px solid #f5c6c6;
  color: ${colors.dangerDark};
  padding: 9px 12px;
  border-radius: 10px;
  font-size: .85rem;
  font-weight: 500;
  margin-bottom: 12px;
`;

/* ─── Stats strip ────────────────────────────────────────── */
const accentColor = (c) => {
  if (c === 'ok')     return '#27ae60';
  if (c === 'info')   return '#2980b9';
  if (c === 'accent') return colors.warning;
  return colors.primary;
};

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const Stat = styled(Card)`
  padding: 14px;
  border-top: 3px solid ${(p) => accentColor(p.$c)};

  .val {
    font-size: 1.6rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    line-height: 1;
    letter-spacing: -.02em;
  }

  .lab {
    margin-top: 5px;
    color: ${colors.textSecondary};
    font-weight: 500;
    font-size: .76rem;
    text-transform: uppercase;
    letter-spacing: .03em;
  }
`;

/* ─── Sections accordion ─────────────────────────────────── */
export const SectionsGrid = styled.div`
  display: grid;
  gap: 8px;
`;

export const Section = styled.details`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;

  &[open] { box-shadow: 0 2px 12px rgba(44,62,80,.07); }

  summary {
    cursor: pointer;
    list-style: none;
    padding: 11px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-weight: 600;
    font-size: .88rem;
    color: ${colors.textPrimary};
    user-select: none;

    &:hover { background: ${colors.background}; }
  }

  summary::-webkit-details-marker { display: none; }

  .right {
    font-size: .75rem;
    color: ${colors.textSecondary};
    font-weight: 400;
  }

  .content { padding: 0 12px 12px; }
`;

/* ─── Content grid inside sections ──────────────────────────*/
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Mini cards ─────────────────────────────────────────── */
export const MiniCard = styled(Card)`
  background: ${colors.background};
`;

export const MiniTitle = styled.div`
  font-weight: 600;
  font-size: .83rem;
  color: ${colors.textPrimary};
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  span {
    font-size: .74rem;
    color: ${colors.textSecondary};
    font-weight: 400;
  }
`;

/* ─── Lists ──────────────────────────────────────────────── */
export const List = styled.div``;

export const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid ${colors.border};

  &:last-child { border-bottom: none; }
`;

export const L = styled.span`
  color: ${colors.textSecondary};
  font-size: .83rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const V = styled.span`
  font-weight: 600;
  font-size: .83rem;
  color: ${colors.textPrimary};
  white-space: nowrap;
  flex-shrink: 0;
`;

/* ─── Search input ───────────────────────────────────────── */
export const Search = styled.input`
  padding: 6px 10px;
  border: 1px solid ${colors.lightGray};
  border-radius: 7px;
  outline: none;
  font-size: .8rem;
  background: ${colors.white};
  color: ${colors.textPrimary};
  max-width: 200px;
  transition: border-color .15s, box-shadow .15s;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primaryGlow};
  }

  &::placeholder { color: ${colors.textSecondary}; }
`;

/* ─── Loading card ───────────────────────────────────────── */
export const LoadingCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .86rem;
  font-weight: 500;
  color: ${colors.textSecondary};
  padding: 14px;

  &::before {
    content: '';
    width: 15px;
    height: 15px;
    border: 2px solid ${colors.lightGray};
    border-top-color: ${colors.primary};
    border-radius: 50%;
    animation: ${spin} .7s linear infinite;
    flex-shrink: 0;
  }
`;
import styled, { keyframes } from 'styled-components';

const colors = {
  primary:       '#42a8a1',
  secondary:     '#5dc1b9',
  accent:        '#8ae0db',
  extra:         '#b5ffff',
  white:         '#ffffff',
  textPrimary:   '#222222',
  textSecondary: '#666666',
  lightGray:     '#f0f0f0',
  danger:        '#e53e3e',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-12px) rotate(3deg); }
`;

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
`;

/* ── FONDO ── */
export const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(
    135deg,
    ${colors.primary} 0%,
    ${colors.secondary} 50%,
    ${colors.accent} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
`;

/* Decorativos flotantes — forma cuadrada redondeada, diferente al login */
export const Decorative = styled.div`
  position: absolute;
  width:  ${(p) => p.size || '100px'};
  height: ${(p) => p.size || '100px'};
  background: linear-gradient(45deg, ${colors.accent}, ${colors.extra});
  border-radius: 28px;
  opacity: 0.13;
  top:    ${(p) => p.top    || 'auto'};
  bottom: ${(p) => p.bottom || 'auto'};
  left:   ${(p) => p.left   || 'auto'};
  right:  ${(p) => p.right  || 'auto'};
  animation: ${float} ${(p) => p.duration || '6s'} ease-in-out infinite;
  animation-delay: ${(p) => p.delay || '0s'};
  transform: rotate(${(p) => p.rotate || '0deg'});
`;

/* ── CARD ── */
export const Card = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${colors.white};
  border-radius: 28px;
  padding: 36px 36px 28px;
  box-shadow:
    0 24px 48px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(66, 168, 161, 0.22);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 1;
  overflow: hidden;

  /* Línea de acento superior — diferente al login */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary}, ${colors.accent});
    border-radius: 28px 28px 0 0;
  }

  @media (max-width: 560px) {
    padding: 28px 22px 24px;
  }
`;

/* ── HEADER DE LA CARD ── */
export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
`;

export const CardTopLeft = styled.div``;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 900;
  color: ${colors.textPrimary};
  letter-spacing: -0.4px;
  margin: 0 0 6px;
  animation: ${slideIn} 0.6s ease-out;
`;

export const Subtitle = styled.p`
  font-size: 13.5px;
  color: ${colors.textSecondary};
  line-height: 1.65;
  margin: 0;
  animation: ${slideIn} 0.8s ease-out;
`;

export const BackBtn = styled.button`
  flex-shrink: 0;
  padding: 9px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(0,0,0,0.10);
  background: transparent;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
    background: rgba(66,168,161,0.06);
  }
`;

/* ── SEPARADOR DE SECCIÓN ── */
export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 14px;
`;

export const SectionLine = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(66,168,161,0.18);
`;

export const SectionText = styled.span`
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${colors.primary};
  white-space: nowrap;
`;

/* ── GRID DE CAMPOS ── */
export const FieldGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 460px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  animation: ${fadeIn} 0.6s ease-out both;
  animation-delay: ${(p) => p.delay || '0s'};
`;

export const Label = styled.label`
  font-size: 13px;
  color: ${colors.textSecondary};
  letter-spacing: 0.1px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 13px 16px;
  border: 2px solid ${colors.lightGray};
  border-radius: 14px;
  font-size: 14px;
  font-family: inherit;
  background: ${colors.white};
  color: ${colors.textPrimary};
  transition: all 0.25s ease;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.textSecondary};
    opacity: 0.65;
  }

  &:hover:not(:focus) {
    border-color: ${colors.secondary};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow:
      0 0 0 3px rgba(66, 168, 161, 0.12),
      0 4px 12px rgba(66, 168, 161, 0.14);
    transform: translateY(-1px);
  }
`;

/* ── BOTÓN PRINCIPAL ── */
export const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 900;
  font-family: inherit;
  cursor: pointer;
  color: ${colors.white};
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  box-shadow: 0 8px 24px rgba(66, 168, 161, 0.32);
  transition: all 0.25s ease;
  margin-top: 6px;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.3px;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.45s;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 14px 32px rgba(66, 168, 161, 0.42);

    &::before { left: 100%; }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.68;
    cursor: not-allowed;
    transform: none;
  }
`;

/* ── FOOTER DE LA CARD ── */
export const CardFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;
`;

export const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;

  &:hover { color: ${colors.primary}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ── ERROR ── */
export const ErrorText = styled.p`
  font-size: 13px;
  font-weight: 800;
  color: ${colors.danger};
  background: rgba(229,62,62,0.07);
  border: 1.5px solid rgba(229,62,62,0.20);
  border-radius: 12px;
  padding: 10px 14px;
  margin: 6px 0 0;
`;

/* ── SPINNER ── */
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: ${colors.white};
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin-right: 10px;
  vertical-align: middle;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
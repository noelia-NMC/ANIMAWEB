import styled, { keyframes } from 'styled-components';

const colors = {
  primary:       '#42a8a1',
  secondary:     '#5dc1b9',
  accent:        '#8ae0db',
  extra:         '#b5ffff',
  white:         '#ffffff',
  black:         '#000000',
  textPrimary:   '#222222',
  textSecondary: '#666666',
  lightGray:     '#f0f0f0',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* FIX: pulse separado, no se usa dentro de hover de otro keyframe */
const pulse = keyframes`
  0%, 100% { transform: translateY(-3px) scale(1); }
  50%       { transform: translateY(-3px) scale(1.03); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

/* ── CONTENEDOR PRINCIPAL ── */
/* FIX: usar un solo div que haga todo — eliminar ResponsiveWrapper redundante */
export const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(
    135deg,
    ${colors.primary}   0%,
    ${colors.secondary} 50%,
    ${colors.accent}    100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px 16px;
  box-sizing: border-box;
`;

/* FIX: ResponsiveWrapper ya no anida LoginCard/Title/etc (eso no funciona en SC).
   Ahora es solo un alias de LoginContainer para no romper el import del componente. */
export const ResponsiveWrapper = LoginContainer;

/* ── CARD ── */
export const LoginCard = styled.div`
  background: ${colors.white};
  border-radius: 25px;
  padding: 36px 32px;
  width: 100%;
  max-width: 420px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.10),
    0 10px 20px rgba(66, 168, 161, 0.20);
  animation: ${fadeIn} 0.8s ease-out both;
  position: relative;
  z-index: 1;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 28px 22px;
    border-radius: 20px;
  }
`;

/* ── TEXTOS ── */
export const Title = styled.h2`
  color: ${colors.textPrimary};
  font-size: 28px;
  font-weight: 800;
  text-align: left;
  margin: 0;
  letter-spacing: -0.5px;
  animation: ${slideIn} 0.6s ease-out both;

  @media (max-width: 480px) { font-size: 22px; }
`;

export const Subtitle = styled.p`
  color: ${colors.textSecondary};
  text-align: left;
  margin: 0 0 28px;
  font-size: 14.5px;
  line-height: 1.5;
  animation: ${slideIn} 0.8s ease-out both;
`;

/* ── FORM ── */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputContainer = styled.div`
  animation: ${fadeIn} 0.6s ease-out both;
  animation-delay: ${(p) => p.delay || '0s'};
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 18px;
  border: 2px solid ${colors.lightGray};
  border-radius: 14px;
  font-size: 15px;
  font-family: inherit;
  background: ${colors.white};
  color: ${colors.textPrimary};
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.textSecondary};
    opacity: 0.70;
  }

  &:hover:not(:focus) {
    border-color: ${colors.secondary};
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow:
      0 0 0 3px rgba(66, 168, 161, 0.12),
      0 4px 14px rgba(66, 168, 161, 0.18);
    transform: translateY(-2px);
  }

  @media (max-width: 480px) {
    padding: 14px 16px;
    font-size: 15px;
  }
`;

/* ── BOTÓN ──
   FIX: no llamar a `animation` dentro de &:hover — conflictúa con transform.
   Usamos solo transform + box-shadow en hover. */
export const SubmitButton = styled.button`
  width: 100%;
  padding: 17px;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  color: ${colors.white};
  border: none;
  border-radius: 15px;
  font-size: 17px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 6px;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: ${fadeIn} 0.6s ease-out both;
  animation-delay: 0.5s;

  /* Efecto shimmer */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.20),
      transparent
    );
    transition: left 0.45s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow:
      0 10px 28px rgba(66, 168, 161, 0.42),
      0 4px 12px rgba(66, 168, 161, 0.22);

    &::before { left: 100%; }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(66, 168, 161, 0.30);
  }

  &:disabled {
    opacity: 0.70;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    padding: 15px;
    font-size: 15px;
  }
`;

/* ── DECORATIVOS FLOTANTES ── */
export const DecorativeElement = styled.div`
  position: absolute;
  width:  ${(p) => p.size || '100px'};
  height: ${(p) => p.size || '100px'};
  background: linear-gradient(45deg, ${colors.accent}, ${colors.extra});
  border-radius: 50%;
  opacity: 0.12;
  top:    ${(p) => p.top    || 'auto'};
  bottom: ${(p) => p.bottom || 'auto'};
  left:   ${(p) => p.left   || 'auto'};
  right:  ${(p) => p.right  || 'auto'};
  pointer-events: none;
  animation: ${float} ${(p) => p.duration || '5s'} ease-in-out infinite;
  animation-delay: ${(p) => p.delay || '0s'};
`;

/* ── SPINNER ──
   FIX: añadir display inline-flex + vertical-align para alinearse con texto */
export const LoadingSpinner = styled.div`
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: ${colors.white};
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
  margin-right: 10px;
  vertical-align: middle;
`;

/* ── BOTÓN SECUNDARIO ── */
export const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.textSecondary};
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
  padding: 0;

  &:hover:not(:disabled) {
    color: ${colors.primary};
  }

  &:disabled {
    opacity: 0.50;
    cursor: not-allowed;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 6px;
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

export const BackBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 800;
  font-family: inherit;
  color: ${colors.textSecondary};
  background: transparent;
  border: 1.5px solid rgba(0,0,0,0.10);
  border-radius: 12px;
  padding: 8px 14px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s;

  &:hover {
    color: ${colors.primary};
    border-color: ${colors.primary};
    background: rgba(66,168,161,0.06);
  }
`;
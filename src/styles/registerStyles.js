import styled, { keyframes } from 'styled-components';

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  accent: '#8ae0db',
  extra: '#b5ffff',
  background: '#f9f9f9',
  white: '#ffffff',
  black: '#000000',
  textPrimary: '#222222',
  textSecondary: '#666666',
  lightGray: '#f0f0f0',
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const RegisterContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const RegisterCard = styled.div`
  background: ${colors.white};
  border-radius: 25px;
  padding: 30px;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 10px 20px rgba(66, 168, 161, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden; 
`;

export const Title = styled.h2`
  color: ${colors.textPrimary};
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
  animation: ${slideIn} 0.6s ease-out;
`;

export const Subtitle = styled.p`
  color: ${colors.textSecondary};
  text-align: center;
  margin-bottom: 40px;
  font-size: 16px;
  animation: ${slideIn} 0.8s ease-out;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const InputContainer = styled.div`
  position: relative;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
`;

export const Input = styled.input`
  width: 100%;
  padding: 18px 20px;
  border: 2px solid ${colors.lightGray};
  border-radius: 15px;
  font-size: 16px;
  background: ${colors.white};
  color: ${colors.textPrimary};
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: ${colors.textSecondary};
    opacity: 0.7;
  }

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 
      0 0 0 3px rgba(66, 168, 161, 0.1),
      0 5px 15px rgba(66, 168, 161, 0.2);
    transform: translateY(-2px);
  }

  &:hover {
    border-color: ${colors.secondary};
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%);
  color: ${colors.white};
  border: none;
  border-radius: 15px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  margin-top: 10px;
  animation: ${fadeIn} 1.2s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 
      0 10px 25px rgba(66, 168, 161, 0.4),
      0 5px 15px rgba(66, 168, 161, 0.2);
    animation: ${pulse} 0.6s ease-in-out;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const DecorativeElement = styled.div`
  position: absolute;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  background: linear-gradient(45deg, ${colors.accent}, ${colors.extra});
  border-radius: 50%;
  opacity: 0.1;
  top: ${props => props.top || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  animation: ${float} ${props => props.duration || '4s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid ${colors.white};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  @media (max-width: 480px) {
    ${RegisterCard} {
      padding: 30px 25px;
      margin: 10px;
    }

    ${Title} {
      font-size: 28px;
    }

    ${Input} {
      padding: 16px 18px;
      font-size: 15px;
    }

    ${SubmitButton} {
      padding: 16px;
      font-size: 16px;
    }
  }
`;

export const SecondaryButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.black};
  font-size: 14px;
  margin-top: 15px;
  text-decoration: underline;
  cursor: pointer;
  transition: 0.3s ease;
  
  &:hover {
    color: ${colors.extra};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
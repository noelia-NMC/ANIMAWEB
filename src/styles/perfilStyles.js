// styles/perfilStyles.js
import styled, { keyframes } from 'styled-components';
import { colors } from './colors';

// Animaciones
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

// Contenedor principal
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease-out;
`;

// Header del perfil
export const ProfileHeader = styled.div`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
  color: ${colors.white};
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${colors.shadowMedium};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(50%, -50%);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
    padding: 2rem;
  }
`;

export const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  z-index: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
`;

export const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: ${colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  border: 4px solid rgba(255, 255, 255, 0.3);
  animation: ${float} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 2rem;
  }
`;

export const AvatarUpload = styled.label`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  background: ${colors.white};
  color: ${colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  border: 3px solid ${colors.primary};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${colors.shadowMedium};
  }
`;

export const UserInfo = styled.div`
  flex: 1;
`;

export const UserName = styled.h1`
  font-size: 2.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const UserRole = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
`;

export const UserEmail = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
`;

export const LastLogin = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
`;

// Estadísticas
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: ${slideInRight} 0.6s ease-out;
  animation-delay: ${props => props.index * 0.1}s;
  animation-fill-mode: both;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

// Contenido del perfil
export const ProfileContent = styled.div`
  display: grid;
  gap: 2rem;
`;

export const Section = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${colors.shadowLight};
  border: 1px solid ${colors.border};
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const SectionTitle = styled.h2`
  font-size: 1.4rem;
  color: ${colors.textPrimary};
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// Formularios
export const ProfileForm = styled.form``;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${colors.textPrimary};
  font-size: 0.9rem;
`;

export const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: ${colors.white};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.1);
  }
  
  &:disabled {
    background: ${colors.backgroundSecondary};
    color: ${colors.textSecondary};
    cursor: not-allowed;
  }
`;

export const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: ${colors.white};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.1);
  }
  
  &:disabled {
    background: ${colors.backgroundSecondary};
    color: ${colors.textSecondary};
    cursor: not-allowed;
  }
`;

export const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: ${colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.1);
  }
  
  &:disabled {
    background: ${colors.backgroundSecondary};
    color: ${colors.textSecondary};
    cursor: not-allowed;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SaveButton = styled.button`
  background: ${colors.gradientPrimary};
  color: ${colors.white};
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${colors.shadowMedium};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  color: ${colors.textSecondary};
  border: 2px solid ${colors.border};
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.textSecondary};
    color: ${colors.textPrimary};
  }
`;

// Sección de contraseña
export const PasswordSection = styled(Section)`
  background: linear-gradient(135deg, #ffe6e6 0%, #fff0f0 100%);
  border: 1px solid #ffcccb;
`;

export const PasswordForm = styled.form`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Actividad reciente
export const ActivitySection = styled(Section)``;

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.backgroundSecondary};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ActivityIcon = styled.div`
  font-size: 1.5rem;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.backgroundSecondary};
  border-radius: 50%;
`;

export const ActivityText = styled.div`
  flex: 1;
  font-weight: 500;
  color: ${colors.textPrimary};
`;

export const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: ${colors.textSecondary};
`;

// Mensajes
export const SuccessMessage = styled.div`
  background: #e6ffe6;
  color: #00b894;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #55efc4;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.3s ease-out;
`;

export const ErrorMessage = styled.div`
  background: #ffe6e6;
  color: #d63031;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fab1a0;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.3s ease-out;
`;
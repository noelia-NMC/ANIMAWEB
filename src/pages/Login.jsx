import { useState } from 'react';
import { login } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  LoginContainer,
  LoginCard,
  Title,
  Subtitle,
  Form,
  InputContainer,
  Input,
  SubmitButton,
  SecondaryButton,
  DecorativeElement,
  LoadingSpinner,
  ButtonContainer,
  BackBtn,
  TitleRow,
} from '../styles/loginStyled';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El correo es obligatorio.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Correo inválido.';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria.';
    } else if (password.trim().length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email.trim().toLowerCase(), password);
      authLogin(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <DecorativeElement size="150px" top="10%" left="10%" duration="5s" delay="0s" />
      <DecorativeElement size="100px" top="20%" right="15%" duration="7s" delay="1s" />
      <DecorativeElement size="80px" bottom="15%" left="20%" duration="6s" delay="2s" />
      <DecorativeElement size="120px" bottom="25%" right="10%" duration="8s" delay="0.5s" />

      <LoginCard>
        <TitleRow>
          <Title>¡Bienvenido!</Title>
          <BackBtn type="button" onClick={() => navigate('/bienvenida')} disabled={isLoading}>
            ← Volver
          </BackBtn>
        </TitleRow>

        <Subtitle>Inicia sesión para continuar</Subtitle>

        <Form onSubmit={handleLogin} noValidate>
          <InputContainer delay="0.2s">
            <Input
              type="email"
              placeholder="📧 Correo electrónico"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
              }}
              onBlur={() => {
                if (!email.trim()) {
                  setErrors((prev) => ({ ...prev, email: 'El correo es obligatorio.' }));
                } else if (!EMAIL_REGEX.test(email.trim())) {
                  setErrors((prev) => ({ ...prev, email: 'Correo inválido.' }));
                }
              }}
              disabled={isLoading}
            />
            {errors.email && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: 6 }}>{errors.email}</p>}
          </InputContainer>

          <InputContainer delay="0.4s">
            <Input
              type="password"
              placeholder="🔒 Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              }}
              onBlur={() => {
                if (!password.trim()) {
                  setErrors((prev) => ({ ...prev, password: 'La contraseña es obligatoria.' }));
                } else if (password.trim().length < 6) {
                  setErrors((prev) => ({ ...prev, password: 'La contraseña debe tener al menos 6 caracteres.' }));
                }
              }}
              disabled={isLoading}
            />
            {errors.password && <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginTop: 6 }}>{errors.password}</p>}
          </InputContainer>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner />
                Iniciando sesión...
              </>
            ) : (
              'Entrar'
            )}
          </SubmitButton>

          <ButtonContainer>
            <SecondaryButton
              type="button"
              onClick={() => navigate('/onboarding')}
              disabled={isLoading}
            >
              ¿No tienes cuenta? Regístrate
            </SecondaryButton>
          </ButtonContainer>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}
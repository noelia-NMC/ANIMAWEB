import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerClinicAndAdmin } from '../services/onboardingService';
import { useAuth } from '../context/AuthContext';

import {
  Container, Decorative, Card, CardTop, CardTopLeft, Title, Subtitle, BackBtn,
  SectionLabel, SectionLine, SectionText, FieldGrid, FieldRow, FieldWrap, Label,
  Input, SubmitButton, CardFooter, SecondaryButton, ErrorText, LoadingSpinner,
} from '../styles/onboardingStyled';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const NIT_REGEX = /^[0-9a-zA-Z-]{3,30}$/;

export default function OnboardingClinica() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const [clinica, setClinica] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    nit: '',
    email: '',
  });

  const [admin, setAdmin] = useState({
    nombre_admin: '',
    email_admin: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateField = (name, value, source = 'clinica') => {
    const val = String(value ?? '').trim();

    if (source === 'clinica') {
      switch (name) {
        case 'nombre':
          if (!val) return 'El nombre de la clínica es obligatorio.';
          if (val.length < 3) return 'Debe tener al menos 3 caracteres.';
          if (val.length > 120) return 'El nombre es demasiado largo.';
          return null;

        case 'telefono':
          if (!val) return null;
          if (!PHONE_REGEX.test(val)) return 'Teléfono inválido.';
          return null;

        case 'direccion':
          if (!val) return null;
          if (val.length < 5) return 'La dirección es muy corta.';
          if (val.length > 180) return 'La dirección es demasiado larga.';
          return null;

        case 'nit':
          if (!val) return null;
          if (!NIT_REGEX.test(val)) return 'NIT inválido.';
          return null;

        case 'email':
          if (!val) return null;
          if (!EMAIL_REGEX.test(val)) return 'El correo de la clínica no es válido.';
          return null;

        default:
          return null;
      }
    }

    if (source === 'admin') {
      switch (name) {
        case 'nombre_admin':
          if (!val) return 'El nombre del administrador es obligatorio.';
          if (val.length < 3) return 'Debe tener al menos 3 caracteres.';
          if (val.length > 100) return 'El nombre es demasiado largo.';
          return null;

        case 'email_admin':
          if (!val) return 'El correo del administrador es obligatorio.';
          if (!EMAIL_REGEX.test(val)) return 'Correo inválido.';
          return null;

        case 'password':
          if (!val) return 'La contraseña es obligatoria.';
          if (val.length < 8) return 'La contraseña debe tener mínimo 8 caracteres.';
          if (val.length > 50) return 'La contraseña es demasiado larga.';
          return null;

        default:
          return null;
      }
    }

    return null;
  };

  const validateAll = () => {
    const newErrors = {};

    Object.keys(clinica).forEach((key) => {
      const err = validateField(key, clinica[key], 'clinica');
      if (err) newErrors[key] = err;
    });

    Object.keys(admin).forEach((key) => {
      const err = validateField(key, admin[key], 'admin');
      if (err) newErrors[key] = err;
    });

    return newErrors;
  };

  const setC = (key) => (e) => {
    let value = e.target.value;

    if (key === 'telefono') {
      value = value.replace(/[^0-9+\-\s()]/g, '');
    }

    if (key === 'nit') {
      value = value.replace(/[^0-9a-zA-Z-]/g, '');
    }

    setClinica((p) => ({ ...p, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value, 'clinica'),
      }));
    }
  };

  const setA = (key) => (e) => {
    const value = e.target.value;

    setAdmin((p) => ({ ...p, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: validateField(key, value, 'admin'),
      }));
    }
  };

  const handleBlurClinica = (key) => () => {
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, clinica[key], 'clinica'),
    }));
  };

  const handleBlurAdmin = (key) => () => {
    setErrors((prev) => ({
      ...prev,
      [key]: validateField(key, admin[key], 'admin'),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const validationErrors = validateAll();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setErrorMsg('Revisa los campos obligatorios.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        clinica: {
          nombre: clinica.nombre.trim(),
          telefono: clinica.telefono.trim() || '',
          direccion: clinica.direccion.trim() || '',
          nit: clinica.nit.trim() || '',
          email: clinica.email.trim().toLowerCase() || '',
        },
        admin: {
          nombre_admin: admin.nombre_admin.trim(),
          email_admin: admin.email_admin.trim().toLowerCase(),
          password: admin.password,
        },
      };

      const res = await registerClinicAndAdmin(payload);

      const token = res?.data?.token;
      const user = res?.data?.user;

      if (!token || !user) {
        setErrorMsg('Respuesta inválida del servidor. Falta token o user.');
        return;
      }

      authLogin(user, token);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Ocurrió un error al crear la clínica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Decorative size="140px" top="8%" right="auto" left="6%" duration="6s" delay="0s" rotate="15deg" />
      <Decorative size="100px" top="15%" right="8%" left="auto" duration="8s" delay="1s" rotate="-10deg" />
      <Decorative size="120px" bottom="12%" right="auto" left="10%" duration="7s" delay="2s" rotate="25deg" />
      <Decorative size="90px" bottom="20%" right="6%" left="auto" duration="5s" delay="0.5s" rotate="-20deg" />

      <Card>
        <CardTop>
          <CardTopLeft>
            <Title>Registrar clínica</Title>
            <Subtitle>Crea tu clínica y tu cuenta de administrador para empezar en ANIMA.</Subtitle>
          </CardTopLeft>

          <BackBtn type="button" onClick={() => navigate('/bienvenida')} disabled={loading}>
            ← Volver
          </BackBtn>
        </CardTop>

        <form onSubmit={handleSubmit} noValidate>
          <SectionLabel>
            <SectionLine />
            <SectionText>Datos de la clínica</SectionText>
            <SectionLine />
          </SectionLabel>

          <FieldGrid>
            <FieldWrap delay="0.1s">
              <Label>Nombre *</Label>
              <Input
                value={clinica.nombre}
                onChange={setC('nombre')}
                onBlur={handleBlurClinica('nombre')}
                placeholder="Ej: Clínica Veterinaria Tanuki"
                disabled={loading}
                maxLength={120}
              />
              {errors.nombre && <ErrorText>{errors.nombre}</ErrorText>}
            </FieldWrap>

            <FieldRow>
              <FieldWrap delay="0.15s">
                <Label>Teléfono</Label>
                <Input
                  value={clinica.telefono}
                  onChange={setC('telefono')}
                  onBlur={handleBlurClinica('telefono')}
                  placeholder="Ej: 70707070"
                  type="tel"
                  disabled={loading}
                  maxLength={20}
                />
                {errors.telefono && <ErrorText>{errors.telefono}</ErrorText>}
              </FieldWrap>

              <FieldWrap delay="0.2s">
                <Label>NIT</Label>
                <Input
                  value={clinica.nit}
                  onChange={setC('nit')}
                  onBlur={handleBlurClinica('nit')}
                  placeholder="Opcional"
                  disabled={loading}
                  maxLength={30}
                />
                {errors.nit && <ErrorText>{errors.nit}</ErrorText>}
              </FieldWrap>
            </FieldRow>

            <FieldWrap delay="0.25s">
              <Label>Dirección</Label>
              <Input
                value={clinica.direccion}
                onChange={setC('direccion')}
                onBlur={handleBlurClinica('direccion')}
                placeholder="Ej: Av. América #123, Cochabamba"
                disabled={loading}
                maxLength={180}
              />
              {errors.direccion && <ErrorText>{errors.direccion}</ErrorText>}
            </FieldWrap>

            <FieldWrap delay="0.3s">
              <Label>Correo de la clínica (opcional)</Label>
              <Input
                type="email"
                value={clinica.email}
                onChange={setC('email')}
                onBlur={handleBlurClinica('email')}
                placeholder="clinica@correo.com"
                disabled={loading}
                maxLength={120}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </FieldWrap>
          </FieldGrid>

          <SectionLabel>
            <SectionLine />
            <SectionText>Cuenta administrador</SectionText>
            <SectionLine />
          </SectionLabel>

          <FieldGrid>
            <FieldWrap delay="0.35s">
              <Label>Nombre *</Label>
              <Input
                value={admin.nombre_admin}
                onChange={setA('nombre_admin')}
                onBlur={handleBlurAdmin('nombre_admin')}
                placeholder="Ej: Lucio Montaño"
                disabled={loading}
                maxLength={100}
              />
              {errors.nombre_admin && <ErrorText>{errors.nombre_admin}</ErrorText>}
            </FieldWrap>

            <FieldWrap delay="0.4s">
              <Label>Correo *</Label>
              <Input
                type="email"
                value={admin.email_admin}
                onChange={setA('email_admin')}
                onBlur={handleBlurAdmin('email_admin')}
                placeholder="admin@correo.com"
                disabled={loading}
                maxLength={120}
              />
              {errors.email_admin && <ErrorText>{errors.email_admin}</ErrorText>}
            </FieldWrap>

            <FieldWrap delay="0.45s">
              <Label>Contraseña *</Label>
              <Input
                type="password"
                value={admin.password}
                onChange={setA('password')}
                onBlur={handleBlurAdmin('password')}
                placeholder="Mínimo 8 caracteres"
                disabled={loading}
                maxLength={50}
              />
              {errors.password && <ErrorText>{errors.password}</ErrorText>}
            </FieldWrap>
          </FieldGrid>

          {errorMsg && <ErrorText>⚠️ {errorMsg}</ErrorText>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner /> Creando clínica...
              </>
            ) : (
              'Crear clínica'
            )}
          </SubmitButton>

          <CardFooter>
            <SecondaryButton type="button" onClick={() => navigate('/login')} disabled={loading}>
              ¿Ya tienes cuenta? Iniciar sesión
            </SecondaryButton>
          </CardFooter>
        </form>
      </Card>
    </Container>
  );
}
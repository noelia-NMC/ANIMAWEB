// src/pages/OnboardingClinica.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerClinicAndAdmin } from '../services/onboardingService';
import { useAuth } from '../context/AuthContext';

import {
  Container, Decorative, Card, CardTop, CardTopLeft, Title, Subtitle, BackBtn,
  SectionLabel, SectionLine, SectionText, FieldGrid, FieldRow, FieldWrap, Label,
  Input, SubmitButton, CardFooter, SecondaryButton, ErrorText, LoadingSpinner,
} from '../styles/onboardingStyled';

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

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const setC = (key) => (e) => setClinica((p) => ({ ...p, [key]: e.target.value }));
  const setA = (key) => (e) => setAdmin((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clinica.nombre.trim()) return setErrorMsg('Falta el nombre de la clínica.');
    if (!admin.nombre_admin.trim()) return setErrorMsg('Falta el nombre del administrador.');
    if (!admin.email_admin.trim() || !isValidEmail(admin.email_admin)) return setErrorMsg('El correo del administrador no es válido.');
    if (!admin.password || admin.password.length < 8) return setErrorMsg('La contraseña debe tener mínimo 8 caracteres.');
    if (clinica.email?.trim() && !isValidEmail(clinica.email.trim())) return setErrorMsg('El correo de la clínica no es válido.');

    try {
      setLoading(true);

      // ✅ ahora registerClinicAndAdmin devuelve axios response
      const res = await registerClinicAndAdmin({ clinica, admin });

      const token = res?.data?.token;
      const user = res?.data?.user;

      if (!token || !user) {
        setErrorMsg('Respuesta inválida del servidor. Falta token o user.');
        return;
      }

      // ✅ guardar sesión bien
      authLogin(user, token);

      // ✅ entrar
      navigate('/dashboard');
    } catch (err) {
      // 409 = conflicto (email repetido normalmente)
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
              <Input value={clinica.nombre} onChange={setC('nombre')} placeholder="Ej: Clínica Veterinaria Tanuki" disabled={loading} />
            </FieldWrap>

            <FieldRow>
              <FieldWrap delay="0.15s">
                <Label>Teléfono</Label>
                <Input value={clinica.telefono} onChange={setC('telefono')} placeholder="Ej: 70707070" type="tel" disabled={loading} />
              </FieldWrap>

              <FieldWrap delay="0.2s">
                <Label>NIT</Label>
                <Input value={clinica.nit} onChange={setC('nit')} placeholder="Opcional" disabled={loading} />
              </FieldWrap>
            </FieldRow>

            <FieldWrap delay="0.25s">
              <Label>Dirección</Label>
              <Input value={clinica.direccion} onChange={setC('direccion')} placeholder="Ej: Av. América #123, Cochabamba" disabled={loading} />
            </FieldWrap>

            <FieldWrap delay="0.3s">
              <Label>Correo de la clínica (opcional)</Label>
              <Input type="email" value={clinica.email} onChange={setC('email')} placeholder="clinica@correo.com" disabled={loading} />
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
              <Input value={admin.nombre_admin} onChange={setA('nombre_admin')} placeholder="Ej: Lucio Montaño" disabled={loading} />
            </FieldWrap>

            <FieldWrap delay="0.4s">
              <Label>Correo *</Label>
              <Input type="email" value={admin.email_admin} onChange={setA('email_admin')} placeholder="admin@correo.com" disabled={loading} />
            </FieldWrap>

            <FieldWrap delay="0.45s">
              <Label>Contraseña *</Label>
              <Input type="password" value={admin.password} onChange={setA('password')} placeholder="Mínimo 8 caracteres" disabled={loading} />
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
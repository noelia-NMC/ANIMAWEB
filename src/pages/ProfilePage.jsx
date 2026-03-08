import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import * as userService from '../services/userService';
import * as clinicaService from '../services/clinicaService';

const ProfileContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
const Card = styled.div`
  background: white; border-radius: 12px; padding: 2rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.07);
`;
const CardTitle = styled.h2`
  font-size: 1.2rem; margin: 0 0 1.5rem 0; padding-bottom: 1rem;
  border-bottom: 1px solid #eef2f1;
`;
const Form = styled.form`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const FormGroup = styled.div`
  &.full-width { grid-column: 1 / -1; }
`;
const Label = styled.label`
  display: block; font-weight: 600; font-size: 0.8rem;
  margin-bottom: 0.5rem; color: #2c3e50;
`;
const Input = styled.input`
  width: 100%; padding: 10px 14px; border-radius: 8px;
  border: 1px solid #e0e0e0; font-size: 0.9rem;
  &:focus { outline: none; border-color: #42a8a1; }
`;
const Button = styled.button`
  padding: 10px 22px; border: none; border-radius: 8px; font-size: 0.9rem;
  font-weight: 600; cursor: pointer; transition: all 0.2s ease;
  background-color: #42a8a1; color: white;
  &:hover { background-color: #358a82; }
`;
const FormActions = styled.div`
  grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 12px;
`;
const ErrorMessage = styled.p`color: #e74c3c; font-size: 0.8rem; margin-top: 5px;`;
const Hint = styled.p`
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  font-size: 0.85rem;
`;
const MiniAlert = styled.div`
  grid-column: 1 / -1;
  background: #fff5f5;
  border: 1px solid #ffd1d1;
  color: #b33a3a;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export default function ProfilePage() {
  const { user, updateUser, refreshMe } = useAuth();

  const isAdmin = useMemo(() => {
    const r = String(user?.rol || user?.rol_nombre || '').toLowerCase();
    return r === 'admin';
  }, [user]);

  const [profileData, setProfileData] = useState({ nombre: '', email: '', telefono: '' });
  const [profileErrors, setProfileErrors] = useState({});

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const [clinicaData, setClinicaData] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    nit: '',
    email: '',
  });
  const [clinicaErrors, setClinicaErrors] = useState({});
  const [loadingClinica, setLoadingClinica] = useState(false);
  const [clinicaLoadError, setClinicaLoadError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadClinica = async () => {
      if (!isAdmin) return;

      setClinicaLoadError('');
      setLoadingClinica(true);

      try {
        const res = await clinicaService.getMiClinica();
        const c = res.data?.data || res.data;

        if (!c || !c.id) {
          setClinicaLoadError('No se pudo cargar la clínica (respuesta vacía).');
          return;
        }

        setClinicaData({
          nombre: c.nombre || '',
          telefono: c.telefono || '',
          direccion: c.direccion || '',
          nit: c.nit || '',
          email: c.email || '',
        });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Error cargando clínica';
        console.error('Error getMiClinica:', err?.response?.data || err);
        setClinicaLoadError(msg);
      } finally {
        setLoadingClinica(false);
      }
    };

    loadClinica();
  }, [isAdmin]);

  const validateProfile = () => {
    const e = {};
    if (!profileData.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    else if (profileData.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres.';

    if (!profileData.email.trim()) e.email = 'El correo es obligatorio.';
    else if (!EMAIL_REGEX.test(profileData.email.trim())) e.email = 'Correo inválido.';

    if (profileData.telefono.trim() && !PHONE_REGEX.test(profileData.telefono.trim())) {
      e.telefono = 'Teléfono inválido.';
    }

    return e;
  };

  const validatePassword = () => {
    const e = {};

    if (!passwordData.current_password.trim()) {
      e.current_password = 'La contraseña actual es obligatoria.';
    }

    if (!passwordData.new_password.trim()) {
      e.new_password = 'La nueva contraseña es obligatoria.';
    } else if (passwordData.new_password.length < 8) {
      e.new_password = 'Debe tener al menos 8 caracteres.';
    }

    if (!passwordData.confirm_password.trim()) {
      e.confirm_password = 'Debes confirmar la nueva contraseña.';
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      e.confirm_password = 'Las contraseñas no coinciden.';
    }

    return e;
  };

  const validateClinica = () => {
    const e = {};

    if (!clinicaData.nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    else if (clinicaData.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres.';

    if (clinicaData.telefono.trim() && !PHONE_REGEX.test(clinicaData.telefono.trim())) {
      e.telefono = 'Teléfono inválido.';
    }

    if (clinicaData.direccion.trim() && clinicaData.direccion.trim().length < 5) {
      e.direccion = 'La dirección es muy corta.';
    }

    if (clinicaData.email.trim() && !EMAIL_REGEX.test(clinicaData.email.trim())) {
      e.email = 'Correo inválido.';
    }

    return e;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) setProfileErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleClinicaChange = (e) => {
    const { name, value } = e.target;
    setClinicaData((prev) => ({ ...prev, [name]: value }));
    if (clinicaErrors[name]) setClinicaErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const errs = validateProfile();
    if (Object.keys(errs).length) {
      setProfileErrors(errs);
      return;
    }

    try {
      const payload = {
        nombre: profileData.nombre.trim(),
        email: profileData.email.trim().toLowerCase(),
        telefono: profileData.telefono.trim(),
      };

      const res = await userService.updateProfile(payload);
      const updated = res.data?.user || res.data;
      updateUser(updated);

      if (typeof refreshMe === 'function') {
        await refreshMe();
      }

      alert('Perfil actualizado correctamente.');
      setProfileErrors({});
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setProfileErrors(err.response?.data?.errors || {});
      alert(err.response?.data?.message || 'Error al actualizar el perfil.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const errs = validatePassword();
    if (Object.keys(errs).length) {
      setPasswordErrors(errs);
      return;
    }

    try {
      await userService.changePassword(passwordData);
      alert('Contraseña cambiada correctamente.');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setPasswordErrors({});
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setPasswordErrors(err.response?.data?.errors || {});
      alert(err.response?.data?.message || 'Error al cambiar la contraseña.');
    }
  };

  const handleClinicaSubmit = async (e) => {
    e.preventDefault();

    const errs = validateClinica();
    if (Object.keys(errs).length) {
      setClinicaErrors(errs);
      return;
    }

    try {
      const payload = {
        nombre: (clinicaData.nombre || '').trim(),
        telefono: (clinicaData.telefono || '').trim(),
        direccion: (clinicaData.direccion || '').trim(),
        nit: (clinicaData.nit || '').trim(),
        email: (clinicaData.email || '').trim().toLowerCase(),
      };

      const res = await clinicaService.updateMiClinica(payload);
      const c = res.data?.data || res.data;

      setClinicaData({
        nombre: c?.nombre ?? payload.nombre,
        telefono: c?.telefono ?? payload.telefono,
        direccion: c?.direccion ?? payload.direccion,
        nit: c?.nit ?? payload.nit,
        email: c?.email ?? payload.email,
      });

      setClinicaErrors({});
      alert('Clínica actualizada correctamente.');
    } catch (err) {
      console.error('Error al actualizar clínica:', err);
      setClinicaErrors(err.response?.data?.errors || {});
      alert(err.response?.data?.message || 'Error al actualizar la clínica.');
    }
  };

  return (
    <ProfileContainer>
      <Card>
        <CardTitle>Editar perfil</CardTitle>
        <Form onSubmit={handleProfileSubmit} noValidate>
          <FormGroup>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Nombre completo"
              value={profileData.nombre}
              onChange={handleProfileChange}
              maxLength={100}
            />
            {profileErrors.nombre && <ErrorMessage>{profileErrors.nombre}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={profileData.email}
              onChange={handleProfileChange}
              maxLength={120}
            />
            {profileErrors.email && <ErrorMessage>{profileErrors.email}</ErrorMessage>}
          </FormGroup>

          <FormGroup className="full-width">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="Ej: 70707070"
              value={profileData.telefono}
              onChange={handleProfileChange}
              maxLength={20}
            />
            {profileErrors.telefono && <ErrorMessage>{profileErrors.telefono}</ErrorMessage>}
          </FormGroup>

          <FormActions>
            <Button type="submit">Guardar cambios</Button>
          </FormActions>
        </Form>
      </Card>

      <Card>
        <CardTitle>Cambiar contraseña</CardTitle>
        <Form onSubmit={handlePasswordSubmit} noValidate>
          <FormGroup className="full-width">
            <Label htmlFor="current_password">Contraseña actual</Label>
            <Input
              id="current_password"
              name="current_password"
              type="password"
              placeholder="Contraseña actual"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
            />
            {passwordErrors.current_password && <ErrorMessage>{passwordErrors.current_password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="new_password">Nueva contraseña</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
            />
            {passwordErrors.new_password && <ErrorMessage>{passwordErrors.new_password}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="confirm_password">Confirmar nueva contraseña</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              placeholder="Repite la nueva contraseña"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
            />
            {passwordErrors.confirm_password && <ErrorMessage>{passwordErrors.confirm_password}</ErrorMessage>}
          </FormGroup>

          <FormActions>
            <Button type="submit">Cambiar contraseña</Button>
          </FormActions>
        </Form>
      </Card>

      {isAdmin && (
        <Card>
          <CardTitle>Editar clínica</CardTitle>

          <Hint>
            Solo el <b>administrador</b> puede editar los datos de la clínica.
          </Hint>

          {clinicaLoadError && (
            <MiniAlert>
              {clinicaLoadError}
              <div style={{ marginTop: 6, color: '#7f8c8d' }}>
                Tip: revisa la consola del backend, casi siempre es un “nombre de columna” incorrecto.
              </div>
            </MiniAlert>
          )}

          {loadingClinica ? (
            <p style={{ color: '#7f8c8d' }}>Cargando clínica...</p>
          ) : (
            <Form onSubmit={handleClinicaSubmit} noValidate>
              <FormGroup>
                <Label htmlFor="clinica_nombre">Nombre</Label>
                <Input
                  id="clinica_nombre"
                  name="nombre"
                  placeholder="Nombre de la clínica"
                  value={clinicaData.nombre}
                  onChange={handleClinicaChange}
                  maxLength={120}
                />
                {clinicaErrors.nombre && <ErrorMessage>{clinicaErrors.nombre}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="clinica_telefono">Teléfono</Label>
                <Input
                  id="clinica_telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={clinicaData.telefono}
                  onChange={handleClinicaChange}
                  maxLength={20}
                />
                {clinicaErrors.telefono && <ErrorMessage>{clinicaErrors.telefono}</ErrorMessage>}
              </FormGroup>

              <FormGroup className="full-width">
                <Label htmlFor="clinica_direccion">Dirección</Label>
                <Input
                  id="clinica_direccion"
                  name="direccion"
                  placeholder="Dirección"
                  value={clinicaData.direccion}
                  onChange={handleClinicaChange}
                  maxLength={180}
                />
                {clinicaErrors.direccion && <ErrorMessage>{clinicaErrors.direccion}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="clinica_nit">NIT</Label>
                <Input
                  id="clinica_nit"
                  name="nit"
                  placeholder="NIT"
                  value={clinicaData.nit}
                  onChange={handleClinicaChange}
                  maxLength={30}
                />
                {clinicaErrors.nit && <ErrorMessage>{clinicaErrors.nit}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="clinica_email">Email de la clínica</Label>
                <Input
                  id="clinica_email"
                  name="email"
                  type="email"
                  placeholder="clinica@correo.com"
                  value={clinicaData.email}
                  onChange={handleClinicaChange}
                  maxLength={120}
                />
                {clinicaErrors.email && <ErrorMessage>{clinicaErrors.email}</ErrorMessage>}
              </FormGroup>

              <FormActions>
                <Button type="submit">Guardar clínica</Button>
              </FormActions>
            </Form>
          )}
        </Card>
      )}
    </ProfileContainer>
  );
}
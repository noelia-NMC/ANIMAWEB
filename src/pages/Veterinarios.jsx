import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

import {
  obtenerVeterinarios,
  registrarVeterinario,
  actualizarVeterinario,
  eliminarVeterinario,
} from '../services/veterinarios';

import { getAllRoles } from '../services/rolesService';

import {
  PageGridContainer, PageTitle, FormCard, ListCard, FormGrid, FormGroup, FormActions,
  Input, Select, SubmitButton, CancelButton, RightColumn, SearchSection,
  SectionTitle, SearchInput, CrudList, CrudCard, CardHeader, CardTitle,
  CardInfo, InfoGrid, InfoRow, Label, Value, ButtonGroup, EditButton,
  DeleteButton, EmptyState, ErrorMessage
} from '../styles/crudStyles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;

export default function Veterinarios() {
  const { hasPermission } = useAuth();

  const canRead = hasPermission('veterinarios:read');
  const canCreate = hasPermission('veterinarios:create');
  const canUpdate = hasPermission('veterinarios:update');
  const canDelete = hasPermission('veterinarios:delete');

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    password: '',
    rol_id: '',
  });

  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarRoles = useCallback(async () => {
    try {
      const res = await getAllRoles();
      const list = (res.data || [])
        .filter((r) => String(r.nombre).toLowerCase() !== 'dueño' && String(r.nombre).toLowerCase() !== 'dueno')
        .map((r) => ({ id: r.id, nombre: r.nombre }));

      setRoles(list);

      setFormData((p) => ({
        ...p,
        rol_id: p.rol_id || (list[0]?.id ? String(list[0].id) : ''),
      }));
    } catch (e) {
      console.error('Error cargando roles:', e);
      setRoles([]);
    }
  }, []);

  const cargarUsuarios = useCallback(async () => {
    if (!canRead) return;
    try {
      const res = await obtenerVeterinarios();
      setUsuarios(res.data || []);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  }, [canRead]);

  useEffect(() => {
    cargarRoles();
    cargarUsuarios();
  }, [cargarRoles, cargarUsuarios]);

  const validateField = (name, value, currentData = formData) => {
    const val = String(value ?? '').trim();

    switch (name) {
      case 'nombre':
        if (!val) return 'El nombre es obligatorio.';
        if (val.length < 3) return 'Mínimo 3 caracteres.';
        if (val.length > 80) return 'Nombre demasiado largo.';
        return null;

      case 'apellido':
        if (!val) return null;
        if (val.length < 2) return 'Apellido muy corto.';
        if (val.length > 80) return 'Apellido demasiado largo.';
        return null;

      case 'especialidad':
        if (!val) return null;
        if (val.length < 3) return 'Especialidad muy corta.';
        if (val.length > 100) return 'Especialidad demasiado larga.';
        return null;

      case 'telefono':
        if (!val) return null;
        if (!PHONE_REGEX.test(val)) return 'Formato de teléfono inválido.';
        return null;

      case 'email':
        if (!val) return 'El correo es obligatorio.';
        if (!EMAIL_REGEX.test(val)) return 'El formato del correo es inválido.';
        return null;

      case 'password':
        if (!modoEdicion && !currentData.password) return 'La contraseña es obligatoria.';
        if (currentData.password && currentData.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
        if (currentData.password && currentData.password.length > 50) return 'La contraseña es demasiado larga.';
        return null;

      case 'rol_id':
        if (!currentData.rol_id) return 'Debe seleccionar un rol.';
        return null;

      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    ['nombre', 'apellido', 'especialidad', 'telefono', 'email', 'password', 'rol_id'].forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;

    if (name === 'telefono') {
      cleanedValue = value.replace(/[^0-9+\-\s()]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: cleanedValue }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, cleanedValue, { ...formData, [name]: cleanedValue })
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value, formData)
    }));
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setUsuarioId(null);
    setFormData({
      nombre: '',
      apellido: '',
      especialidad: '',
      telefono: '',
      email: '',
      password: '',
      rol_id: roles[0]?.id ? String(roles[0].id) : '',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modoEdicion && !canUpdate) return;
    if (!modoEdicion && !canCreate) return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dataToSend = {
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      especialidad: formData.especialidad.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim().toLowerCase(),
      rol_id: Number(formData.rol_id),
      ...(formData.password ? { password: formData.password } : {}),
    };

    try {
      if (modoEdicion && usuarioId) {
        await actualizarVeterinario(usuarioId, dataToSend);
        alert('Usuario actualizado correctamente.');
      } else {
        await registrarVeterinario(dataToSend);
        alert('Usuario registrado correctamente.');
      }

      cancelarEdicion();
      cargarUsuarios();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Error al guardar el usuario.');
    }
  };

  const eliminar = async (id) => {
    if (!canDelete) return;
    if (window.confirm('¿Desea eliminar este usuario de forma permanente?')) {
      try {
        await eliminarVeterinario(id);
        cargarUsuarios();
        alert('Usuario eliminado correctamente.');
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
        alert(err.response?.data?.message || err.response?.data?.error || 'Error al eliminar el usuario.');
      }
    }
  };

  const editar = (u) => {
    if (!canUpdate) return;
    setModoEdicion(true);
    setUsuarioId(u.id);

    setFormData({
      nombre: u.nombre || '',
      apellido: u.apellido || '',
      especialidad: u.especialidad || '',
      telefono: u.telefono || '',
      email: u.email || '',
      password: '',
      rol_id: String(u.rol_id || ''),
    });

    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const usuariosFiltrados = usuarios.filter(u => {
    const q = busqueda.toLowerCase();
    return (
      (u.nombre || '').toLowerCase().includes(q) ||
      (u.especialidad || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.rol_nombre || '').toLowerCase().includes(q)
    );
  });

  if (!canRead) {
    return (
      <PageGridContainer>
        <PageTitle>Usuarios</PageTitle>
        <EmptyState icon="⛔">No tienes permiso para ver usuarios.</EmptyState>
      </PageGridContainer>
    );
  }

  return (
    <PageGridContainer>
      <PageTitle>Gestión de usuarios</PageTitle>

      <FormCard>
        <SectionTitle>{modoEdicion ? 'Editar usuario' : 'Registrar nuevo usuario'}</SectionTitle>

        <FormGrid onSubmit={handleSubmit} noValidate>
          <FormGroup>
            <Input
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={80}
            />
            <ErrorMessage>{errors.nombre}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="apellido"
              placeholder="Apellido (opcional)"
              value={formData.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={80}
            />
            <ErrorMessage>{errors.apellido}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="especialidad"
              placeholder="Especialidad / Área (opcional)"
              value={formData.especialidad}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={100}
            />
            <ErrorMessage>{errors.especialidad}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="telefono"
              type="tel"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={20}
            />
            <ErrorMessage>{errors.telefono}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={120}
            />
            <ErrorMessage>{errors.email}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="password"
              type="password"
              placeholder={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={50}
            />
            <ErrorMessage>{errors.password}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Select
              name="rol_id"
              value={formData.rol_id}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {roles.length ? (
                roles.map((r) => (
                  <option key={r.id} value={String(r.id)}>
                    {r.nombre}
                  </option>
                ))
              ) : (
                <option value="">(No se pudieron cargar roles)</option>
              )}
            </Select>
            <ErrorMessage>{errors.rol_id}</ErrorMessage>
          </FormGroup>

          <FormActions>
            {modoEdicion && <CancelButton type="button" onClick={cancelarEdicion}>Cancelar</CancelButton>}

            <SubmitButton type="submit" disabled={modoEdicion ? !canUpdate : !canCreate}>
              {modoEdicion ? 'Actualizar' : 'Registrar'}
            </SubmitButton>
          </FormActions>
        </FormGrid>
      </FormCard>

      <RightColumn>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Buscar por nombre, email, rol..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </SearchSection>

        <ListCard>
          <SectionTitle>Listado de usuarios</SectionTitle>
          <CrudList>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map(u => (
                <CrudCard key={u.id}>
                  <CardHeader>
                    <CardTitle>👤 {u.nombre} {u.apellido || ''}</CardTitle>
                    <CardInfo>{u.especialidad || '—'}</CardInfo>
                  </CardHeader>

                  <InfoGrid>
                    <InfoRow><Label>Teléfono</Label><Value>{u.telefono || '—'}</Value></InfoRow>
                    <InfoRow><Label>Email</Label><Value style={{ textTransform: 'none' }}>{u.email}</Value></InfoRow>
                    <InfoRow><Label>Rol</Label><Value>{u.rol_nombre || u.rol || u.rol_id}</Value></InfoRow>
                  </InfoGrid>

                  <ButtonGroup>
                    <EditButton onClick={() => editar(u)} disabled={!canUpdate}>Editar</EditButton>
                    <DeleteButton onClick={() => eliminar(u.id)} disabled={!canDelete}>Eliminar</DeleteButton>
                  </ButtonGroup>
                </CrudCard>
              ))
            ) : (
              <EmptyState icon="👤">No se encontraron usuarios.</EmptyState>
            )}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
// src/pages/Veterinarios.js
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
      // OJO: esto pega a GET /roles (requiere roles:read)
      // Si tu veterinario no tiene roles:read, dale ese permiso o te hago un endpoint “roles/select”.
      const res = await getAllRoles();
      const list = (res.data || [])
        .filter((r) => String(r.nombre).toLowerCase() !== 'dueño' && String(r.nombre).toLowerCase() !== 'dueno')
        .map((r) => ({ id: r.id, nombre: r.nombre }));
      setRoles(list);

      // set default rol si no hay
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

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,15}$/;

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3) newErrors.nombre = 'El nombre es obligatorio (mín. 3 caracteres).';
    if (formData.telefono.trim() && !phoneRegex.test(formData.telefono.trim())) newErrors.telefono = 'Formato de teléfono inválido.';
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'El formato del correo es inválido.';

    if (!modoEdicion && (!formData.password || formData.password.length < 8)) newErrors.password = 'La contraseña es obligatoria (mín. 8 caracteres).';
    if (modoEdicion && formData.password && formData.password.length < 8) newErrors.password = 'La nueva contraseña debe tener al menos 8 caracteres.';

    if (!formData.rol_id) newErrors.rol_id = 'Debe seleccionar un rol.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
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
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    const dataToSend = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      especialidad: formData.especialidad,
      telefono: formData.telefono,
      email: formData.email,
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
            <Input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
            <ErrorMessage>{errors.nombre}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input name="apellido" placeholder="Apellido (opcional)" value={formData.apellido} onChange={handleChange} />
            <ErrorMessage>{errors.apellido}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input name="especialidad" placeholder="Especialidad / Área (opcional)" value={formData.especialidad} onChange={handleChange} />
            <ErrorMessage>{errors.especialidad}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input name="telefono" type="tel" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
            <ErrorMessage>{errors.telefono}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input name="email" type="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} />
            <ErrorMessage>{errors.email}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="password"
              type="password"
              placeholder={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña'}
              value={formData.password}
              onChange={handleChange}
            />
            <ErrorMessage>{errors.password}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Select name="rol_id" value={formData.rol_id} onChange={handleChange}>
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
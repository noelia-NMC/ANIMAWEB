// src/pages/Roles.jsx ✅ COMPLETO (MISMO rolesStyles.js, SIN CAMBIAR ESTILOS)
// - Se puede editar permisos incluso en roles GLOBAL
// - Solo se protege admin para no romper
// - Buscador arriba usando Input existente (no se agrega CSS nuevo)

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as RoleService from '../services/rolesService';
import { useAuth } from '../context/AuthContext';

import {
  PageContainer,
  HeaderRow,
  PageTitle,
  AddButton,
  RolesGrid,
  RolCard,
  RolHeader,
  RolTitle,
  RolDescription,
  RolActions,
  ActionButton,
  PermisosContainer,
  PermissionGroup,
  GroupTitle,
  PermisoCheckbox,
  CheckboxGrid,
  CardFooter,
  SaveButton,
  LoadingState,
  ErrorState,
  ModalOverlay,
  ModalContent,
  ModalTitle,
  Input,
  TextArea,
  ModalActions,
  CancelButton,
} from '../styles/rolesStyles';

export default function Roles() {
  const { user } = useAuth();

  // Hooks
  const [roles, setRoles] = useState([]);
  const [allPermisos, setAllPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRol, setCurrentRol] = useState({ id: null, nombre: '', descripcion: '' });

  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [rolesRes, permisosRes] = await Promise.all([
        RoleService.getAllRoles(),
        RoleService.getAllPermisos(),
      ]);

      const rolesData = (rolesRes.data || []).map((rol) => ({
        ...rol,
        permisos: new Set((rol.permisos || []).map((p) => p.id)),
      }));

      setRoles(rolesData);
      setAllPermisos(permisosRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar datos. Verifique su conexión y permisos de administrador.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.rol === 'admin') fetchData();
    else setLoading(false);
  }, [fetchData, user]);

  // Agrupar permisos por módulo (dashboard, turnos, etc)
  const groupedPermisos = useMemo(() => {
    return (allPermisos || []).reduce((acc, permiso) => {
      const group = (permiso.nombre || 'otros').split(':')[0];
      if (!acc[group]) acc[group] = [];
      acc[group].push(permiso);
      return acc;
    }, {});
  }, [allPermisos]);

  // Buscar roles
  const filteredRoles = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return roles;

    return roles.filter((rol) => {
      const n = String(rol.nombre || '').toLowerCase();
      const d = String(rol.descripcion || '').toLowerCase();
      return n.includes(q) || d.includes(q);
    });
  }, [roles, search]);

  // Early returns (después de hooks)
  if (!user) {
    return (
      <ErrorState>
        <h2>No autenticado</h2>
        <p>Inicia sesión para continuar.</p>
      </ErrorState>
    );
  }

  if (user.rol !== 'admin') {
    return (
      <ErrorState>
        <h2>403: Acceso denegado</h2>
        <p>Solo el administrador puede gestionar roles y permisos.</p>
      </ErrorState>
    );
  }

  if (loading) return <LoadingState><h2>Cargando...</h2></LoadingState>;
  if (error) return <ErrorState><h2>{error}</h2></ErrorState>;

  // Helpers UI
  const actionOrder = ['create', 'read', 'update', 'delete', 'admin'];
  const isAdminRole = (rol) => String(rol?.nombre || '').toLowerCase() === 'admin';
  const isGlobalRole = (rol) => rol?.clinica_id === null || rol?.clinica_id === undefined;

  // Handlers
  const handleOpenModal = (rol = null) => {
    if (rol) {
      setIsEditing(true);
      setCurrentRol({
        id: rol.id,
        nombre: rol.nombre || '',
        descripcion: rol.descripcion || '',
      });
    } else {
      setIsEditing(false);
      setCurrentRol({ id: null, nombre: '', descripcion: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => setModalOpen(false);

  const handleModalSave = async () => {
    try {
      const nombre = (currentRol.nombre || '').trim().toLowerCase();
      const descripcion = (currentRol.descripcion || '').trim();

      if (!nombre || !descripcion) {
        alert('El nombre y la descripción son obligatorios.');
        return;
      }

      if (isEditing) {
        // solo update descripcion (nombre bloqueado)
        await RoleService.updateRol(currentRol.id, { descripcion });
        alert('Rol actualizado correctamente.');
      } else {
        await RoleService.createRol({ nombre, descripcion });
        alert('Rol creado exitosamente.');
      }

      await fetchData();
      handleCloseModal();
    } catch (err) {
      alert(`Error al guardar el rol: ${err?.response?.data?.message || 'Error desconocido'}`);
    }
  };

  const handleDeleteRol = async (rolId, rolNombre) => {
    const ok = window.confirm(
      `¿Está seguro de que quiere eliminar el rol "${rolNombre}"?\n\nEsta acción no se puede deshacer y fallará si algún usuario tiene este rol asignado.`
    );
    if (!ok) return;

    try {
      await RoleService.deleteRol(rolId);
      alert('Rol eliminado correctamente.');
      fetchData();
    } catch (err) {
      alert(`Error al eliminar: ${err?.response?.data?.message || 'Error desconocido'}`);
    }
  };

  const handlePermisoChange = (rolId, permisoId) => {
    setRoles((prev) =>
      prev.map((rol) => {
        if (rol.id !== rolId) return rol;

        const newPermisos = new Set(rol.permisos);
        if (newPermisos.has(permisoId)) newPermisos.delete(permisoId);
        else newPermisos.add(permisoId);

        return { ...rol, permisos: newPermisos };
      })
    );
  };

  const handleSavePermisos = async (rol) => {
    try {
      const permisosIds = Array.from(rol.permisos);

      // ✅ IMPORTANTE: ahora SIEMPRE se puede editar permisos (global o clínica)
      // Solo bloqueamos admin
      if (isAdminRole(rol)) {
        alert('El rol admin no se edita aquí.');
        return;
      }

      await RoleService.updateRolPermisos(rol.id, permisosIds);
      alert(`Permisos para el rol "${rol.nombre}" actualizados exitosamente.`);
      fetchData();
    } catch (err) {
      alert(`Error al guardar permisos: ${err?.response?.data?.message || 'Error desconocido'}`);
    }
  };

  // Render
  return (
    <PageContainer>
      <HeaderRow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PageTitle>Gestión de roles y permisos</PageTitle>

          {/* ✅ Sin estilos nuevos: usamos Input existente */}
          <Input
            type="text"
            placeholder="Buscar rol (nombre o descripción)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 420 }}
          />
        </div>

        <AddButton onClick={() => handleOpenModal()}>+ Añadir rol</AddButton>
      </HeaderRow>

      <RolesGrid>
        {filteredRoles.map((rol) => {
          const global = isGlobalRole(rol);
          const admin = isAdminRole(rol);

          return (
            <RolCard key={rol.id}>
              <RolHeader>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <RolTitle style={{ marginBottom: 0 }}>{rol.nombre}</RolTitle>

                    {/* ✅ Etiqueta simple sin tocar estilos */}
                    <span
                      style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        borderRadius: 999,
                        border: '1px solid #eef2f1',
                        background: '#f8f9fa',
                        color: '#7f8c8d',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                      title={global ? 'Rol global del sistema' : `Rol de clínica ${rol.clinica_id}`}
                    >
                      {global ? 'GLOBAL' : 'CLÍNICA'}
                    </span>

                    {/* contador simple */}
                    <span style={{ fontSize: 12, color: '#7f8c8d' }}>
                      ({rol?.permisos?.size ?? 0} permisos)
                    </span>
                  </div>

                  <RolDescription style={{ marginTop: 8 }}>{rol.descripcion}</RolDescription>
                </div>

                <RolActions>
                  <ActionButton
                    onClick={() => handleOpenModal(rol)}
                    title="Editar rol"
                    disabled={admin}
                  >
                    ✏️
                  </ActionButton>

                  <ActionButton
                    onClick={() => handleDeleteRol(rol.id, rol.nombre)}
                    title="Eliminar rol"
                    disabled={admin}
                  >
                    🗑️
                  </ActionButton>
                </RolActions>
              </RolHeader>

              <PermisosContainer>
                {Object.keys(groupedPermisos)
                  .sort()
                  .map((groupName) => (
                    <PermissionGroup key={groupName}>
                      <GroupTitle>{groupName}</GroupTitle>

                      <CheckboxGrid>
                        {groupedPermisos[groupName]
                          .slice()
                          .sort((a, b) => {
                            const aa = (a.nombre || '').split(':')[1] || '';
                            const bb = (b.nombre || '').split(':')[1] || '';
                            return actionOrder.indexOf(aa) - actionOrder.indexOf(bb);
                          })
                          .map((permiso) => {
                            const label = (permiso.nombre || '').split(':')[1] || permiso.nombre;

                            return (
                              <PermisoCheckbox key={permiso.id}>
                                <input
                                  type="checkbox"
                                  id={`permiso-${rol.id}-${permiso.id}`}
                                  checked={rol.permisos.has(permiso.id)}
                                  onChange={() => handlePermisoChange(rol.id, permiso.id)}
                                  disabled={admin}
                                />
                                <label htmlFor={`permiso-${rol.id}-${permiso.id}`}>{label}</label>
                              </PermisoCheckbox>
                            );
                          })}
                      </CheckboxGrid>
                    </PermissionGroup>
                  ))}
              </PermisosContainer>

              <CardFooter>
                <SaveButton onClick={() => handleSavePermisos(rol)} disabled={admin}>
                  Guardar permisos
                </SaveButton>
              </CardFooter>
            </RolCard>
          );
        })}
      </RolesGrid>

      {modalOpen && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{isEditing ? 'Editar rol' : 'Crear nuevo rol'}</ModalTitle>

            <Input
              type="text"
              placeholder="Nombre del rol (ej: inventario)"
              value={currentRol.nombre}
              onChange={(e) =>
                setCurrentRol((prev) => ({ ...prev, nombre: e.target.value.toLowerCase() }))
              }
              disabled={isEditing}
            />

            <TextArea
              placeholder="Descripción del rol"
              value={currentRol.descripcion}
              onChange={(e) =>
                setCurrentRol((prev) => ({ ...prev, descripcion: e.target.value }))
              }
            />

            <ModalActions>
              <CancelButton onClick={handleCloseModal}>Cancelar</CancelButton>
              <SaveButton onClick={handleModalSave}>
                {isEditing ? 'Guardar cambios' : 'Crear rol'}
              </SaveButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}
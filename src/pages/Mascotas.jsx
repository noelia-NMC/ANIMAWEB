import { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';

import {
  obtenerMascotas,
  registrarMascota,
  actualizarMascota,
  eliminarMascota,
} from '../services/mascotas';

import { obtenerClientes } from '../services/clientes';

import {
  PageGridContainer,
  PageTitle,
  ListCard,
  RightColumn,
  SearchSection,
  SectionTitle,
  SearchInput,
  CrudList,
  CrudCard,
  CardHeader,
  CardTitle,
  CardInfo,
  InfoGrid,
  InfoRow,
  Label,
  Value,
  ButtonGroup,
  EditButton,
  DeleteButton,
  EmptyState,
} from '../styles/crudStyles';

const colors = {
  primary: '#42a8a1',
  primaryDark: '#358a82',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  lightGray: '#e0e0e0',
  border: '#eef2f1',
};

const FormCardLocal = styled.div`
  grid-row: 2;
  grid-column: 1;
  background: ${colors.white};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.05);
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  height: calc(100vh - 190px);
  min-height: 540px;
  overflow: hidden;

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
    height: 75vh;
    min-height: 460px;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-bottom: 0.65rem;
  margin-bottom: 0.9rem;
  border-bottom: 1px solid ${colors.border};
`;

const LocalTitle = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 1.05rem;
  font-weight: 600;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const Btn = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover { transform: translateY(-2px); }
  &:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`;

const SubmitLocal = styled(Btn)`
  background: ${colors.primary};
  color: ${colors.white};
  &:hover { background: ${colors.primaryDark}; }
`;

const CancelLocal = styled(Btn)`
  background: ${colors.lightGray};
  color: ${colors.textPrimary};
  &:hover { background: #d1d1d1; }
`;

const FormLocal = styled.form`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

const FormBodyScroll = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
  padding-bottom: 10px;
`;

const Field = styled.div`
  margin-bottom: 0.55rem;
`;

const baseInput = `
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${colors.lightGray};
  border-radius: 10px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(66, 168, 161, 0.18);
  }
`;

const InputLocal = styled.input`${baseInput}`;
const SelectLocal = styled.select`${baseInput}`;

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 0.78rem;
  font-weight: 600;
  margin-top: 4px;
  line-height: 1.2;
  min-height: 1rem;
`;

const Hint = styled.div`
  font-size: 0.82rem;
  color: ${colors.textSecondary};
  margin-top: 6px;
  line-height: 1.3;
`;

export default function Mascotas() {
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    genero: '',
    cliente_id: '',
    collar_id: '',
  });

  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [saving, setSaving] = useState(false);

  const cargarTodo = useCallback(async () => {
    try {
      const [mRes, cRes] = await Promise.all([obtenerMascotas(), obtenerClientes()]);
      setMascotas(Array.isArray(mRes.data) ? mRes.data : []);
      setClientes(Array.isArray(cRes.data) ? cRes.data : []);
    } catch (err) {
      console.error('Error cargando mascotas/clientes:', err);
      setMascotas([]);
      setClientes([]);
    }
  }, []);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  const clienteSeleccionado = useMemo(() => {
    const id = Number(formData.cliente_id);
    if (!id) return null;
    return clientes.find((c) => Number(c.id) === id) || null;
  }, [formData.cliente_id, clientes]);

  const esClienteFijo = useMemo(() => {
    return String(clienteSeleccionado?.tipo_cliente || '').toUpperCase() === 'FIJO';
  }, [clienteSeleccionado]);

  useEffect(() => {
    if (!esClienteFijo && formData.collar_id) {
      setFormData((p) => ({ ...p, collar_id: '' }));
      setErrors((p) => ({ ...p, collar_id: null }));
    }
  }, [esClienteFijo, formData.collar_id]);

  const validateField = (name, value, currentData = formData) => {
    const val = String(value ?? '').trim();
    const edadNum = Number(currentData.edad);

    switch (name) {
      case 'nombre':
        if (!val) return 'El nombre es obligatorio.';
        if (val.length < 2) return 'Debe tener al menos 2 caracteres.';
        if (val.length > 100) return 'El nombre es demasiado largo.';
        return null;

      case 'cliente_id':
        if (!currentData.cliente_id) return 'Debe seleccionar un cliente.';
        return null;

      case 'especie':
        if (!val) return 'La especie es obligatoria.';
        if (val.length < 2) return 'La especie es demasiado corta.';
        if (val.length > 60) return 'La especie es demasiado larga.';
        return null;

      case 'raza':
        if (!val) return 'La raza es obligatoria.';
        if (val.length < 2) return 'La raza es demasiado corta.';
        if (val.length > 80) return 'La raza es demasiado larga.';
        return null;

      case 'edad':
        if (!currentData.edad && currentData.edad !== 0) return 'La edad es obligatoria.';
        if (Number.isNaN(edadNum) || edadNum <= 0) return 'La edad debe ser un número positivo.';
        if (edadNum > 40) return 'La edad parece inválida.';
        return null;

      case 'genero':
        if (!currentData.genero) return 'Debe seleccionar un género.';
        return null;

      case 'collar_id':
        if (!esClienteFijo) return null;
        if (!val) return null;
        if (val.length < 5) return 'ID de collar muy corto.';
        if (val.length > 50) return 'ID de collar demasiado largo.';
        return null;

      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    ['nombre', 'cliente_id', 'especie', 'raza', 'edad', 'genero', 'collar_id'].forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;

    if (name === 'edad') {
      cleanedValue = value.replace(/[^0-9]/g, '');
    }

    if (name === 'collar_id') {
      cleanedValue = value.replace(/[^a-zA-Z0-9-]/g, '');
    }

    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));

    if (errors[name]) {
      const error = validateField(name, cleanedValue, { ...formData, [name]: cleanedValue });
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      genero: '',
      cliente_id: '',
      collar_id: '',
    });
    setErrors({});
    setModoEdicion(false);
    setIdActual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre.trim(),
        especie: formData.especie.trim(),
        raza: formData.raza.trim(),
        edad: Number(formData.edad),
        genero: formData.genero,
        cliente_id: Number(formData.cliente_id),
        collar_id: esClienteFijo ? (formData.collar_id || '').trim() : null,
      };

      if (modoEdicion) {
        await actualizarMascota(idActual, payload);
        alert('Mascota actualizada correctamente.');
      } else {
        await registrarMascota(payload);
        alert('Mascota registrada correctamente.');
      }

      limpiarFormulario();
      await cargarTodo();
    } catch (err) {
      console.error('Error al guardar mascota:', err);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al guardar la mascota.';

      if (err.response?.status === 409) {
        setErrors((p) => ({ ...p, collar_id: msg }));
      }

      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (m) => {
    setModoEdicion(true);
    setIdActual(m.id);

    setFormData({
      nombre: m.nombre ?? '',
      especie: m.especie ?? '',
      raza: m.raza ?? '',
      edad: m.edad ?? '',
      genero: m.genero ?? '',
      cliente_id: m.cliente_id ?? '',
      collar_id: m.collar_id ?? '',
    });

    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta mascota?')) return;

    try {
      await eliminarMascota(id);
      alert('Mascota eliminada correctamente.');
      await cargarTodo();
    } catch (err) {
      console.error('Error al eliminar mascota:', err);
      alert(err.response?.data?.error || err.response?.data?.message || 'Error al eliminar la mascota.');
    }
  };

  const mascotasFiltradas = useMemo(() => {
    const q = (busqueda || '').toLowerCase().trim();
    if (!q) return mascotas;

    return mascotas.filter((m) => {
      const nombre = (m.nombre || '').toLowerCase();
      const propietario = (m.propietario_nombre || '').toLowerCase();
      const especie = (m.especie || '').toLowerCase();
      const collar = (m.collar_id || '').toLowerCase();
      return nombre.includes(q) || propietario.includes(q) || especie.includes(q) || collar.includes(q);
    });
  }, [mascotas, busqueda]);

  return (
    <PageGridContainer>
      <PageTitle>Gestión de mascotas</PageTitle>

      <FormCardLocal>
        <HeaderRow>
          <LocalTitle>{modoEdicion ? 'Editar mascota' : 'Registrar nueva mascota'}</LocalTitle>

          <ActionsRow>
            {modoEdicion && (
              <CancelLocal type="button" onClick={limpiarFormulario} disabled={saving}>
                Cancelar
              </CancelLocal>
            )}

            <SubmitLocal type="submit" form="mascotas-form" disabled={saving}>
              {saving ? 'Guardando...' : modoEdicion ? 'Actualizar' : 'Registrar'}
            </SubmitLocal>
          </ActionsRow>
        </HeaderRow>

        <FormLocal id="mascotas-form" onSubmit={handleSubmit} noValidate>
          <FormBodyScroll>
            <Field>
              <InputLocal
                name="nombre"
                placeholder="Nombre de la mascota"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
                maxLength={100}
              />
              <ErrorText>{errors.nombre}</ErrorText>
            </Field>

            <Field>
              <SelectLocal
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
              >
                <option value="">Seleccionar cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} ({c.tipo_cliente || 'OCASIONAL'})
                  </option>
                ))}
              </SelectLocal>
              <ErrorText>{errors.cliente_id}</ErrorText>

              {clienteSeleccionado ? (
                <Hint>
                  Tipo: <b>{String(clienteSeleccionado.tipo_cliente || 'OCASIONAL').toUpperCase()}</b>
                </Hint>
              ) : null}
            </Field>

            {esClienteFijo && (
              <Field>
                <InputLocal
                  name="collar_id"
                  placeholder="ID del collar (ej: ANIMA-ABC123) (opcional)"
                  value={formData.collar_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={saving}
                  maxLength={50}
                />
                <ErrorText>{errors.collar_id}</ErrorText>
              </Field>
            )}

            <Field>
              <InputLocal
                name="especie"
                placeholder="Especie"
                value={formData.especie}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
                maxLength={60}
              />
              <ErrorText>{errors.especie}</ErrorText>
            </Field>

            <Field>
              <InputLocal
                name="raza"
                placeholder="Raza"
                value={formData.raza}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
                maxLength={80}
              />
              <ErrorText>{errors.raza}</ErrorText>
            </Field>

            <Field>
              <InputLocal
                name="edad"
                type="text"
                inputMode="numeric"
                placeholder="Edad"
                value={formData.edad}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
                maxLength={2}
              />
              <ErrorText>{errors.edad}</ErrorText>
            </Field>

            <Field>
              <SelectLocal
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={saving}
              >
                <option value="">Seleccione género</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </SelectLocal>
              <ErrorText>{errors.genero}</ErrorText>
            </Field>
          </FormBodyScroll>
        </FormLocal>
      </FormCardLocal>

      <RightColumn>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Buscar por nombre, cliente, especie o collar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </SearchSection>

        <ListCard>
          <SectionTitle>Listado de mascotas</SectionTitle>
          <CrudList>
            {mascotasFiltradas.length > 0 ? (
              mascotasFiltradas.map((m, idx) => (
                <CrudCard key={m.id || `${m.nombre}-${idx}`}>
                  <CardHeader>
                    <CardTitle>🐾 {m.nombre}</CardTitle>
                    <CardInfo>
                      {(m.especie || 'Sin especie')} - {(m.raza || 'Sin raza')}
                    </CardInfo>
                  </CardHeader>

                  <InfoGrid>
                    <InfoRow className="full-width">
                      <Label>Cliente</Label>
                      <Value style={{ textTransform: 'none' }}>
                        {m.propietario_nombre || '—'} ({String(m.tipo_cliente || 'OCASIONAL').toUpperCase()})
                      </Value>
                    </InfoRow>

                    <InfoRow>
                      <Label>Edad</Label>
                      <Value>{m.edad ? `${m.edad} años` : 'No registrada'}</Value>
                    </InfoRow>

                    <InfoRow>
                      <Label>Género</Label>
                      <Value>{m.genero || 'No registrado'}</Value>
                    </InfoRow>

                    <InfoRow className="full-width">
                      <Label>Collar</Label>
                      <Value style={{ textTransform: 'none' }}>
                        {m.collar_id ? `✅ ${m.collar_id}` : '—'}
                      </Value>
                    </InfoRow>
                  </InfoGrid>

                  <ButtonGroup>
                    <EditButton type="button" onClick={() => handleEditar(m)}>
                      Editar
                    </EditButton>
                    <DeleteButton type="button" onClick={() => handleEliminar(m.id)}>
                      Eliminar
                    </DeleteButton>
                  </ButtonGroup>
                </CrudCard>
              ))
            ) : (
              <EmptyState icon="🐾">No se encontraron mascotas.</EmptyState>
            )}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
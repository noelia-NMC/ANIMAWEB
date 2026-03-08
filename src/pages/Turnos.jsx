import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  obtenerTurnos,
  registrarTurno,
  eliminarTurno,
  actualizarTurno,
  obtenerVeterinariosParaTurnos
} from '../services/turnos';

import {
  PageGridContainer, PageTitle, FormCard, ListCard, FormGrid, FormGroup, FormActions,
  Input, Select, SubmitButton, RightColumn, SectionTitle, CrudList, CrudCard,
  CardHeader, CardTitle, CardInfo, InfoGrid, InfoRow, Label, Value, ButtonGroup,
  EditButton, DeleteButton, EmptyState, ErrorMessage, SearchSection, SearchInput
} from '../styles/crudStyles';

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [formData, setFormData] = useState({
    mascota_id: '',
    veterinario_id: '',
    fecha: '',
    hora: '',
    motivo: ''
  });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoId, setTurnoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const clinicaId = JSON.parse(localStorage.getItem('user'))?.clinica_id;

      const headers = {
        Authorization: `Bearer ${token}`,
        'clinica-id': clinicaId
      };

      const [turnosRes, mascotasRes, veterinariosRes] = await Promise.all([
        obtenerTurnos(),
        axios.get(`${import.meta.env.VITE_API_URL}/mascotas`, { headers }),
        obtenerVeterinariosParaTurnos()
      ]);

      setTurnos(turnosRes.data || []);
      setMascotas(mascotasRes.data || []);
      setVeterinarios(veterinariosRes.data || []);
    } catch (error) {
      console.error('Error al cargar datos para turnos:', error);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const validateField = (name, value, currentData = formData) => {
    const val = String(value ?? '').trim();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    switch (name) {
      case 'mascota_id':
        if (!currentData.mascota_id) return 'Debe seleccionar una mascota.';
        return null;

      case 'veterinario_id':
        if (!currentData.veterinario_id) return 'Debe seleccionar un veterinario.';
        return null;

      case 'fecha':
        if (!currentData.fecha) return 'La fecha es obligatoria.';
        {
          const fechaSeleccionada = new Date(`${currentData.fecha}T00:00:00`);
          if (fechaSeleccionada < hoy) return 'La fecha no puede ser anterior al día de hoy.';
        }
        return null;

      case 'hora':
        if (!currentData.hora) return 'La hora es obligatoria.';
        return null;

      case 'motivo':
        if (!val) return 'El motivo es obligatorio.';
        if (val.length < 10) return 'El motivo debe tener mínimo 10 caracteres.';
        if (val.length > 300) return 'El motivo es demasiado largo.';
        return null;

      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    ['mascota_id', 'veterinario_id', 'fecha', 'hora', 'motivo'].forEach((field) => {
      const err = validateField(field, formData[field], formData);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;
    if (name === 'motivo') {
      cleanedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, cleanedValue, { ...formData, [name]: cleanedValue })
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, formData)
    }));
  };

  const limpiarFormulario = () => {
    setFormData({
      mascota_id: '',
      veterinario_id: '',
      fecha: '',
      hora: '',
      motivo: ''
    });
    setModoEdicion(false);
    setTurnoId(null);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      mascota_id: Number(formData.mascota_id),
      veterinario_id: Number(formData.veterinario_id),
      fecha: formData.fecha,
      hora: formData.hora,
      motivo: formData.motivo.trim()
    };

    try {
      if (modoEdicion && turnoId) {
        await actualizarTurno(turnoId, payload);
        alert('Turno actualizado correctamente.');
      } else {
        await registrarTurno(payload);
        alert('Turno registrado correctamente.');
      }

      limpiarFormulario();
      cargarDatos();
    } catch (err) {
      console.error('Error al guardar turno:', err);
      alert(err.response?.data?.error || 'Error al guardar el turno.');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Desea eliminar este turno de forma permanente?')) return;

    try {
      await eliminarTurno(id);
      alert('Turno eliminado correctamente.');
      cargarDatos();
    } catch (err) {
      console.error('Error al eliminar turno:', err);
      alert(err.response?.data?.error || 'Error al eliminar el turno.');
    }
  };

  const handleEditar = (turno) => {
    setModoEdicion(true);
    setTurnoId(turno.id);

    const fechaParaInput = new Date(turno.fecha).toISOString().split('T')[0];

    setFormData({
      mascota_id: String(turno.mascota_id || ''),
      veterinario_id: String(turno.veterinario_id || ''),
      fecha: fechaParaInput,
      hora: String(turno.hora || ''),
      motivo: String(turno.motivo || '')
    });

    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const turnosFiltrados = turnos.filter((t) =>
    (t.nombre_mascota && t.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase())) ||
    (t.nombre_veterinario && t.nombre_veterinario.toLowerCase().includes(busqueda.toLowerCase())) ||
    (t.motivo && t.motivo.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const formatearFechaParaVista = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <PageGridContainer>
      <PageTitle>Gestión de turnos</PageTitle>

      <FormCard>
        <SectionTitle>{modoEdicion ? 'Editar turno' : 'Agendar nuevo turno'}</SectionTitle>

        <FormGrid onSubmit={handleSubmit} noValidate>
          <FormGroup className="full-width">
            <Select
              name="mascota_id"
              value={formData.mascota_id}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Seleccionar mascota</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </Select>
            <ErrorMessage>{errors.mascota_id}</ErrorMessage>
          </FormGroup>

          <FormGroup className="full-width">
            <Select
              name="veterinario_id"
              value={formData.veterinario_id}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Seleccionar veterinario</option>
              {veterinarios.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.nombre}{v.especialidad ? ` - ${v.especialidad}` : ''}
                </option>
              ))}
            </Select>
            <ErrorMessage>{errors.veterinario_id}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="fecha"
              type="date"
              value={formData.fecha}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage>{errors.fecha}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="hora"
              type="time"
              value={formData.hora}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <ErrorMessage>{errors.hora}</ErrorMessage>
          </FormGroup>

          <FormGroup className="full-width">
            <Input
              name="motivo"
              placeholder="Motivo de la consulta"
              value={formData.motivo}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={300}
            />
            <ErrorMessage>{errors.motivo}</ErrorMessage>
          </FormGroup>

          <FormActions>
            {modoEdicion && (
              <SubmitButton
                type="button"
                onClick={limpiarFormulario}
                style={{ backgroundColor: '#e0e0e0', color: '#2c3e50' }}
              >
                Cancelar
              </SubmitButton>
            )}

            <SubmitButton type="submit">
              {modoEdicion ? 'Actualizar' : 'Agendar'}
            </SubmitButton>
          </FormActions>
        </FormGrid>
      </FormCard>

      <RightColumn>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Buscar por mascota, veterinario, motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </SearchSection>

        <ListCard>
          <SectionTitle>Turnos agendados</SectionTitle>

          <CrudList>
            {turnosFiltrados.length > 0 ? (
              turnosFiltrados
                .sort((a, b) => new Date(b.fecha) - new Date(a.fecha) || a.hora.localeCompare(b.hora))
                .map((t) => (
                  <CrudCard key={t.id}>
                    <CardHeader>
                      <CardTitle>📅 {t.nombre_mascota}</CardTitle>
                      <CardInfo>{formatearFechaParaVista(t.fecha)}</CardInfo>
                    </CardHeader>

                    <InfoGrid>
                      <InfoRow className="full-width">
                        <Label>Veterinario</Label>
                        <Value>{t.nombre_veterinario || 'Sin asignar'}</Value>
                      </InfoRow>

                      <InfoRow>
                        <Label>Hora</Label>
                        <Value>{t.hora}</Value>
                      </InfoRow>

                      <InfoRow className="full-width">
                        <Label>Motivo</Label>
                        <Value style={{ textTransform: 'none' }}>{t.motivo}</Value>
                      </InfoRow>
                    </InfoGrid>

                    <ButtonGroup>
                      <EditButton onClick={() => handleEditar(t)}>Editar</EditButton>
                      <DeleteButton onClick={() => handleEliminar(t.id)}>Eliminar</DeleteButton>
                    </ButtonGroup>
                  </CrudCard>
                ))
            ) : (
              <EmptyState icon="📅">No se encontraron turnos.</EmptyState>
            )}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
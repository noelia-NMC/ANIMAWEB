// ARCHIVO COMPLETO Y CORREGIDO: src/pages/Turnos.js

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { obtenerTurnos, registrarTurno, eliminarTurno, actualizarTurno } from '../services/turnos';
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
  const [formData, setFormData] = useState({ mascota_id: '', veterinario_id: '', fecha: '', hora: '', motivo: '' });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [turnoId, setTurnoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarDatos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const clinicaId = JSON.parse(localStorage.getItem('user'))?.clinica_id;
      const headers = { 'Authorization': `Bearer ${token}`, 'clinica-id': clinicaId };
      const [turnosRes, mascotasRes, veterinariosRes] = await Promise.all([
        obtenerTurnos(),
        axios.get(`${import.meta.env.VITE_API_URL}/mascotas`, { headers }),
        axios.get(`${import.meta.env.VITE_API_URL}/veterinarios`, { headers })
      ]);
      setTurnos(turnosRes.data);
      setMascotas(mascotasRes.data);
      setVeterinarios(veterinariosRes.data);
    } catch (error) { console.error("Error al cargar datos para turnos:", error); }
  }, []);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);
  
  const validate = () => {
      const newErrors = {};
      
      // --- CORRECCIÓN CLAVE EN LA VALIDACIÓN DE FECHA ---
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Establece la hora a medianoche para una comparación justa del día.
      
      if (!formData.mascota_id) newErrors.mascota_id = 'Debe seleccionar una mascota.';
      if (!formData.veterinario_id) newErrors.veterinario_id = 'Debe seleccionar un veterinario.';
      if (!formData.fecha) { 
          newErrors.fecha = 'La fecha es obligatoria.';
      } else {
          // El input de tipo 'date' devuelve 'YYYY-MM-DD'. Para evitar problemas de zona horaria,
          // lo convertimos a un objeto Date añadiendo la hora y la zona horaria del cliente.
          // El truco es usar el formato 'YYYY-MM-DDTHH:mm:ss' que el constructor de Date entiende bien.
          const fechaSeleccionada = new Date(`${formData.fecha}T00:00:00`);
          if (fechaSeleccionada < hoy) {
              newErrors.fecha = 'La fecha no puede ser anterior al día de hoy.';
          }
      }
      if (!formData.hora) newErrors.hora = 'La hora es obligatoria.';
      if (!formData.motivo.trim() || formData.motivo.trim().length < 10) newErrors.motivo = 'El motivo es obligatorio (mín. 10 caracteres).';
      return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({...prev, [name]: null})); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    try {
      if (modoEdicion && turnoId) { await actualizarTurno(turnoId, formData); alert('Turno actualizado correctamente.'); } 
      else { await registrarTurno(formData); alert('Turno registrado correctamente.'); }
      setFormData({ mascota_id: '', veterinario_id: '', fecha: '', hora: '', motivo: '' });
      setModoEdicion(false); setTurnoId(null); setErrors({}); cargarDatos();
    } catch (err) { console.error('Error al guardar turno:', err); alert(err.response?.data?.error || 'Error al guardar el turno.'); }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Desea eliminar este turno de forma permanente?')) {
      try {
        await eliminarTurno(id); cargarDatos(); alert('Turno eliminado correctamente.');
      } catch (err) { console.error('Error al eliminar turno:', err); alert(err.response?.data?.error || 'Error al eliminar el turno.'); }
    }
  };

  const handleEditar = (turno) => {
    setModoEdicion(true); setTurnoId(turno.id);
    // Al editar, también nos aseguramos de que la fecha se formatee correctamente para el input.
    const fechaParaInput = new Date(turno.fecha).toISOString().split('T')[0];
    setFormData({ mascota_id: turno.mascota_id, veterinario_id: turno.veterinario_id, fecha: fechaParaInput, hora: turno.hora, motivo: turno.motivo });
    setErrors({});
  };
  
  const turnosFiltrados = turnos.filter(t => 
    (t.nombre_mascota && t.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase())) ||
    (t.nombre_veterinario && t.nombre_veterinario.toLowerCase().includes(busqueda.toLowerCase())) ||
    (t.motivo && t.motivo.toLowerCase().includes(busqueda.toLowerCase()))
  );
  
  // Función para mostrar la fecha correctamente, ignorando la zona horaria para la visualización.
  const formatearFechaParaVista = (fechaISO) => {
      const fecha = new Date(fechaISO);
      const dia = String(fecha.getUTCDate()).padStart(2, '0');
      const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Meses son 0-11
      const anio = fecha.getUTCFullYear();
      return `${dia}/${mes}/${anio}`;
  }

  return (
    <PageGridContainer>
      <PageTitle>Gestión de turnos</PageTitle>
      <FormCard>
        <SectionTitle>{modoEdicion ? 'Editar turno' : 'Agendar nuevo turno'}</SectionTitle>
        <FormGrid onSubmit={handleSubmit} noValidate>
          <FormGroup className="full-width"><Select name="mascota_id" value={formData.mascota_id} onChange={handleChange}><option value="">Seleccionar mascota</option>{mascotas.map(m => (<option key={m.id} value={m.id}>{m.nombre}</option>))}</Select><ErrorMessage>{errors.mascota_id}</ErrorMessage></FormGroup>
          <FormGroup className="full-width"><Select name="veterinario_id" value={formData.veterinario_id} onChange={handleChange}><option value="">Seleccionar veterinario</option>{veterinarios.map(v => (<option key={v.id} value={v.id}>{v.nombre}</option>))}</Select><ErrorMessage>{errors.veterinario_id}</ErrorMessage></FormGroup>
          <FormGroup><Input name="fecha" type="date" value={formData.fecha} onChange={handleChange} /><ErrorMessage>{errors.fecha}</ErrorMessage></FormGroup>
          <FormGroup><Input name="hora" type="time" value={formData.hora} onChange={handleChange} /><ErrorMessage>{errors.hora}</ErrorMessage></FormGroup>
          <FormGroup className="full-width"><Input name="motivo" placeholder="Motivo de la consulta" value={formData.motivo} onChange={handleChange} /><ErrorMessage>{errors.motivo}</ErrorMessage></FormGroup>
          <FormActions><SubmitButton type="submit">{modoEdicion ? 'Actualizar' : 'Agendar'}</SubmitButton></FormActions>
        </FormGrid>
      </FormCard>
      <RightColumn>
        <SearchSection><SearchInput type="text" placeholder="Buscar por mascota, veterinario, motivo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/></SearchSection>
        <ListCard>
          <SectionTitle>Turnos agendados</SectionTitle>
          <CrudList>
            {turnosFiltrados.length > 0 ? (turnosFiltrados.sort((a, b) => new Date(b.fecha) - new Date(a.fecha) || a.hora.localeCompare(b.hora)).map(t => (<CrudCard key={t.id}><CardHeader><CardTitle>📅 {t.nombre_mascota}</CardTitle><CardInfo>{formatearFechaParaVista(t.fecha)}</CardInfo></CardHeader><InfoGrid><InfoRow className="full-width"><Label>Veterinario</Label><Value>{t.nombre_veterinario || 'Sin asignar'}</Value></InfoRow><InfoRow><Label>Hora</Label><Value>{t.hora}</Value></InfoRow><InfoRow className="full-width"><Label>Motivo</Label><Value style={{textTransform: 'none'}}>{t.motivo}</Value></InfoRow></InfoGrid><ButtonGroup><EditButton onClick={() => handleEditar(t)}>Editar</EditButton><DeleteButton onClick={() => handleEliminar(t.id)}>Eliminar</DeleteButton></ButtonGroup></CrudCard>))) : (<EmptyState icon="📅">No se encontraron turnos.</EmptyState>)}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
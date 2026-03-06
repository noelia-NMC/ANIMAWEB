// src/pages/HistorialClinico.js
import { useEffect, useState } from 'react';
import { obtenerHistorial, registrarHistorial, actualizarHistorial, eliminarHistorial, obtenerMascotas } from '../services/historial'; 
import {
  PageGridContainer, PageTitle, FormCard, ListCard, Form, FormGroup, FormActions,
  Select, Input, TextArea, SubmitButton, RightColumn, SearchSection, SectionTitle,
  SearchInput, CrudList, CrudCard, CardHeader, CardTitle, CardInfo, InfoGrid, InfoRow,
  Label, Value, ButtonGroup, EditButton, DeleteButton, EmptyState, ErrorMessage
} from '../styles/crudStyles';

export default function HistorialClinico() {
  const [historiales, setHistoriales] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [formData, setFormData] = useState({ id: null, mascota_id: '', diagnostico: '', tratamiento: '', observaciones: '' });
  const [errors, setErrors] = useState({});
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [historialRes, mascotasRes] = await Promise.all([obtenerHistorial(), obtenerMascotas()]);
        setHistoriales(historialRes.data);
        setMascotas(mascotasRes.data);
      } catch (error) { console.error("Error al cargar datos:", error); }
    };
    cargarDatos();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.mascota_id) newErrors.mascota_id = 'Debe seleccionar una mascota.';
    if (!formData.diagnostico.trim() || formData.diagnostico.trim().length < 5) newErrors.diagnostico = 'El diagnóstico es obligatorio (mín. 5 caracteres).';
    if (!formData.tratamiento.trim() || formData.tratamiento.trim().length < 5) newErrors.tratamiento = 'El tratamiento es obligatorio (mín. 5 caracteres).';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) { setErrors(prev => ({ ...prev, [name]: null })); }
  };
  
  const resetForm = () => {
    setFormData({ id: null, mascota_id: '', diagnostico: '', tratamiento: '', observaciones: '' });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    try {
      if (formData.id) { await actualizarHistorial(formData.id, formData); alert('Historial actualizado correctamente.'); } 
      else { await registrarHistorial(formData); alert('Historial registrado correctamente.'); }
      resetForm();
      const res = await obtenerHistorial();
      setHistoriales(res.data);
    } catch (error) { console.error("Error al guardar el historial:", error); alert('Hubo un error al guardar el historial.'); }
  };

  const handleEdit = (h) => {
    setFormData({ id: h.id, mascota_id: h.mascota_id, diagnostico: h.diagnostico, tratamiento: h.tratamiento, observaciones: h.observaciones });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este registro del historial?')) {
      try {
        await eliminarHistorial(id);
        const res = await obtenerHistorial();
        setHistoriales(res.data);
        alert('Historial eliminado correctamente.');
      } catch (error) { console.error("Error al eliminar el historial:", error); alert('Hubo un error al eliminar el historial.'); }
    }
  };

  const historialesFiltrados = historiales.filter(h =>
    (h.nombre_mascota && h.nombre_mascota.toLowerCase().includes(busqueda.toLowerCase())) ||
    (h.diagnostico && h.diagnostico.toLowerCase().includes(busqueda.toLowerCase())) ||
    (h.tratamiento && h.tratamiento.toLowerCase().includes(busqueda.toLowerCase()))
  );
 
  return (
    <PageGridContainer>
      <PageTitle>Gestión de historial clínico</PageTitle>
      <FormCard>
        <SectionTitle>{formData.id ? 'Editando historial' : 'Registrar nuevo historial'}</SectionTitle>
        <Form onSubmit={handleSubmit} noValidate>
          <FormGroup><Select name="mascota_id" value={formData.mascota_id} onChange={handleChange}><option value="">Seleccione una mascota</option>{mascotas.map(m => ( <option key={m.id} value={m.id}>{m.nombre}</option> ))}</Select><ErrorMessage>{errors.mascota_id}</ErrorMessage></FormGroup>
          <FormGroup><Input name="diagnostico" placeholder="Diagnóstico" value={formData.diagnostico} onChange={handleChange} /><ErrorMessage>{errors.diagnostico}</ErrorMessage></FormGroup>
          <FormGroup><Input name="tratamiento" placeholder="Tratamiento" value={formData.tratamiento} onChange={handleChange} /><ErrorMessage>{errors.tratamiento}</ErrorMessage></FormGroup>
          <FormGroup><TextArea name="observaciones" placeholder="Observaciones adicionales (opcional)" value={formData.observaciones} onChange={handleChange} /><ErrorMessage>{errors.observaciones}</ErrorMessage></FormGroup>
          <FormActions><SubmitButton type="submit">{formData.id ? 'Actualizar' : 'Registrar'}</SubmitButton></FormActions>
        </Form>
      </FormCard>
      <RightColumn>
        <SearchSection><SearchInput type="text" placeholder="Buscar por mascota, diagnóstico..." value={busqueda} onChange={e => setBusqueda(e.target.value)} /></SearchSection>
        <ListCard>
          <SectionTitle>Registros del historial</SectionTitle>
          <CrudList>
            {historialesFiltrados.length > 0 ? (historialesFiltrados.map(h => (<CrudCard key={h.id}><CardHeader><CardTitle>📋 {h.nombre_mascota || 'Mascota'}</CardTitle><CardInfo>{new Date(h.fecha).toLocaleDateString()}</CardInfo></CardHeader><InfoGrid><InfoRow><Label>Diagnóstico</Label><Value>{h.diagnostico}</Value></InfoRow><InfoRow><Label>Tratamiento</Label><Value>{h.tratamiento}</Value></InfoRow>{h.observaciones && (<InfoRow className="full-width"><Label>Observaciones</Label><Value style={{textTransform: 'none'}}>{h.observaciones}</Value></InfoRow>)}</InfoGrid><ButtonGroup><EditButton onClick={() => handleEdit(h)}>Editar</EditButton><DeleteButton onClick={() => handleDelete(h.id)}>Eliminar</DeleteButton></ButtonGroup></CrudCard>))) : (<EmptyState icon="📂">No se encontraron registros.</EmptyState>)}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
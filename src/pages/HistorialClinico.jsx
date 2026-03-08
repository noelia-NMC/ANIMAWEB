import { useEffect, useState } from 'react';
import {
  obtenerHistorial,
  registrarHistorial,
  actualizarHistorial,
  eliminarHistorial,
  obtenerMascotas
} from '../services/historial';

import {
  PageGridContainer, PageTitle, FormCard, ListCard, Form, FormGroup, FormActions,
  Select, Input, TextArea, SubmitButton, RightColumn, SearchSection, SectionTitle,
  SearchInput, CrudList, CrudCard, CardHeader, CardTitle, CardInfo, InfoGrid, InfoRow,
  Label, Value, ButtonGroup, EditButton, DeleteButton, EmptyState, ErrorMessage
} from '../styles/crudStyles';

export default function HistorialClinico() {
  const [historiales, setHistoriales] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    mascota_id: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: ''
  });
  const [errors, setErrors] = useState({});
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [historialRes, mascotasRes] = await Promise.all([
          obtenerHistorial(),
          obtenerMascotas()
        ]);
        setHistoriales(Array.isArray(historialRes.data) ? historialRes.data : []);
        setMascotas(Array.isArray(mascotasRes.data) ? mascotasRes.data : []);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    cargarDatos();
  }, []);

  const validateField = (name, value, currentData = formData) => {
    const val = String(value ?? '').trim();

    switch (name) {
      case 'mascota_id':
        if (!currentData.mascota_id) return 'Debe seleccionar una mascota.';
        return null;

      case 'diagnostico':
        if (!val) return 'El diagnóstico es obligatorio.';
        if (val.length < 5) return 'El diagnóstico debe tener al menos 5 caracteres.';
        if (val.length > 500) return 'El diagnóstico es demasiado largo.';
        return null;

      case 'tratamiento':
        if (!val) return 'El tratamiento es obligatorio.';
        if (val.length < 5) return 'El tratamiento debe tener al menos 5 caracteres.';
        if (val.length > 500) return 'El tratamiento es demasiado largo.';
        return null;

      case 'observaciones':
        if (val.length > 1200) return 'Las observaciones son demasiado largas.';
        return null;

      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    ['mascota_id', 'diagnostico', 'tratamiento', 'observaciones'].forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      const error = validateField(name, value, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      mascota_id: '',
      diagnostico: '',
      tratamiento: '',
      observaciones: ''
    });
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
      ...formData,
      mascota_id: Number(formData.mascota_id),
      diagnostico: formData.diagnostico.trim(),
      tratamiento: formData.tratamiento.trim(),
      observaciones: formData.observaciones.trim() || null,
    };

    try {
      if (formData.id) {
        await actualizarHistorial(formData.id, payload);
        alert('Historial actualizado correctamente.');
      } else {
        await registrarHistorial(payload);
        alert('Historial registrado correctamente.');
      }

      resetForm();
      const res = await obtenerHistorial();
      setHistoriales(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al guardar el historial:', error);
      alert(error?.response?.data?.message || 'Hubo un error al guardar el historial.');
    }
  };

  const handleEdit = (h) => {
    setFormData({
      id: h.id,
      mascota_id: String(h.mascota_id ?? ''),
      diagnostico: h.diagnostico || '',
      tratamiento: h.tratamiento || '',
      observaciones: h.observaciones || ''
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este registro del historial?')) return;

    try {
      await eliminarHistorial(id);
      const res = await obtenerHistorial();
      setHistoriales(Array.isArray(res.data) ? res.data : []);
      alert('Historial eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el historial:', error);
      alert(error?.response?.data?.message || 'Hubo un error al eliminar el historial.');
    }
  };

  const historialesFiltrados = historiales.filter((h) =>
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
          <FormGroup>
            <Select
              name="mascota_id"
              value={formData.mascota_id}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Seleccione una mascota</option>
              {mascotas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </Select>
            <ErrorMessage>{errors.mascota_id}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="diagnostico"
              placeholder="Diagnóstico"
              value={formData.diagnostico}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={500}
            />
            <ErrorMessage>{errors.diagnostico}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="tratamiento"
              placeholder="Tratamiento"
              value={formData.tratamiento}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={500}
            />
            <ErrorMessage>{errors.tratamiento}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <TextArea
              name="observaciones"
              placeholder="Observaciones adicionales (opcional)"
              value={formData.observaciones}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={1200}
            />
            <ErrorMessage>{errors.observaciones}</ErrorMessage>
          </FormGroup>

          <FormActions>
            <SubmitButton type="submit">
              {formData.id ? 'Actualizar' : 'Registrar'}
            </SubmitButton>
          </FormActions>
        </Form>
      </FormCard>

      <RightColumn>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Buscar por mascota, diagnóstico..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </SearchSection>

        <ListCard>
          <SectionTitle>Registros del historial</SectionTitle>

          <CrudList>
            {historialesFiltrados.length > 0 ? (
              historialesFiltrados.map((h) => (
                <CrudCard key={h.id}>
                  <CardHeader>
                    <CardTitle>📋 {h.nombre_mascota || 'Mascota'}</CardTitle>
                    <CardInfo>{h.fecha ? new Date(h.fecha).toLocaleDateString() : '—'}</CardInfo>
                  </CardHeader>

                  <InfoGrid>
                    <InfoRow>
                      <Label>Diagnóstico</Label>
                      <Value>{h.diagnostico}</Value>
                    </InfoRow>

                    <InfoRow>
                      <Label>Tratamiento</Label>
                      <Value>{h.tratamiento}</Value>
                    </InfoRow>

                    {h.observaciones && (
                      <InfoRow className="full-width">
                        <Label>Observaciones</Label>
                        <Value style={{ textTransform: 'none' }}>{h.observaciones}</Value>
                      </InfoRow>
                    )}
                  </InfoGrid>

                  <ButtonGroup>
                    <EditButton onClick={() => handleEdit(h)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleDelete(h.id)}>Eliminar</DeleteButton>
                  </ButtonGroup>
                </CrudCard>
              ))
            ) : (
              <EmptyState icon="📂">No se encontraron registros.</EmptyState>
            )}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
} from '../services/clientes';

import {
  PageGridContainer, PageTitle, FormCard, ListCard, FormGrid, FormGroup, FormActions,
  Input, Select, SubmitButton, RightColumn, SectionTitle, CrudList, CrudCard,
  CardHeader, CardTitle, CardInfo, InfoGrid, InfoRow, Label, Value, ButtonGroup,
  EditButton, DeleteButton, EmptyState, ErrorMessage, SearchSection, SearchInput
} from '../styles/crudStyles';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\-\s()]{7,20}$/;
const CI_REGEX = /^[a-zA-Z0-9-]{4,20}$/;

export default function Clientes() {
  const [clientes, setClientes] = useState([]);

  const [formData, setFormData] = useState({
    tipo_cliente: 'OCASIONAL',
    nombre: '',
    telefono: '',
    ci: '',
    email: '',
  });

  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const cargarClientes = useCallback(async () => {
    try {
      const res = await obtenerClientes();
      const list = Array.isArray(res.data) ? res.data : [];
      setClientes(list);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setClientes([]);
    }
  }, []);

  useEffect(() => {
    cargarClientes();
  }, [cargarClientes]);

  const validateField = (name, value, currentData = formData) => {
    const tipo = String(currentData.tipo_cliente || '').toUpperCase();
    const val = String(value ?? '').trim();

    switch (name) {
      case 'tipo_cliente':
        if (!['FIJO', 'OCASIONAL'].includes(tipo)) {
          return 'Debe seleccionar un tipo válido.';
        }
        return null;

      case 'nombre':
        if (!val) return 'El nombre es obligatorio.';
        if (val.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        if (val.length > 120) return 'El nombre es demasiado largo.';
        return null;

      case 'telefono':
        if (!val) return null;
        if (!PHONE_REGEX.test(val)) return 'Teléfono inválido.';
        return null;

      case 'ci':
        if (!val) return null;
        if (!CI_REGEX.test(val)) return 'CI inválido.';
        return null;

      case 'email':
        if (!val) return null;
        if (!EMAIL_REGEX.test(val)) return 'Email inválido.';
        return null;

      default:
        return null;
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) newErrors[field] = error;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let cleanedValue = value;

    if (name === 'telefono') {
      cleanedValue = value.replace(/[^0-9+\-\s()]/g, '');
    }

    if (name === 'ci') {
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
      tipo_cliente: 'OCASIONAL',
      nombre: '',
      telefono: '',
      ci: '',
      email: '',
    });
    setErrors({});
    setModoEdicion(false);
    setClienteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      tipo_cliente: String(formData.tipo_cliente).toUpperCase(),
      nombre: formData.nombre.trim(),
      telefono: formData.telefono?.trim() || null,
      ci: formData.ci?.trim() || null,
      email: formData.email?.trim().toLowerCase() || null,
    };

    try {
      if (modoEdicion && clienteId) {
        await actualizarCliente(clienteId, payload);
        alert('Cliente actualizado correctamente.');
      } else {
        await crearCliente(payload);
        alert('Cliente registrado correctamente.');
      }

      limpiarFormulario();
      await cargarClientes();
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Error al guardar cliente.');
    }
  };

  const handleEditar = (cliente) => {
    setModoEdicion(true);
    setClienteId(cliente.id);

    setFormData({
      tipo_cliente: cliente.tipo_cliente || 'OCASIONAL',
      nombre: cliente.nombre || '',
      telefono: cliente.telefono || '',
      ci: cliente.ci || '',
      email: cliente.email || '',
    });

    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    const ok = window.confirm('¿Desea eliminar este cliente? Esta acción no se puede deshacer.');
    if (!ok) return;

    try {
      await eliminarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));

      if (modoEdicion && clienteId === id) limpiarFormulario();

      alert('Cliente eliminado correctamente.');
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Error al eliminar cliente.');
    }
  };

  const clientesFiltrados = useMemo(() => {
    const q = (busqueda || '').toLowerCase().trim();
    if (!q) return clientes;

    return clientes.filter((c) => {
      return (
        (c.nombre && c.nombre.toLowerCase().includes(q)) ||
        (c.telefono && String(c.telefono).toLowerCase().includes(q)) ||
        (c.tipo_cliente && String(c.tipo_cliente).toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.ci && String(c.ci).toLowerCase().includes(q))
      );
    });
  }, [clientes, busqueda]);

  const clientesOrdenados = useMemo(() => {
    return [...clientesFiltrados].sort(
      (a, b) => new Date(b.creado_en || 0) - new Date(a.creado_en || 0)
    );
  }, [clientesFiltrados]);

  return (
    <PageGridContainer>
      <PageTitle>Gestión de clientes</PageTitle>

      <FormCard>
        <SectionTitle>{modoEdicion ? 'Editar cliente' : 'Registrar nuevo cliente'}</SectionTitle>

        <FormGrid onSubmit={handleSubmit} noValidate>
          <FormGroup className="full-width">
            <Select
              name="tipo_cliente"
              value={formData.tipo_cliente}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="OCASIONAL">Cliente: OCASIONAL</option>
              <option value="FIJO">Cliente: FIJO</option>
            </Select>
            <ErrorMessage>{errors.tipo_cliente}</ErrorMessage>
          </FormGroup>

          <FormGroup className="full-width">
            <Input
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={120}
            />
            <ErrorMessage>{errors.nombre}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="telefono"
              placeholder="Teléfono (opcional)"
              value={formData.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={20}
            />
            <ErrorMessage>{errors.telefono}</ErrorMessage>
          </FormGroup>

          <FormGroup>
            <Input
              name="ci"
              placeholder="CI (opcional)"
              value={formData.ci}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={20}
            />
            <ErrorMessage>{errors.ci}</ErrorMessage>
          </FormGroup>

          <FormGroup className="full-width">
            <Input
              name="email"
              type="email"
              placeholder="Email (opcional)"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength={120}
            />
            <ErrorMessage>{errors.email}</ErrorMessage>
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
              {modoEdicion ? 'Actualizar' : 'Registrar'}
            </SubmitButton>
          </FormActions>
        </FormGrid>
      </FormCard>

      <RightColumn>
        <SearchSection>
          <SearchInput
            type="text"
            placeholder="Buscar por nombre, teléfono, tipo, CI o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </SearchSection>

        <ListCard>
          <SectionTitle>Listado de clientes</SectionTitle>

          <CrudList>
            {clientesOrdenados.length > 0 ? (
              clientesOrdenados.map((c) => (
                <CrudCard key={c.id}>
                  <CardHeader>
                    <CardTitle>👤 {c.nombre}</CardTitle>
                    <CardInfo>{c.tipo_cliente || 'OCASIONAL'}</CardInfo>
                  </CardHeader>

                  <InfoGrid>
                    <InfoRow>
                      <Label>Teléfono</Label>
                      <Value>{c.telefono || '—'}</Value>
                    </InfoRow>

                    <InfoRow>
                      <Label>CI</Label>
                      <Value>{c.ci || '—'}</Value>
                    </InfoRow>

                    <InfoRow className="full-width">
                      <Label>Email</Label>
                      <Value style={{ textTransform: 'none' }}>{c.email || '—'}</Value>
                    </InfoRow>
                  </InfoGrid>

                  <ButtonGroup>
                    <EditButton onClick={() => handleEditar(c)}>Editar</EditButton>
                    <DeleteButton onClick={() => handleEliminar(c.id)}>Eliminar</DeleteButton>
                  </ButtonGroup>
                </CrudCard>
              ))
            ) : (
              <EmptyState icon="👥">No se encontraron clientes.</EmptyState>
            )}
          </CrudList>
        </ListCard>
      </RightColumn>
    </PageGridContainer>
  );
}
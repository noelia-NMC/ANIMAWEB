// src/pages/LaboratorioResultados.jsx
import { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

import { obtenerMascotas } from '../services/historial'; // ya lo tienes
import {
  obtenerResultadosLab,
  crearResultadoLab,
  actualizarResultadoLab,
  eliminarResultadoLab,
} from '../services/laboratorio';

// Reusamos tus estilos base (inputs/títulos)
import {
  PageTitle,
  SectionTitle,
  Form,
  FormGroup,
  Select,
  Input,
  TextArea,
  SubmitButton,
  SearchInput,
  ErrorMessage,
  EmptyState,
} from '../styles/crudStyles';

const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
  danger: '#e74c3c',
  info: '#3498db',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  animation: ${fadeIn} 0.28s ease-out;
`;

const TopBar = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 780px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Subtitle = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.92rem;
  margin-top: 0.35rem;
`;

const SoftPill = styled.div`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  border-radius: 999px;
  padding: 0.55rem 0.9rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${colors.primary};
  box-shadow: 0 0 0 4px rgba(66,168,161,0.12);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 1.2rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(44, 62, 80, 0.06);
  overflow: hidden;
`;

const CardBody = styled.div`
  padding: 1.15rem;
`;

const CardHeader = styled.div`
  padding: 1rem 1.15rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(180deg, ${colors.white}, ${colors.background});
`;

const HeaderTitle = styled.div`
  font-weight: 900;
  color: ${colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.55rem;
`;

const Accent = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${colors.primary};
`;

const HeaderRight = styled.div`
  color: ${colors.textSecondary};
  font-weight: 800;
  font-size: 0.9rem;
`;

const FileDrop = styled.div`
  border: 1px dashed ${colors.border};
  background: ${colors.background};
  border-radius: 16px;
  padding: 0.9rem;
`;

const FileLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const SmallHint = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.82rem;
  margin-top: 0.45rem;
  line-height: 1.25;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const SoftBtn = styled.button`
  background: ${colors.white};
  color: ${colors.textPrimary};
  border: 1px solid ${colors.border};
  padding: 0.62rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 8px 18px rgba(44, 62, 80, 0.06);
    transform: translateY(-1px);
  }
`;

const DangerBtn = styled.button`
  background: rgba(231, 76, 60, 0.10);
  color: ${colors.danger};
  border: 1px solid rgba(231, 76, 60, 0.20);
  padding: 0.62rem 1rem;
  border-radius: 12px;
  font-weight: 900;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    border-color: ${colors.danger};
    transform: translateY(-1px);
  }
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const ResultGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 950px) {
    grid-template-columns: 1fr;
  }
`;

const ResultCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 18px;
  overflow: hidden;
  background: ${colors.white};
  transition: 0.22s ease;
  box-shadow: 0 10px 24px rgba(44, 62, 80, 0.05);

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(66,168,161,0.35);
    box-shadow: 0 14px 30px rgba(44, 62, 80, 0.08);
  }
`;

const ResultTop = styled.div`
  padding: 0.95rem 1rem;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.8rem;
`;

const ResultTitle = styled.div`
  font-weight: 900;
  color: ${colors.textPrimary};
  line-height: 1.2;
`;

const ResultMeta = styled.div`
  color: ${colors.textSecondary};
  font-weight: 800;
  font-size: 0.82rem;
  margin-top: 0.25rem;
`;

const Badge = styled.span`
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  font-weight: 900;
  font-size: 0.75rem;
  border: 1px solid ${(p) => p.bd};
  background: ${(p) => p.bg};
  color: ${(p) => p.color};
  white-space: nowrap;
`;

const ResultBody = styled.div`
  padding: 1rem;
`;

const PreviewRow = styled.div`
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
`;

const Thumb = styled.div`
  width: 76px;
  height: 76px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  background: ${colors.background};
  overflow: hidden;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  color: ${colors.textSecondary};
  font-weight: 900;
  font-size: 0.9rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Notes = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  line-height: 1.25;
`;

const LinkBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.7rem;
  font-weight: 900;
  color: ${colors.primary};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ResultActions = styled.div`
  margin-top: 0.85rem;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const TinyBtn = styled.button`
  border: 1px solid ${(p) => p.bd || colors.border};
  background: ${(p) => p.bg || colors.white};
  color: ${(p) => p.color || colors.textPrimary};
  cursor: pointer;
  padding: 0.55rem 0.85rem;
  border-radius: 12px;
  font-weight: 900;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${(p) => p.hoverBd || colors.primary};
  }
`;

function isProbablyImage(url = '') {
  const u = String(url).toLowerCase();
  return u.endsWith('.png') || u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.webp');
}

export default function LaboratorioResultados() {
  const { user } = useAuth();

  const [mascotas, setMascotas] = useState([]);
  const [resultados, setResultados] = useState([]);

  const [busqueda, setBusqueda] = useState('');
  const [filtroMascota, setFiltroMascota] = useState('');

  const [formData, setFormData] = useState({
    id: null,
    mascota_id: '',
    tipo_examen: '',
    fecha: '',
    notas: '',
    archivo: null,
  });

  const [errors, setErrors] = useState({});

  const cargarTodo = async () => {
    try {
      const [mRes, rRes] = await Promise.all([obtenerMascotas(), obtenerResultadosLab('')]);
      setMascotas(mRes.data || []);
      setResultados(rRes.data || []);
    } catch (e) {
      console.error('Error cargando laboratorio:', e);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.mascota_id) newErrors.mascota_id = 'Debe seleccionar una mascota.';
    if (!formData.tipo_examen.trim() || formData.tipo_examen.trim().length < 3) {
      newErrors.tipo_examen = 'Tipo de examen obligatorio (mín. 3 caracteres).';
    }
    if (!formData.id && !formData.archivo) newErrors.archivo = 'Debes subir un PDF o imagen.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((p) => ({ ...p, archivo: file }));
    if (errors.archivo) setErrors((p) => ({ ...p, archivo: null }));
  };

  const resetForm = () => {
    setFormData({ id: null, mascota_id: '', tipo_examen: '', fecha: '', notas: '', archivo: null });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);

    try {
      const fd = new FormData();
      fd.append('mascota_id', formData.mascota_id);
      fd.append('tipo_examen', formData.tipo_examen);
      if (formData.fecha) fd.append('fecha', formData.fecha);
      fd.append('notas', formData.notas || '');
      if (formData.archivo) fd.append('archivo', formData.archivo);

      if (formData.id) {
        await actualizarResultadoLab(formData.id, fd);
        alert('Resultado actualizado.');
      } else {
        await crearResultadoLab(fd);
        alert('Resultado subido.');
      }

      resetForm();
      const rRes = await obtenerResultadosLab('');
      setResultados(rRes.data || []);
    } catch (err) {
      console.error('Error guardando:', err);
      alert(err?.response?.data?.message || 'Error al guardar resultado.');
    }
  };

  const handleEdit = (r) => {
    setFormData({
      id: r.id,
      mascota_id: String(r.mascota_id),
      tipo_examen: r.tipo_examen || '',
      fecha: r.fecha ? String(r.fecha).slice(0, 10) : '',
      notas: r.notas || '',
      archivo: null,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (user?.rol !== 'admin') {
      alert('Solo el admin puede eliminar resultados.');
      return;
    }
    if (!window.confirm('¿Eliminar este resultado de laboratorio?')) return;

    try {
      await eliminarResultadoLab(id);
      const rRes = await obtenerResultadosLab('');
      setResultados(rRes.data || []);
      alert('Resultado eliminado.');
    } catch (err) {
      console.error('Error eliminando:', err);
      alert(err?.response?.data?.message || 'Error al eliminar.');
    }
  };

  const resultadosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return resultados.filter((r) => {
      const matchMascota = !filtroMascota || String(r.mascota_id) === String(filtroMascota);
      const matchText =
        (r.nombre_mascota || '').toLowerCase().includes(q) ||
        (r.tipo_examen || '').toLowerCase().includes(q) ||
        (r.notas || '').toLowerCase().includes(q);
      return matchMascota && matchText;
    });
  }, [resultados, busqueda, filtroMascota]);

  return (
    <Page>
      <TopBar>
        <div>
          <PageTitle>Laboratorio y resultados</PageTitle>
          <Subtitle>Sube y consulta exámenes (PDF o imagen) por mascota.</Subtitle>
        </div>

        <SoftPill title="Resumen">
          <Dot />
          <span>{resultadosFiltrados.length} resultado(s)</span>
        </SoftPill>
      </TopBar>

      <Grid>
        {/* Subir / Editar */}
        <Card>
          <CardHeader>
            <HeaderTitle>
              <Accent />
              {formData.id ? 'Editar resultado' : 'Subir resultado'}
            </HeaderTitle>
            <HeaderRight>{formData.id ? 'Editar' : 'Nuevo'}</HeaderRight>
          </CardHeader>

          <CardBody>
            <SectionTitle style={{ marginBottom: 12 }}>
              {formData.id ? 'Actualiza los datos' : 'Carga un archivo'}
            </SectionTitle>

            <Form onSubmit={handleSubmit} noValidate>
              <FormGroup>
                <Select name="mascota_id" value={formData.mascota_id} onChange={handleChange}>
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
                  name="tipo_examen"
                  placeholder="Tipo de examen (Ej: Hemograma, Rayos X...)"
                  value={formData.tipo_examen}
                  onChange={handleChange}
                />
                <ErrorMessage>{errors.tipo_examen}</ErrorMessage>
              </FormGroup>

              <FormGroup>
                <Input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
              </FormGroup>

              <FormGroup>
                <TextArea
                  name="notas"
                  placeholder="Notas (opcional)"
                  value={formData.notas}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <FileDrop>
                  <FileLine>
                    <div style={{ fontWeight: 900, color: colors.textPrimary }}>
                      Archivo (PDF / imagen)
                    </div>
                    <Badge
                      bg="rgba(66,168,161,0.10)"
                      color={colors.primary}
                      bd="rgba(66,168,161,0.20)"
                    >
                      10MB máx
                    </Badge>
                  </FileLine>

                  <div style={{ marginTop: 10 }}>
                    <Input type="file" onChange={handleFile} />
                    <ErrorMessage>{errors.archivo}</ErrorMessage>
                    <SmallHint>
                      {formData.id
                        ? 'Si no subes archivo, se mantiene el anterior.'
                        : 'Obligatorio para registrar el resultado.'}
                    </SmallHint>
                  </div>
                </FileDrop>
              </FormGroup>

              <ActionsRow>
                <SubmitButton type="submit">
                  {formData.id ? 'Guardar cambios' : 'Subir resultado'}
                </SubmitButton>

                {formData.id && (
                  <>
                    <SoftBtn type="button" onClick={resetForm}>
                      Cancelar
                    </SoftBtn>
                    <DangerBtn type="button" onClick={() => handleDelete(formData.id)}>
                      Eliminar (admin)
                    </DangerBtn>
                  </>
                )}
              </ActionsRow>
            </Form>
          </CardBody>
        </Card>

        {/* Resultados */}
        <Card>
          <CardHeader>
            <HeaderTitle>
              <Accent />
              Resultados guardados
            </HeaderTitle>
            <HeaderRight>{resultadosFiltrados.length}</HeaderRight>
          </CardHeader>

          <CardBody>
            <Filters>
              <Select value={filtroMascota} onChange={(e) => setFiltroMascota(e.target.value)}>
                <option value="">Todas las mascotas</option>
                {mascotas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </Select>

              <SearchInput
                type="text"
                placeholder="Buscar por mascota, tipo examen, notas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Filters>

            {resultadosFiltrados.length === 0 ? (
              <EmptyState icon="🧪">No se encontraron resultados.</EmptyState>
            ) : (
              <ResultGrid>
                {resultadosFiltrados.map((r) => {
                  const isImg = isProbablyImage(r.archivo_url);
                  const fechaTxt = r.fecha ? new Date(r.fecha).toLocaleDateString() : '';

                  return (
                    <ResultCard key={r.id}>
                      <ResultTop>
                        <div>
                          <ResultTitle>
                            {r.nombre_mascota || 'Mascota'} • {r.tipo_examen}
                          </ResultTitle>
                          <ResultMeta>{fechaTxt}</ResultMeta>
                        </div>

                        <Badge
                          bg={isImg ? 'rgba(39,174,96,0.10)' : 'rgba(243,156,18,0.10)'}
                          color={isImg ? 'rgba(39,174,96,1)' : 'rgba(243,156,18,1)'}
                          bd={isImg ? 'rgba(39,174,96,0.20)' : 'rgba(243,156,18,0.20)'}
                        >
                          {isImg ? 'IMAGEN' : 'PDF'}
                        </Badge>
                      </ResultTop>

                      <ResultBody>
                        <PreviewRow>
                          <Thumb>
                            {isImg ? <img src={r.archivo_url} alt="preview" /> : <div>PDF</div>}
                          </Thumb>

                          <div style={{ flex: 1 }}>
                            <Notes>
                              {r.notas?.trim()
                                ? r.notas
                                : 'Sin notas. (Puedes editar y agregar observaciones).'}
                            </Notes>

                            <LinkBtn href={r.archivo_url} target="_blank" rel="noreferrer">
                              🔗 Abrir archivo
                            </LinkBtn>

                            <ResultActions>
                              <TinyBtn onClick={() => handleEdit(r)} hoverBd={colors.primary}>
                                Editar
                              </TinyBtn>

                              <TinyBtn
                                onClick={() => handleDelete(r.id)}
                                bg="rgba(231,76,60,0.08)"
                                color={colors.danger}
                                bd="rgba(231,76,60,0.18)"
                                hoverBd={colors.danger}
                                title={user?.rol === 'admin' ? 'Eliminar' : 'Solo admin puede eliminar'}
                              >
                                {user?.rol === 'admin' ? 'Eliminar' : 'Eliminar (admin)'}
                              </TinyBtn>
                            </ResultActions>
                          </div>
                        </PreviewRow>
                      </ResultBody>
                    </ResultCard>
                  );
                })}
              </ResultGrid>
            )}
          </CardBody>
        </Card>
      </Grid>
    </Page>
  );
}
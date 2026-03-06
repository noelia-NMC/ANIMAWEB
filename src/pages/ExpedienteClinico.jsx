// src/pages/ExpedienteClinico.jsx
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

// Historial (notas clínicas)
import {
  obtenerHistorial,
  registrarHistorial,
  actualizarHistorial,
  eliminarHistorial,
  obtenerMascotas,
} from '../services/historial';

// Laboratorio (resultados)
import {
  obtenerResultadosLab,
  crearResultadoLab,
  actualizarResultadoLab,
  eliminarResultadoLab,
} from '../services/laboratorio';

// Reusamos estilo de CRUD (inputs, textos, etc.)
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
};

// =====================
// helpers
// =====================
function isProbablyImage(url = '') {
  const u = String(url).toLowerCase();
  return u.endsWith('.png') || u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.webp');
}

function safeText(v) {
  return String(v ?? '').trim();
}

function truncateText(text, maxChars = 220) {
  const t = safeText(text);
  if (!t) return '';
  if (t.length <= maxChars) return t;
  return t.slice(0, maxChars).trimEnd() + '…';
}

// =====================
// layout
// =====================
const PageWrap = styled.div`
  width: 100%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Tabs = styled.div`
  display: inline-flex;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

const TabBtn = styled.button`
  border: none;
  background: ${(p) => (p.$active ? colors.white : colors.background)};
  color: ${colors.textPrimary};
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  border-right: 1px solid ${colors.border};

  &:last-child {
    border-right: none;
  }
`;

const FiltersBar = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 0.8rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WorkGrid = styled.div`
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 1rem;

  @media (max-width: 1150px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const PanelHead = styled.div`
  padding: 0.9rem 1rem;
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: ${colors.background};
  flex: 0 0 auto;
`;

const PanelTitle = styled.div`
  font-weight: 700;
  color: ${colors.textPrimary};
`;

const Counter = styled.div`
  font-weight: 700;
  color: ${colors.textSecondary};
  font-size: 1rem;
`;

const PanelBody = styled.div`
  padding: 1rem;
  flex: 1 1 auto;
  min-height: 0;
`;

// ✅ Scroll propio solo para la lista
const ListScroll = styled.div`
  height: calc(100vh - 320px);
  overflow: auto;
  padding-right: 6px;
  scroll-behavior: smooth;

  @media (max-width: 1150px) {
    height: 420px;
  }

  @media (max-width: 650px) {
    height: 360px;
  }
`;

const List = styled.div`
  display: grid;
  gap: 0.75rem;
`;

const Item = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 0.85rem;
  background: ${colors.white};
  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    border-color: rgba(66, 168, 161, 0.35);
    background: ${colors.background};
  }
`;

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
`;

const ItemTitle = styled.div`
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 1.2;
`;

const ItemMeta = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  text-align: right;
  white-space: nowrap;
`;

const ItemDesc = styled.div`
  margin-top: 0.45rem;
  color: ${colors.textSecondary};
  font-size: 0.92rem;
  line-height: 1.25;
  white-space: pre-wrap;
`;

const RowBtns = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
`;

const SoftBtn = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textPrimary};
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.88rem;

  &:hover {
    border-color: rgba(66, 168, 161, 0.35);
    background: ${colors.background};
  }
`;

const DangerBtn = styled.button`
  border: 1px solid rgba(231, 76, 60, 0.25);
  background: rgba(231, 76, 60, 0.08);
  color: ${colors.danger};
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.88rem;

  &:hover {
    border-color: rgba(231, 76, 60, 0.4);
  }
`;

const MiniBtn = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.primary};
  padding: 0.5rem 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.88rem;

  &:hover {
    border-color: rgba(66, 168, 161, 0.35);
    background: ${colors.background};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${colors.border};
  margin: 0.85rem 0;
`;

const FileBox = styled.div`
  border: 1px dashed ${colors.border};
  background: ${colors.background};
  border-radius: 12px;
  padding: 0.75rem;
`;

const FileLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const FileHint = styled.div`
  margin-top: 0.4rem;
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  line-height: 1.25;
`;

const LinkA = styled.a`
  color: ${colors.primary};
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

// =====================
// MODAL (Ver más)
// =====================
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(44, 62, 80, 0.35);
  display: grid;
  place-items: center;
  z-index: 2000;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: min(820px, 100%);
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(0,0,0,0.18);
`;

const ModalHead = styled.div`
  padding: 0.9rem 1rem;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 520px) {
    align-items: center;
  }
`;

const ModalLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ModalTitle = styled.div`
  font-weight: 800;
  color: ${colors.textPrimary};
`;

const ModalMeta = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.92rem;
`;

const ModalClose = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textPrimary};
  border-radius: 10px;
  padding: 0.45rem 0.7rem;
  cursor: pointer;
  font-weight: 900;

  &:hover {
    background: ${colors.background};
  }
`;

const ModalBody = styled.div`
  padding: 1rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textPrimary};
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.9rem;

  &:hover {
    border-color: rgba(66, 168, 161, 0.35);
    background: ${colors.background};
  }
`;

const ActionDanger = styled.button`
  border: 1px solid rgba(231, 76, 60, 0.25);
  background: rgba(231, 76, 60, 0.08);
  color: ${colors.danger};
  padding: 0.55rem 0.85rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 900;
  font-size: 0.9rem;

  &:hover {
    border-color: rgba(231, 76, 60, 0.45);
  }
`;

// Switch (Texto completo / Resumen)
const SwitchWrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  user-select: none;
`;

const SwitchLabel = styled.div`
  font-weight: 800;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
`;

const SwitchTrack = styled.button`
  width: 46px;
  height: 26px;
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${(p) => (p.$on ? 'rgba(66,168,161,0.18)' : colors.background)};
  position: relative;
  cursor: pointer;
  padding: 0;

  &:hover {
    border-color: rgba(66, 168, 161, 0.35);
  }
`;

const SwitchKnob = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: ${(p) => (p.$on ? '22px' : '3px')};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: left 0.18s ease;
`;

const ModalSection = styled.div`
  margin-top: 10px;
`;

const ModalLabel = styled.div`
  font-weight: 900;
  color: ${colors.textPrimary};
  margin-bottom: 6px;
`;

const ModalScroll = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 12px;
  background: ${colors.white};
  max-height: 50vh;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.35;
  color: ${colors.textSecondary};
`;

// =====================
// componente
// =====================
export default function ExpedienteClinico() {
  const { user } = useAuth();

  const [tab, setTab] = useState('notas'); // 'notas' | 'resultados'
  const [mascotas, setMascotas] = useState([]);

  const [notas, setNotas] = useState([]);
  const [resultados, setResultados] = useState([]);

  const [filtroMascota, setFiltroMascota] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // ✅ Modal "Ver más" (solo para notas)
  const [modalNota, setModalNota] = useState(null);
  const [modalFull, setModalFull] = useState(true); // ✅ switch: completo / resumen
  const [modalBusy, setModalBusy] = useState(false); // deshabilitar botones cuando elimina

  // form notas
  const [notaForm, setNotaForm] = useState({
    id: null,
    mascota_id: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  });
  const [notaErrors, setNotaErrors] = useState({});

  // form lab
  const [labForm, setLabForm] = useState({
    id: null,
    mascota_id: '',
    tipo_examen: '',
    fecha: '',
    notas: '',
    archivo: null,
    archivo_url_actual: '',
  });
  const [labErrors, setLabErrors] = useState({});

  const cargarTodo = async () => {
    try {
      const [mRes, hRes, rRes] = await Promise.all([
        obtenerMascotas(),
        obtenerHistorial(),
        obtenerResultadosLab(''),
      ]);

      setMascotas(mRes.data || []);
      setNotas(hRes.data || []);
      setResultados(rRes.data || []);
    } catch (e) {
      console.error('Error cargando expediente:', e);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  // ✅ cerrar modal con ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeNotaModal();
    };
    if (modalNota) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalNota]);

  const closeNotaModal = () => {
    setModalNota(null);
    setModalFull(true);
    setModalBusy(false);
  };

  // filtros
  const notasFiltradas = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return (notas || []).filter((n) => {
      const okMascota = !filtroMascota || String(n.mascota_id) === String(filtroMascota);
      const okText =
        (n.nombre_mascota || '').toLowerCase().includes(q) ||
        (n.diagnostico || '').toLowerCase().includes(q) ||
        (n.tratamiento || '').toLowerCase().includes(q) ||
        (n.observaciones || '').toLowerCase().includes(q);
      return okMascota && okText;
    });
  }, [notas, filtroMascota, busqueda]);

  const resultadosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    return (resultados || []).filter((r) => {
      const okMascota = !filtroMascota || String(r.mascota_id) === String(filtroMascota);
      const okText =
        (r.nombre_mascota || '').toLowerCase().includes(q) ||
        (r.tipo_examen || '').toLowerCase().includes(q) ||
        (r.notas || '').toLowerCase().includes(q);
      return okMascota && okText;
    });
  }, [resultados, filtroMascota, busqueda]);

  const listData = tab === 'notas' ? notasFiltradas : resultadosFiltrados;

  // resets
  const resetNota = () => {
    setNotaForm({ id: null, mascota_id: '', diagnostico: '', tratamiento: '', observaciones: '' });
    setNotaErrors({});
  };

  const resetLab = () => {
    setLabForm({
      id: null,
      mascota_id: '',
      tipo_examen: '',
      fecha: '',
      notas: '',
      archivo: null,
      archivo_url_actual: '',
    });
    setLabErrors({});
  };

  // submit NOTAS
  const validateNota = () => {
    const e = {};
    if (!notaForm.mascota_id) e.mascota_id = 'Debe seleccionar una mascota.';
    if (!notaForm.diagnostico.trim() || notaForm.diagnostico.trim().length < 5) {
      e.diagnostico = 'El diagnóstico es obligatorio (mín. 5 caracteres).';
    }
    if (!notaForm.tratamiento.trim() || notaForm.tratamiento.trim().length < 5) {
      e.tratamiento = 'El tratamiento es obligatorio (mín. 5 caracteres).';
    }
    return e;
  };

  const submitNota = async (ev) => {
    ev.preventDefault();
    const e = validateNota();
    if (Object.keys(e).length) return setNotaErrors(e);

    try {
      if (notaForm.id) {
        await actualizarHistorial(notaForm.id, notaForm);
        alert('Nota clínica actualizada.');
      } else {
        await registrarHistorial(notaForm);
        alert('Nota clínica registrada.');
      }
      resetNota();
      const hRes = await obtenerHistorial();
      setNotas(hRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error guardando nota clínica.');
    }
  };

  const editNota = (n) => {
    setTab('notas');
    setNotaForm({
      id: n.id,
      mascota_id: String(n.mascota_id),
      diagnostico: n.diagnostico || '',
      tratamiento: n.tratamiento || '',
      observaciones: n.observaciones || '',
    });
    setNotaErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const delNota = async (id) => {
    if (!window.confirm('¿Eliminar esta nota clínica?')) return;
    try {
      await eliminarHistorial(id);
      const hRes = await obtenerHistorial();
      setNotas(hRes.data || []);
      alert('Nota eliminada.');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error eliminando nota.');
    }
  };

  // submit LAB
  const validateLab = () => {
    const e = {};
    if (!labForm.mascota_id) e.mascota_id = 'Debe seleccionar una mascota.';
    if (!labForm.tipo_examen.trim() || labForm.tipo_examen.trim().length < 3) {
      e.tipo_examen = 'Tipo de examen obligatorio (mín. 3 caracteres).';
    }
    if (!labForm.id && !labForm.archivo) e.archivo = 'Debes subir un PDF o imagen.';
    return e;
  };

  const submitLab = async (ev) => {
    ev.preventDefault();
    const e = validateLab();
    if (Object.keys(e).length) return setLabErrors(e);

    try {
      const fd = new FormData();
      fd.append('mascota_id', labForm.mascota_id);
      fd.append('tipo_examen', labForm.tipo_examen);
      if (labForm.fecha) fd.append('fecha', labForm.fecha);
      fd.append('notas', labForm.notas || '');
      if (labForm.archivo) fd.append('archivo', labForm.archivo);

      if (labForm.id) {
        await actualizarResultadoLab(labForm.id, fd);
        alert('Resultado actualizado.');
      } else {
        await crearResultadoLab(fd);
        alert('Resultado subido.');
      }

      resetLab();
      const rRes = await obtenerResultadosLab('');
      setResultados(rRes.data || []);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error guardando resultado.');
    }
  };

  const editLab = (r) => {
    setTab('resultados');
    setLabForm({
      id: r.id,
      mascota_id: String(r.mascota_id),
      tipo_examen: r.tipo_examen || '',
      fecha: r.fecha ? String(r.fecha).slice(0, 10) : '',
      notas: r.notas || '',
      archivo: null,
      archivo_url_actual: r.archivo_url || '',
    });
    setLabErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const delLab = async (id) => {
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
      console.error(err);
      alert(err?.response?.data?.message || 'Error eliminando resultado.');
    }
  };

  const openNotaModal = (nota) => {
    setModalNota(nota);
    setModalFull(true);
    setModalBusy(false);
  };

  // ✅ acciones PRO dentro del modal
  const modalEdit = () => {
    if (!modalNota) return;
    editNota(modalNota);
    closeNotaModal();
  };

  const modalDelete = async () => {
    if (!modalNota) return;
    if (!window.confirm('¿Eliminar esta nota clínica?')) return;

    setModalBusy(true);
    try {
      await eliminarHistorial(modalNota.id);

      // refrescar
      const hRes = await obtenerHistorial();
      setNotas(hRes.data || []);

      // si justo estabas editando esa nota, resetea form
      if (notaForm?.id === modalNota.id) resetNota();

      alert('Nota eliminada.');
      closeNotaModal();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Error eliminando nota.');
      setModalBusy(false);
    }
  };

  return (
    <PageWrap>
      <TopRow>
        <div>
          <PageTitle>Expediente clínico</PageTitle>
        </div>

        <Tabs>
          <TabBtn type="button" $active={tab === 'notas'} onClick={() => setTab('notas')}>
            Notas
          </TabBtn>
          <TabBtn type="button" $active={tab === 'resultados'} onClick={() => setTab('resultados')}>
            Resultados
          </TabBtn>
        </Tabs>
      </TopRow>

      <FiltersBar>
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
          placeholder="Buscar por texto (diagnóstico, tratamiento, tipo examen, notas...)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </FiltersBar>

      <WorkGrid>
        {/* FORM (izquierda) */}
        <Panel>
          <PanelHead>
            <PanelTitle>
              {tab === 'notas'
                ? notaForm.id ? 'Editar nota clínica' : 'Nueva nota clínica'
                : labForm.id ? 'Editar resultado' : 'Nuevo resultado'}
            </PanelTitle>
            <Counter>{tab === 'notas' ? 'Historial' : 'Laboratorio'}</Counter>
          </PanelHead>

          <PanelBody>
            {tab === 'notas' ? (
              <>
                <SectionTitle style={{ marginBottom: 12 }}>Registro clínico</SectionTitle>

                <Form onSubmit={submitNota} noValidate>
                  <FormGroup>
                    <Select
                      name="mascota_id"
                      value={notaForm.mascota_id}
                      onChange={(e) => {
                        setNotaForm((p) => ({ ...p, mascota_id: e.target.value }));
                        if (notaErrors.mascota_id) setNotaErrors((p) => ({ ...p, mascota_id: null }));
                      }}
                    >
                      <option value="">Seleccione una mascota</option>
                      {mascotas.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{notaErrors.mascota_id}</ErrorMessage>
                  </FormGroup>

                  <FormGroup>
                    <Input
                      name="diagnostico"
                      placeholder="Diagnóstico"
                      value={notaForm.diagnostico}
                      onChange={(e) => {
                        setNotaForm((p) => ({ ...p, diagnostico: e.target.value }));
                        if (notaErrors.diagnostico) setNotaErrors((p) => ({ ...p, diagnostico: null }));
                      }}
                    />
                    <ErrorMessage>{notaErrors.diagnostico}</ErrorMessage>
                  </FormGroup>

                  <FormGroup>
                    <Input
                      name="tratamiento"
                      placeholder="Tratamiento"
                      value={notaForm.tratamiento}
                      onChange={(e) => {
                        setNotaForm((p) => ({ ...p, tratamiento: e.target.value }));
                        if (notaErrors.tratamiento) setNotaErrors((p) => ({ ...p, tratamiento: null }));
                      }}
                    />
                    <ErrorMessage>{notaErrors.tratamiento}</ErrorMessage>
                  </FormGroup>

                  <FormGroup>
                    <TextArea
                      name="observaciones"
                      placeholder="Observaciones (opcional)"
                      value={notaForm.observaciones}
                      onChange={(e) => setNotaForm((p) => ({ ...p, observaciones: e.target.value }))}
                    />
                  </FormGroup>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                    <SubmitButton type="submit">
                      {notaForm.id ? 'Guardar cambios' : 'Registrar nota'}
                    </SubmitButton>

                    {notaForm.id && (
                      <SoftBtn type="button" onClick={resetNota}>
                        Cancelar
                      </SoftBtn>
                    )}
                  </div>
                </Form>
              </>
            ) : (
              <>
                <SectionTitle style={{ marginBottom: 12 }}>Resultado / Archivo</SectionTitle>

                <Form onSubmit={submitLab} noValidate>
                  <FormGroup>
                    <Select
                      name="mascota_id"
                      value={labForm.mascota_id}
                      onChange={(e) => {
                        setLabForm((p) => ({ ...p, mascota_id: e.target.value }));
                        if (labErrors.mascota_id) setLabErrors((p) => ({ ...p, mascota_id: null }));
                      }}
                    >
                      <option value="">Seleccione una mascota</option>
                      {mascotas.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </Select>
                    <ErrorMessage>{labErrors.mascota_id}</ErrorMessage>
                  </FormGroup>

                  <FormGroup>
                    <Input
                      name="tipo_examen"
                      placeholder="Tipo de examen (Rayos X, Hemograma...)"
                      value={labForm.tipo_examen}
                      onChange={(e) => {
                        setLabForm((p) => ({ ...p, tipo_examen: e.target.value }));
                        if (labErrors.tipo_examen) setLabErrors((p) => ({ ...p, tipo_examen: null }));
                      }}
                    />
                    <ErrorMessage>{labErrors.tipo_examen}</ErrorMessage>
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="date"
                      name="fecha"
                      value={labForm.fecha}
                      onChange={(e) => setLabForm((p) => ({ ...p, fecha: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <TextArea
                      name="notas"
                      placeholder="Notas (opcional)"
                      value={labForm.notas}
                      onChange={(e) => setLabForm((p) => ({ ...p, notas: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FileBox>
                      <FileLine>
                        <div style={{ fontWeight: 700, color: colors.textPrimary }}>
                          Archivo (PDF o imagen)
                        </div>

                        {labForm.id && labForm.archivo_url_actual ? (
                          <LinkA href={labForm.archivo_url_actual} target="_blank" rel="noreferrer">
                            Ver actual
                          </LinkA>
                        ) : null}
                      </FileLine>

                      <div style={{ marginTop: 10 }}>
                        <Input
                          type="file"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            setLabForm((p) => ({ ...p, archivo: f }));
                            if (labErrors.archivo) setLabErrors((p) => ({ ...p, archivo: null }));
                          }}
                        />
                        <ErrorMessage>{labErrors.archivo}</ErrorMessage>

                        <FileHint>
                          {labForm.id
                            ? 'Si no subes archivo, se mantiene el anterior.'
                            : 'Obligatorio para registrar el resultado.'}
                        </FileHint>
                      </div>
                    </FileBox>
                  </FormGroup>

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                    <SubmitButton type="submit">
                      {labForm.id ? 'Guardar cambios' : 'Subir resultado'}
                    </SubmitButton>

                    {labForm.id && (
                      <>
                        <SoftBtn type="button" onClick={resetLab}>
                          Cancelar
                        </SoftBtn>

                        <DangerBtn
                          type="button"
                          onClick={() => delLab(labForm.id)}
                          title={user?.rol === 'admin' ? 'Eliminar' : 'Solo admin'}
                        >
                          {user?.rol === 'admin' ? 'Eliminar' : 'Eliminar (admin)'}
                        </DangerBtn>
                      </>
                    )}
                  </div>
                </Form>
              </>
            )}
          </PanelBody>
        </Panel>

        {/* LISTA (derecha) con scroll propio */}
        <Panel>
          <PanelHead>
            <PanelTitle>{tab === 'notas' ? 'Notas registradas' : 'Resultados guardados'}</PanelTitle>
            <Counter>{listData.length}</Counter>
          </PanelHead>

          <PanelBody>
            {listData.length === 0 ? (
              <EmptyState icon={tab === 'notas' ? '📋' : '🧪'}>
                {tab === 'notas' ? 'No hay notas clínicas.' : 'No hay resultados de laboratorio.'}
              </EmptyState>
            ) : (
              <ListScroll>
                <List>
                  {tab === 'notas' &&
                    notasFiltradas.map((n) => {
                      const dx = safeText(n.diagnostico);
                      const tx = safeText(n.tratamiento);
                      const obs = safeText(n.observaciones);

                      const dxShort = truncateText(dx, 140);
                      const txShort = truncateText(tx, 140);
                      const obsShort = truncateText(obs, 170);

                      const hasLong = dx.length > 140 || tx.length > 140 || obs.length > 170;

                      return (
                        <Item key={n.id} onClick={() => editNota(n)} title="Click para editar">
                          <ItemTop>
                            <div>
                              <ItemTitle>{n.nombre_mascota || 'Mascota'}</ItemTitle>
                              <ItemDesc>
                                <b>Dx:</b> {dxShort || '-'} <br />
                                <b>Tx:</b> {txShort || '-'}
                              </ItemDesc>
                            </div>

                            <ItemMeta>
                              {n.fecha ? new Date(n.fecha).toLocaleDateString() : ''}
                            </ItemMeta>
                          </ItemTop>

                          {obs && (
                            <>
                              <Divider />
                              <ItemDesc>{obsShort}</ItemDesc>
                            </>
                          )}

                          <RowBtns>
                            {hasLong && (
                              <MiniBtn
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openNotaModal(n);
                                }}
                              >
                                Ver más
                              </MiniBtn>
                            )}

                            <SoftBtn
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                editNota(n);
                              }}
                            >
                              Editar
                            </SoftBtn>

                            <DangerBtn
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                delNota(n.id);
                              }}
                            >
                              Eliminar
                            </DangerBtn>
                          </RowBtns>
                        </Item>
                      );
                    })}

                  {tab === 'resultados' &&
                    resultadosFiltrados.map((r) => {
                      const isImg = isProbablyImage(r.archivo_url);
                      const notasTxt = safeText(r.notas);
                      const notasShow = truncateText(notasTxt, 240);

                      return (
                        <Item key={r.id} onClick={() => editLab(r)} title="Click para editar">
                          <ItemTop>
                            <div>
                              <ItemTitle>
                                {r.nombre_mascota || 'Mascota'} • {r.tipo_examen || 'Examen'}
                              </ItemTitle>

                              <ItemDesc style={{ marginTop: 6 }}>
                                {notasShow || 'Sin notas.'}
                              </ItemDesc>

                              {r.archivo_url && (
                                <div style={{ marginTop: 8 }}>
                                  <LinkA href={r.archivo_url} target="_blank" rel="noreferrer">
                                    Abrir archivo ({isImg ? 'Imagen' : 'PDF'})
                                  </LinkA>
                                </div>
                              )}
                            </div>

                            <ItemMeta>
                              {r.fecha ? new Date(r.fecha).toLocaleDateString() : ''}
                            </ItemMeta>
                          </ItemTop>

                          <RowBtns>
                            <SoftBtn
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                editLab(r);
                              }}
                            >
                              Editar
                            </SoftBtn>

                            <DangerBtn
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                delLab(r.id);
                              }}
                              title={user?.rol === 'admin' ? 'Eliminar' : 'Solo admin'}
                            >
                              {user?.rol === 'admin' ? 'Eliminar' : 'Eliminar (admin)'}
                            </DangerBtn>
                          </RowBtns>
                        </Item>
                      );
                    })}
                </List>
              </ListScroll>
            )}
          </PanelBody>
        </Panel>
      </WorkGrid>

      {/* ✅ MODAL VER MÁS (NOTAS) */}
      {modalNota && (
        <ModalOverlay
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeNotaModal();
          }}
        >
          <ModalCard>
            <ModalHead>
              <ModalLeft>
                <ModalTitle>Nota clínica • {modalNota.nombre_mascota || 'Mascota'}</ModalTitle>
                <ModalMeta>
                  {modalNota.fecha ? new Date(modalNota.fecha).toLocaleDateString() : ''}
                </ModalMeta>
              </ModalLeft>

              <ModalClose type="button" onClick={closeNotaModal} disabled={modalBusy}>
                ✕
              </ModalClose>
            </ModalHead>

            <ModalBody>
              <ModalActions>
                <ActionGroup>
                  <ActionBtn type="button" onClick={modalEdit} disabled={modalBusy}>
                    Editar esta nota
                  </ActionBtn>

                  <ActionDanger type="button" onClick={modalDelete} disabled={modalBusy}>
                    {modalBusy ? 'Eliminando…' : 'Eliminar'}
                  </ActionDanger>
                </ActionGroup>

                <SwitchWrap>
                  <SwitchLabel>{modalFull ? 'Texto completo' : 'Resumen'}</SwitchLabel>
                  <SwitchTrack
                    type="button"
                    $on={modalFull}
                    onClick={() => setModalFull((p) => !p)}
                    disabled={modalBusy}
                    aria-label="Cambiar vista texto completo/resumen"
                    title="Cambiar vista"
                  >
                    <SwitchKnob $on={modalFull} />
                  </SwitchTrack>
                </SwitchWrap>
              </ModalActions>

              <ModalSection>
                <ModalLabel>Diagnóstico</ModalLabel>
                <ModalScroll>
                  {modalFull
                    ? (safeText(modalNota.diagnostico) || '-')
                    : (truncateText(modalNota.diagnostico, 300) || '-')}
                </ModalScroll>
              </ModalSection>

              <ModalSection>
                <ModalLabel>Tratamiento</ModalLabel>
                <ModalScroll>
                  {modalFull
                    ? (safeText(modalNota.tratamiento) || '-')
                    : (truncateText(modalNota.tratamiento, 300) || '-')}
                </ModalScroll>
              </ModalSection>

              {safeText(modalNota.observaciones) ? (
                <ModalSection>
                  <ModalLabel>Observaciones</ModalLabel>
                  <ModalScroll>
                    {modalFull
                      ? safeText(modalNota.observaciones)
                      : truncateText(modalNota.observaciones, 420)}
                  </ModalScroll>
                </ModalSection>
              ) : null}
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageWrap>
  );
}
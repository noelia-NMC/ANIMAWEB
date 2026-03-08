import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as reportesService from '../services/reportes';

import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseBtn,
  Body,
  StickyTop,
  TopBar,
  LeftControls,
  RightControls,
  Group,
  Btn,
  GhostBtn,
  Chips,
  Chip,
  ExportBtns,
  Banner,
  ErrorBox,
  Stats,
  Stat,
  SectionsGrid,
  Section,
  ContentGrid,
  MiniCard,
  MiniTitle,
  List,
  Item,
  L,
  V,
  Search,
  LoadingCard,
} from '../styles/reportesDashboard.styles';

function fmtDate(fecha) {
  if (!fecha) return 's/f';
  try { return new Date(fecha).toLocaleDateString('es-ES'); }
  catch { return 's/f'; }
}

const DEFAULT_INCLUDE = {
  resumen: true,
  turnos: true,
  inventario: true,
  tele: true,
  lab: true,
  diag: true,
  vets: false,
};

export default function ReportesDashboard({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = String(user?.rol || '').toLowerCase() === 'admin';

  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState({ pdf: false, excel: false });
  const [error, setError] = useState('');

  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [bundle, setBundle] = useState(null);

  const [qStock, setQStock] = useState('');
  const [qLab, setQLab] = useState('');

  const [include, setInclude] = useState(DEFAULT_INCLUDE);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const hoy = new Date();
    const hace30 = new Date(hoy.getTime() - 30 * 24 * 60 * 60 * 1000);
    setFechaFin(hoy.toISOString().slice(0, 10));
    setFechaInicio(hace30.toISOString().slice(0, 10));
  }, []);

  const validateDates = () => {
    if (!fechaInicio || !fechaFin) {
      return 'Debes seleccionar fecha inicio y fecha fin.';
    }

    const ini = new Date(`${fechaInicio}T00:00:00`);
    const fin = new Date(`${fechaFin}T00:00:00`);

    if (Number.isNaN(ini.getTime()) || Number.isNaN(fin.getTime())) {
      return 'Rango de fechas inválido.';
    }

    if (ini > fin) {
      return 'La fecha inicio no puede ser mayor que la fecha fin.';
    }

    return '';
  };

  const cargar = async () => {
    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await reportesService.getReportesBundle(fechaInicio, fechaFin);
      setBundle(data);
    } catch (e) {
      console.error(e);
      setError(e?.message || 'Error cargando reportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && fechaInicio && fechaFin) cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, fechaInicio, fechaFin]);

  const dashboard = bundle?.base?.dashboard || {};
  const mascotasConsultadas = bundle?.base?.mascotasConsultadas || [];
  const tiposConsultas = bundle?.base?.tiposConsultas || [];
  const razasAtendidas = bundle?.base?.razasAtendidas || [];
  const turnosPorPeriodo = bundle?.turnosPorPeriodo || [];
  const actividadVeterinarios = bundle?.actividadVeterinarios || [];
  const stockBajo = bundle?.stockBajo || [];
  const movsStockResumen = bundle?.movsStockResumen || [];
  const topConsumidos = bundle?.topConsumidos || [];
  const teleconsultaEstados = bundle?.teleconsultaEstados || [];
  const labPorTipo = bundle?.labPorTipo || [];
  const labRecientes = bundle?.labRecientes || [];
  const diagnosticosTop = bundle?.diagnosticosTop || [];

  const stockBajoFiltrado = useMemo(() => {
    const q = qStock.trim().toLowerCase();
    return q
      ? stockBajo.filter((p) => `${p.nombre} ${p.categoria || ''}`.toLowerCase().includes(q))
      : stockBajo;
  }, [stockBajo, qStock]);

  const labRecientesFiltrado = useMemo(() => {
    const q = qLab.trim().toLowerCase();
    return q
      ? labRecientes.filter((r) => `${r.nombre_mascota} ${r.tipo_examen || ''}`.toLowerCase().includes(q))
      : labRecientes;
  }, [labRecientes, qLab]);

  const includeList = useMemo(
    () => Object.entries(include).filter(([, v]) => v).map(([k]) => k),
    [include]
  );

  const toggle = (key) => setInclude((p) => ({ ...p, [key]: !p[key] }));

  const setAll = (value) =>
    setInclude((p) => {
      const next = { ...p };
      Object.keys(next).forEach((k) => (next[k] = value));
      if (!isAdmin) next.vets = false;
      return next;
    });

  const handleExport = async (tipo) => {
    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      return;
    }

    if (!isAdmin) {
      setError('No tienes permisos para exportar. Pide acceso al admin.');
      return;
    }

    if (!includeList.length) {
      setError('Selecciona al menos 1 sección para exportar.');
      return;
    }

    setExporting((p) => ({ ...p, [tipo]: true }));
    setError('');

    try {
      await reportesService.exportarReporte(tipo, { fechaInicio, fechaFin, include: includeList });
    } catch (e) {
      setError(e?.message || `Error exportando ${tipo}`);
    } finally {
      setExporting((p) => ({ ...p, [tipo]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <h2>📊 Reportes</h2>
          </Title>
          <CloseBtn onClick={onClose} aria-label="Cerrar">×</CloseBtn>
        </Header>

        <Body>
          {!isAdmin && (
            <Banner>
              👀 Estás como <b>veterinario</b>. Puedes ver reportes, pero exportar es solo para admins.
            </Banner>
          )}

          <StickyTop>
            <TopBar>
              <LeftControls>
                <Group>
                  <label>Fecha inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value);
                      if (error) setError('');
                    }}
                  />
                </Group>

                <Group>
                  <label>Fecha fin</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value);
                      if (error) setError('');
                    }}
                  />
                </Group>

                <Btn onClick={cargar} disabled={loading}>
                  {loading ? '🔄 Cargando…' : '↻ Actualizar'}
                </Btn>
              </LeftControls>

              <RightControls>
                <Chips>
                  <div className="chipsHead">
                    <span className="ttl">Secciones</span>
                    <div className="miniBtns">
                      <GhostBtn type="button" onClick={() => setAll(true)}>✅ Todo</GhostBtn>
                      <GhostBtn type="button" onClick={() => setAll(false)}>🚫 Nada</GhostBtn>
                    </div>
                  </div>

                  <div className="chipsGrid">
                    <Chip $on={include.resumen} onClick={() => toggle('resumen')}>Resumen</Chip>
                    <Chip $on={include.turnos} onClick={() => toggle('turnos')}>Turnos</Chip>
                    <Chip $on={include.inventario} onClick={() => toggle('inventario')}>Inventario</Chip>
                    <Chip $on={include.tele} onClick={() => toggle('tele')}>Tele</Chip>
                    <Chip $on={include.lab} onClick={() => toggle('lab')}>Lab</Chip>
                    <Chip $on={include.diag} onClick={() => toggle('diag')}>Diagnósticos</Chip>
                    <Chip
                      $on={include.vets}
                      $disabled={!isAdmin}
                      onClick={() => isAdmin && toggle('vets')}
                      title={!isAdmin ? 'Solo admin' : ''}
                    >
                      Vets
                    </Chip>
                  </div>
                </Chips>

                <ExportBtns>
                  <Btn $v="ok" onClick={() => handleExport('pdf')} disabled={!isAdmin || exporting.pdf}>
                    {exporting.pdf ? '⏳ PDF…' : '📄 PDF'}
                  </Btn>
                  <Btn $v="info" onClick={() => handleExport('excel')} disabled={!isAdmin || exporting.excel}>
                    {exporting.excel ? '⏳ Excel…' : '📊 Excel'}
                  </Btn>
                </ExportBtns>
              </RightControls>
            </TopBar>
          </StickyTop>

          {error && <ErrorBox>{error}</ErrorBox>}
          {loading && <LoadingCard>Cargando reportes…</LoadingCard>}

          {!loading && bundle && (
            <>
              <Stats>
                <Stat $c="primary">
                  <div className="val">{dashboard.totalMascotas || 0}</div>
                  <div className="lab">Mascotas</div>
                </Stat>
                <Stat $c="ok">
                  <div className="val">{dashboard.turnosEsteMes || 0}</div>
                  <div className="lab">Turnos este mes</div>
                </Stat>
                <Stat $c="info">
                  <div className="val">{dashboard.veterinariosActivos || 0}</div>
                  <div className="lab">Veterinarios</div>
                </Stat>
                <Stat $c="accent">
                  <div className="val">{dashboard.turnosPendientes || 0}</div>
                  <div className="lab">Pendientes</div>
                </Stat>
              </Stats>

              <SectionsGrid>
                <Section open>
                  <summary>
                    <span>📌 Resumen</span>
                    <span className="right">clic para colapsar</span>
                  </summary>
                  <div className="content">
                    <ContentGrid>
                      <MiniCard>
                        <MiniTitle>
                          <div>🐾 Mascotas más consultadas</div>
                          <span>{mascotasConsultadas.length}</span>
                        </MiniTitle>
                        <List>
                          {mascotasConsultadas.length
                            ? mascotasConsultadas.map((m, i) => (
                                <Item key={i}>
                                  <L>{m.mascota} ({m.raza})</L>
                                  <V>{m.total_consultas}×</V>
                                </Item>
                              ))
                            : <L>No hay datos</L>}
                        </List>
                      </MiniCard>

                      <MiniCard>
                        <MiniTitle>
                          <div>📊 Motivos frecuentes</div>
                          <span>{tiposConsultas.length}</span>
                        </MiniTitle>
                        <List>
                          {tiposConsultas.length
                            ? tiposConsultas.map((t, i) => (
                                <Item key={i}>
                                  <L>{t.motivo}</L>
                                  <V>{t.cantidad} ({t.porcentaje || 0}%)</V>
                                </Item>
                              ))
                            : <L>No hay datos</L>}
                        </List>
                      </MiniCard>

                      <MiniCard style={{ gridColumn: '1 / -1' }}>
                        <MiniTitle>
                          <div>🐕 Razas más atendidas</div>
                          <span>{razasAtendidas.length}</span>
                        </MiniTitle>
                        <List>
                          {razasAtendidas.length
                            ? razasAtendidas.map((r, i) => (
                                <Item key={i}>
                                  <L>{r.raza}</L>
                                  <V>{r.total_consultas}</V>
                                </Item>
                              ))
                            : <L>No hay datos</L>}
                        </List>
                      </MiniCard>
                    </ContentGrid>
                  </div>
                </Section>

                <Section>
                  <summary>
                    <span>📦 Inventario</span>
                    <span className="right">clic para ver</span>
                  </summary>
                  <div className="content">
                    <ContentGrid>
                      <MiniCard>
                        <MiniTitle>
                          <div>Stock bajo</div>
                          <Search
                            placeholder="Buscar producto / categoría…"
                            value={qStock}
                            onChange={(e) => setQStock(e.target.value)}
                          />
                        </MiniTitle>
                        <List>
                          {stockBajoFiltrado.length
                            ? stockBajoFiltrado.map((p, i) => (
                                <Item key={i}>
                                  <L>{p.nombre}</L>
                                  <V style={{ color: p.stock_actual <= 0 ? '#dc2626' : undefined }}>
                                    {p.stock_actual} / mín {p.stock_minimo}
                                  </V>
                                </Item>
                              ))
                            : <L>Todo ok ✅</L>}
                        </List>
                      </MiniCard>

                      <MiniCard>
                        <MiniTitle>
                          <div>Movimientos (resumen)</div>
                          <span>{movsStockResumen.length}</span>
                        </MiniTitle>
                        <List>
                          {movsStockResumen.length
                            ? movsStockResumen.map((m, i) => (
                                <Item key={i}>
                                  <L>{m.tipo_movimiento}</L>
                                  <V>{m.cantidad_movs} mov / {m.total_unidades} uds</V>
                                </Item>
                              ))
                            : <L>No hay movimientos</L>}
                        </List>
                      </MiniCard>

                      <MiniCard style={{ gridColumn: '1 / -1' }}>
                        <MiniTitle>
                          <div>Top consumidos (SALIDA)</div>
                          <span>{topConsumidos.length}</span>
                        </MiniTitle>
                        <List>
                          {topConsumidos.length
                            ? topConsumidos.map((p, i) => (
                                <Item key={i}>
                                  <L>{p.nombre}</L>
                                  <V>{p.total_salida} uds</V>
                                </Item>
                              ))
                            : <L>No hay salidas</L>}
                        </List>
                      </MiniCard>
                    </ContentGrid>
                  </div>
                </Section>

                <Section>
                  <summary>
                    <span>📅 Turnos</span>
                    <span className="right">clic para ver</span>
                  </summary>
                  <div className="content">
                    <MiniCard>
                      <MiniTitle>
                        <div>Por período</div>
                        <span>{turnosPorPeriodo.length}</span>
                      </MiniTitle>
                      <List>
                        {turnosPorPeriodo.length
                          ? turnosPorPeriodo.map((d, i) => (
                              <Item key={i}>
                                <L>{fmtDate(d.fecha)}</L>
                                <V>{d.total_turnos}</V>
                              </Item>
                            ))
                          : <L>No hay turnos</L>}
                      </List>
                    </MiniCard>
                  </div>
                </Section>

                <Section>
                  <summary>
                    <span>💻 Teleconsultas</span>
                    <span className="right">clic para ver</span>
                  </summary>
                  <div className="content">
                    <MiniCard>
                      <MiniTitle>
                        <div>Por estado</div>
                        <span>{teleconsultaEstados.length}</span>
                      </MiniTitle>
                      <List>
                        {teleconsultaEstados.length
                          ? teleconsultaEstados.map((t, i) => (
                              <Item key={i}>
                                <L>{t.estado}</L>
                                <V>{t.cantidad}</V>
                              </Item>
                            ))
                          : <L>No hay teleconsultas</L>}
                      </List>
                    </MiniCard>
                  </div>
                </Section>

                <Section>
                  <summary>
                    <span>🧪 Laboratorio</span>
                    <span className="right">clic para ver</span>
                  </summary>
                  <div className="content">
                    <ContentGrid>
                      <MiniCard>
                        <MiniTitle>
                          <div>Por tipo</div>
                          <span>{labPorTipo.length}</span>
                        </MiniTitle>
                        <List>
                          {labPorTipo.length
                            ? labPorTipo.map((l, i) => (
                                <Item key={i}>
                                  <L>{l.tipo_examen}</L>
                                  <V>{l.cantidad}</V>
                                </Item>
                              ))
                            : <L>No hay resultados</L>}
                        </List>
                      </MiniCard>

                      <MiniCard>
                        <MiniTitle>
                          <div>Recientes</div>
                          <Search
                            placeholder="Buscar mascota o examen…"
                            value={qLab}
                            onChange={(e) => setQLab(e.target.value)}
                          />
                        </MiniTitle>
                        <List>
                          {labRecientesFiltrado.length
                            ? labRecientesFiltrado.map((r, i) => (
                                <Item key={i}>
                                  <L>{r.nombre_mascota} — {r.tipo_examen}</L>
                                  <V>{fmtDate(r.fecha)}</V>
                                </Item>
                              ))
                            : <L>No hay recientes</L>}
                        </List>
                      </MiniCard>
                    </ContentGrid>
                  </div>
                </Section>

                <Section>
                  <summary>
                    <span>🩺 Diagnósticos</span>
                    <span className="right">clic para ver</span>
                  </summary>
                  <div className="content">
                    <MiniCard>
                      <MiniTitle>
                        <div>Top diagnósticos</div>
                        <span>{diagnosticosTop.length}</span>
                      </MiniTitle>
                      <List>
                        {diagnosticosTop.length
                          ? diagnosticosTop.map((d, i) => (
                              <Item key={i}>
                                <L>{d.diagnostico}</L>
                                <V>{d.cantidad}</V>
                              </Item>
                            ))
                          : <L>No hay diagnósticos</L>}
                      </List>
                    </MiniCard>
                  </div>
                </Section>

                {isAdmin && (
                  <Section>
                    <summary>
                      <span>👨‍⚕️ Veterinarios</span>
                      <span className="right">clic para ver</span>
                    </summary>
                    <div className="content">
                      <MiniCard>
                        <MiniTitle>
                          <div>Actividad</div>
                          <span>{actividadVeterinarios.length}</span>
                        </MiniTitle>
                        <List>
                          {actividadVeterinarios.length
                            ? actividadVeterinarios.map((v, i) => (
                                <Item key={i}>
                                  <L>{v.veterinario} ({v.email})</L>
                                  <V>{v.total_consultas}</V>
                                </Item>
                              ))
                            : <L>No hay data</L>}
                        </List>
                      </MiniCard>
                    </div>
                  </Section>
                )}
              </SectionsGrid>
            </>
          )}
        </Body>
      </Modal>
    </Overlay>
  );
}
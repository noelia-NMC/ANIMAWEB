// Frontend/src/services/reportes.js

const rawBase = import.meta?.env?.VITE_API_URL || '';

const normalizeBase = (base) => {
  if (!base) return ''; // proxy
  const b = base.replace(/\/+$/, '');
  return b.replace(/\/api$/i, ''); // quita /api si viene incluido
};

const API_BASE = normalizeBase(rawBase);
const BASE_PATH = `${API_BASE}/api/reporteswebgeneral`;

const safeJsonParse = (str) => {
  try { return JSON.parse(str); } catch { return null; }
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const user = safeJsonParse(localStorage.getItem('user'));
  if (!token || !user) throw new Error('Usuario no autenticado o sesión incompleta.');
  if (!user.clinica_id) throw new Error('No se encontró clinica_id del usuario.');
  return { Authorization: `Bearer ${token}`, 'clinica-id': user.clinica_id };
};

const buildQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.append(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
};

const parseErrorMessage = async (resp) => {
  const ct = resp.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try {
      const data = await resp.json();
      return data?.message || data?.error || `Error HTTP ${resp.status}`;
    } catch {
      return `Error HTTP ${resp.status}`;
    }
  }
  try {
    const text = await resp.text();
    return text || `Error HTTP ${resp.status}`;
  } catch {
    return `Error HTTP ${resp.status}`;
  }
};

const apiGetJson = async (path, params) => {
  const url = `${BASE_PATH}${path}${buildQuery(params)}`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: { ...getHeaders(), 'Content-Type': 'application/json' },
  });
  if (!resp.ok) throw new Error(await parseErrorMessage(resp));
  return resp.json();
};

const apiGetBlob = async (path) => {
  const url = `${BASE_PATH}${path}`;
  const resp = await fetch(url, { method: 'GET', headers: getHeaders() });
  if (!resp.ok) throw new Error(await parseErrorMessage(resp));
  return resp.blob();
};

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// BUNDLE
export const getReportesBundle = (fechaInicio, fechaFin) =>
  apiGetJson('/bundle', { fechaInicio, fechaFin });

// BASE
export const getDashboardResumen = () => apiGetJson('/dashboard-resumen');
export const getTurnosPorPeriodo = (fechaInicio, fechaFin) => apiGetJson('/turnos-periodo', { fechaInicio, fechaFin });
export const getMascotasMasConsultadas = () => apiGetJson('/mascotas-mas-consultadas');
export const getTiposConsultasFrecuentes = () => apiGetJson('/tipos-consultas');
export const getRazasMasAtendidas = () => apiGetJson('/razas-mas-atendidas');
export const getActividadVeterinarios = (fechaInicio, fechaFin) => apiGetJson('/actividad-veterinarios', { fechaInicio, fechaFin });
export const getActividadMensual = () => apiGetJson('/actividad-mensual');

// PRO paginado
export const getStockBajo = ({ page = 1, limit = 20, q = '' } = {}) => apiGetJson('/stock-bajo', { page, limit, q });
export const getLaboratorioRecientes = ({ page = 1, limit = 20, q = '' } = {}) => apiGetJson('/laboratorio-recientes', { page, limit, q });

// PRO periodo
export const getMovimientosStockResumen = (fechaInicio, fechaFin) => apiGetJson('/movimientos-stock-resumen', { fechaInicio, fechaFin });
export const getTopProductosConsumidos = (fechaInicio, fechaFin) => apiGetJson('/top-productos-consumidos', { fechaInicio, fechaFin });
export const getTeleconsultaEstados = (fechaInicio, fechaFin) => apiGetJson('/teleconsulta-estados', { fechaInicio, fechaFin });
export const getLaboratorioPorTipo = (fechaInicio, fechaFin) => apiGetJson('/laboratorio-por-tipo', { fechaInicio, fechaFin });
export const getDiagnosticosTop = (fechaInicio, fechaFin) => apiGetJson('/diagnosticos-top', { fechaInicio, fechaFin });


export const exportarReporte = async (tipo, { fechaInicio, fechaFin, include } = {}) => {
  const t = (tipo || '').toLowerCase();
  if (t !== 'pdf' && t !== 'excel') throw new Error('Tipo inválido. Usa "pdf" o "excel".');

  const endpoint = t === 'pdf' ? '/export/pdf' : '/export/excel';
  const ext = t === 'pdf' ? 'pdf' : 'xlsx';

  const qs = new URLSearchParams();
  if (fechaInicio) qs.append('fechaInicio', fechaInicio);
  if (fechaFin) qs.append('fechaFin', fechaFin);
  (include || []).forEach((x) => qs.append('include', x)); // include=reporte&include=...

  const blob = await apiGetBlob(`${endpoint}?${qs.toString()}`);
  downloadBlob(blob, `reporte_clinica_${Date.now()}.${ext}`);
};
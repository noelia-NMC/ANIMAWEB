// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { obtenerTurnos } from '../services/turnos';
import { obtenerTeleconsultasDelVeterinario } from '../services/teleconsultas';
import { obtenerHistorial } from '../services/historial';

import ReportesDashboard from './ReportesDashboard';

// --- Estilos ---
const colors = {
  primary: '#42a8a1',
  secondary: '#5dc1b9',
  white: '#ffffff',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const WelcomeBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.white};
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.08);
  margin-bottom: 2rem;
  border: 1px solid ${colors.border};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    text-align: center;
  }
`;

const WelcomeDetails = styled.div``;

const WelcomeTitle = styled.h2`
  margin: 0;
  color: ${colors.textPrimary};
  font-size: 1.3rem;
  font-weight: 600;
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  text-transform: capitalize;
`;

const WelcomeActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const TimeInfo = styled.div`
  text-align: right;
  @media (max-width: 768px) { text-align: center; }
`;

const CurrentTime = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

const CurrentDate = styled.div`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
`;

const ReportesButton = styled.button`
  background: linear-gradient(135deg, #8e44ad, #9b59b6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(142, 68, 173, 0.3);

  &:hover {
    background: linear-gradient(135deg, #7d3c98, #8e44ad);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(142, 68, 173, 0.4);
  }
  &:active { transform: translateY(0); }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${colors.white};
  padding: 1.6rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.06);
  border: 1px solid ${colors.border};
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(44, 62, 80, 0.12);
    .stat-icon { animation: ${pulse} 0.6s ease-in-out; }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${(props) => props.color};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
`;

const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${colors.textPrimary};
  margin-bottom: 0.3rem;
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: ${colors.textSecondary};
  font-weight: 500;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const PanelCard = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(44, 62, 80, 0.06);
  border: 1px solid ${colors.border};
  overflow: hidden;
`;

const PanelHeader = styled.div`
  background: ${(props) => props.color || colors.primary};
  color: ${colors.white};
  padding: 1.2rem 1.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: ${colors.white};
  padding: 0.45rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover { background: rgba(255, 255, 255, 0.3); }
`;

const PanelContent = styled.div`
  padding: 1.5rem;
  max-height: 380px;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: ${colors.background}; }
  &::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.9rem;
  border-radius: 12px;
  margin-bottom: 0.65rem;
  background: ${colors.background};
  border: 1px solid ${colors.border};
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.white};
    border-color: ${colors.primary};
    transform: translateX(4px);
  }

  &:last-child { margin-bottom: 0; }
`;

const ItemIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
`;

const ItemInfo = styled.div` flex: 1; `;

const ItemTitle = styled.div`
  font-weight: 700;
  color: ${colors.textPrimary};
  margin-bottom: 0.2rem;
`;

const ItemSubtitle = styled.div`
  font-size: 0.85rem;
  color: ${colors.textSecondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: ${colors.textSecondary};

  .icon {
    font-size: 2.6rem;
    margin-bottom: 0.8rem;
    opacity: 0.5;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${colors.border};
  border-top: 3px solid ${colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 5rem auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorBox = styled.div`
  color: ${colors.danger};
  text-align: center;
  padding: 2rem;
`;

// ✅ helper: sacar nombre de clínica desde el user (sin romper)
function getClinicaNombre(user) {
  // posibles nombres según cómo lo guardes en backend
  // (ponemos varios para que funcione “sí o sí”)
  const name =
    user?.clinica_nombre ||
    user?.clinicaNombre ||
    user?.nombre_clinica ||
    user?.clinica?.nombre ||
    user?.clinica_name ||
    user?.clinic_name ||
    null;

  const cleaned = typeof name === 'string' ? name.trim() : '';
  return cleaned || 'ANIMA';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();

  const [turnos, setTurnos] = useState([]);
  const [teleconsultas, setTeleconsultas] = useState([]);
  const [historial, setHistorial] = useState([]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportes, setShowReportes] = useState(false);

  // ✅ nombre clínica dinámico
  const clinicaNombre = useMemo(() => getClinicaNombre(user), [user]);

  // reloj
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // si no hay sesión, afuera
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, user, navigate]);

  // helper de fecha YYYY-MM-DD sin romper por TZ
  const getLocalDateString = useCallback((date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split('T')[0];
  }, []);

  // tick cada minuto por si cambia el día
  const [todayTick, setTodayTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTodayTick((x) => x + 1), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const today = useMemo(() => getLocalDateString(new Date()), [getLocalDateString, todayTick]);

  // cargar datos (LIGERO)
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const pTurnos = obtenerTurnos()
          .then((res) => setTurnos(res?.data || []))
          .catch((err) => {
            console.error('Error cargando turnos:', err);
            setTurnos([]);
          });

        const pHistorial = obtenerHistorial()
          .then((res) => setHistorial(res?.data || []))
          .catch((err) => {
            console.error('Error cargando historial:', err);
            setHistorial([]);
          });

        const ps = [pTurnos, pHistorial];

        if (user?.rol === 'veterinario') {
          const pTele = token
            ? obtenerTeleconsultasDelVeterinario(token)
                .then((res) => setTeleconsultas(res?.data || []))
                .catch((err) => {
                  console.error('Error cargando teleconsultas:', err);
                  setTeleconsultas([]);
                })
            : Promise.resolve(setTeleconsultas([]));
          ps.push(pTele);
        } else {
          setTeleconsultas([]);
        }

        await Promise.allSettled(ps);
      } catch (e) {
        console.error('Error en dashboard:', e);
        setError('Error al cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) loadData();
  }, [authLoading, user?.id, user?.rol, token]);

  const stats = useMemo(() => {
    const turnosHoy = turnos.filter(
      (t) => t.fecha && getLocalDateString(new Date(t.fecha)) === today
    ).length;

    const proximosTurnos = turnos
      .filter((t) => t.fecha && getLocalDateString(new Date(t.fecha)) >= today)
      .length;

    const historialHoy = historial.filter(
      (h) => h.fecha && getLocalDateString(new Date(h.fecha)) === today
    ).length;

    const telePendientes =
      user?.rol === 'veterinario'
        ? teleconsultas.filter((c) => c.estado === 'pendiente').length
        : 0;

    return { turnosHoy, proximosTurnos, historialHoy, telePendientes };
  }, [turnos, historial, teleconsultas, today, getLocalDateString, user?.rol]);

  const turnosHoyList = useMemo(() => {
    return turnos
      .filter((t) => t.fecha && getLocalDateString(new Date(t.fecha)) === today)
      .sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
      .slice(0, 8);
  }, [turnos, today, getLocalDateString]);

  const teleRecientes = useMemo(() => teleconsultas.slice(0, 6), [teleconsultas]);

  if (authLoading || loading) return <LoadingSpinner />;
  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!user) return null;

  return (
    <>
      <WelcomeBar>
        <WelcomeDetails>
          <WelcomeTitle>Dashboard</WelcomeTitle>
          {/* ✅ aquí el cambio */}
          <WelcomeSubtitle>{clinicaNombre} • {user?.rol}</WelcomeSubtitle>
        </WelcomeDetails>

        <WelcomeActions>
          <ReportesButton onClick={() => setShowReportes(true)}>📊 Reportes</ReportesButton>

          <TimeInfo>
            <CurrentTime>{currentTime.toLocaleTimeString()}</CurrentTime>
            <CurrentDate>
              {currentTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </CurrentDate>
          </TimeInfo>
        </WelcomeActions>
      </WelcomeBar>

      <StatsGrid>
        <StatCard color={colors.info} onClick={() => navigate('/turnos')}>
          <StatHeader>
            <StatIcon className="stat-icon" color={colors.info}>📅</StatIcon>
          </StatHeader>
          <StatValue>{stats.turnosHoy}</StatValue>
          <StatLabel>Turnos para hoy</StatLabel>
        </StatCard>

        <StatCard color={colors.success} onClick={() => navigate('/historial')}>
          <StatHeader>
            <StatIcon className="stat-icon" color={colors.success}>📋</StatIcon>
          </StatHeader>
          <StatValue>{stats.historialHoy}</StatValue>
          <StatLabel>Registros médicos hoy</StatLabel>
        </StatCard>

        <StatCard color={colors.primary} onClick={() => navigate('/turnos')}>
          <StatHeader>
            <StatIcon className="stat-icon" color={colors.primary}>⏳</StatIcon>
          </StatHeader>
          <StatValue>{stats.proximosTurnos}</StatValue>
          <StatLabel>Turnos próximos</StatLabel>
        </StatCard>

        {user?.rol === 'veterinario' && (
          <StatCard color={colors.warning} onClick={() => navigate('/teleconsultas')}>
            <StatHeader>
              <StatIcon className="stat-icon" color={colors.warning}>💻</StatIcon>
            </StatHeader>
            <StatValue>{stats.telePendientes}</StatValue>
            <StatLabel>Teleconsultas pendientes</StatLabel>
          </StatCard>
        )}
      </StatsGrid>

      <MainContent>
        <PanelCard>
          <PanelHeader color={colors.info}>
            <PanelTitle>📅 Próximos turnos (hoy)</PanelTitle>
            <ActionBtn onClick={() => navigate('/turnos')}>Ver todos</ActionBtn>
          </PanelHeader>

          <PanelContent>
            {turnosHoyList.length > 0 ? (
              turnosHoyList.map((t, idx) => (
                <ListItem key={t.id || `${t.fecha}-${t.hora}-${idx}`}>
                  <ItemIcon color={colors.info}>🕐</ItemIcon>
                  <ItemInfo>
                    <ItemTitle>{t.nombre_mascota || 'Mascota'}</ItemTitle>
                    <ItemSubtitle>
                      {t.hora || '—'} • {t.motivo || 'Consulta'} • {t.nombre_veterinario || '—'}
                    </ItemSubtitle>
                  </ItemInfo>
                </ListItem>
              ))
            ) : (
              <EmptyState>
                <div className="icon">📅</div>
                <div>No hay turnos para hoy.</div>
              </EmptyState>
            )}
          </PanelContent>
        </PanelCard>

        {user?.rol === 'veterinario' ? (
          <PanelCard>
            <PanelHeader color={colors.warning}>
              <PanelTitle>💻 Mis teleconsultas</PanelTitle>
              <ActionBtn onClick={() => navigate('/teleconsultas')}>Gestionar</ActionBtn>
            </PanelHeader>

            <PanelContent>
              {teleRecientes.length > 0 ? (
                teleRecientes.map((c, idx) => (
                  <ListItem key={c.id || `${c.estado}-${idx}`}>
                    <ItemIcon color={colors.warning}>💻</ItemIcon>
                    <ItemInfo>
                      <ItemTitle>{c.nombre_mascota || 'Teleconsulta'}</ItemTitle>
                      <ItemSubtitle>{c.motivo || '—'} • {c.estado || '—'}</ItemSubtitle>
                    </ItemInfo>
                  </ListItem>
                ))
              ) : (
                <EmptyState>
                  <div className="icon">💻</div>
                  <div>No tienes teleconsultas.</div>
                </EmptyState>
              )}
            </PanelContent>
          </PanelCard>
        ) : (
          <PanelCard>
            <PanelHeader color={colors.secondary}>
              <PanelTitle>✅ Tips rápidos</PanelTitle>
              <ActionBtn onClick={() => navigate('/productos')}>Ir a inventario</ActionBtn>
            </PanelHeader>

            <PanelContent>
              <ListItem>
                <ItemIcon color={colors.secondary}>📦</ItemIcon>
                <ItemInfo>
                  <ItemTitle>Revisa stock</ItemTitle>
                  <ItemSubtitle>Evita quedarte sin insumos para cirugías/baños.</ItemSubtitle>
                </ItemInfo>
              </ListItem>

              <ListItem>
                <ItemIcon color={colors.primary}>👥</ItemIcon>
                <ItemInfo>
                  <ItemTitle>Clientes fijos vs ocasionales</ItemTitle>
                  <ItemSubtitle>Mantén limpia tu base: registra fijo solo si corresponde.</ItemSubtitle>
                </ItemInfo>
              </ListItem>
            </PanelContent>
          </PanelCard>
        )}
      </MainContent>

      <ReportesDashboard isOpen={showReportes} onClose={() => setShowReportes(false)} />
    </>
  );
}
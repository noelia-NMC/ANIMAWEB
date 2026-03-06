import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { obtenerAuditoria } from '../services/auditoria';

import {
  PageTitle,
  SectionTitle,
  Select,
  SearchInput,
  EmptyState,
} from '../styles/crudStyles';

const colors = {
  primary: '#42a8a1',
  textPrimary: '#2c3e50',
  textSecondary: '#7f8c8d',
  background: '#f4f7f6',
  border: '#eef2f1',
  white: '#ffffff',
};

const PageWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; 
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SubText = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.95rem;
  margin-top: 0.35rem;
`;

const Filters = styled.div`
  display: grid;
  grid-template-columns: 220px 220px 1fr auto;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 14px;
  overflow: hidden;

  /* ✅ clave: que el card ocupe el resto y ListBody crezca */
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const CardHead = styled.div`
  padding: 0.9rem 1rem;
  border-bottom: 1px solid ${colors.border};
  background: ${colors.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const Counter = styled.div`
  color: ${colors.textSecondary};
  font-weight: 700;
  font-size: 0.9rem;
`;

const ListBody = styled.div`
  /* ✅ solo aquí hay scroll */
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.75rem;
  background: ${colors.white};

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
  &::-webkit-scrollbar-thumb { background: #ccc; border-radius: 10px; }
  &::-webkit-scrollbar-thumb:hover { background: #aaa; }
`;

const Item = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 0.85rem;
  background: ${colors.white};
  margin-bottom: 0.65rem;
`;

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: flex-start;
`;

const Title = styled.div`
  font-weight: 700;
  color: ${colors.textPrimary};
  line-height: 1.2;
`;

const Meta = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.85rem;
  text-align: right;
  white-space: nowrap;
`;

const Desc = styled.div`
  margin-top: 0.45rem;
  color: ${colors.textSecondary};
  font-size: 0.92rem;
  line-height: 1.25;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.65rem;
`;

const Badge = styled.span`
  border: 1px solid ${colors.border};
  background: ${colors.background};
  border-radius: 999px;
  padding: 0.25rem 0.65rem;
  font-weight: 700;
  font-size: 0.78rem;
  color: ${colors.textPrimary};
`;

const SoftBtn = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textPrimary};
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;

  &:hover {
    border-color: rgba(66,168,161,0.35);
    background: ${colors.background};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

const Pager = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 0.85rem 1rem;
  border-top: 1px solid ${colors.border};
  background: ${colors.white};
`;

export default function Bitacora() {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'admin' || user?.rol_id === 1;

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [modulo, setModulo] = useState('');
  const [accion, setAccion] = useState('');
  const [q, setQ] = useState('');

  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  const cargar = async () => {
    try {
      const res = await obtenerAuditoria({ modulo, accion, q, limit, offset });
      setData(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch (e) {
      console.error('Error cargando bitácora:', e);
      setData([]);
      setTotal(0);
      alert(e?.response?.data?.message || 'No se pudo cargar bitácora.');
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    cargar();
    // eslint-disable-next-line
  }, [modulo, accion, q, offset]);

  const modulos = useMemo(
    () => [
      { value: '', label: 'Todos los módulos' },
      { value: 'PRODUCTOS', label: 'PRODUCTOS' },
      { value: 'MASCOTAS', label: 'MASCOTAS' },
      { value: 'EXPEDIENTE', label: 'EXPEDIENTE' },
      { value: 'TURNOS', label: 'TURNOS' },
      { value: 'TELECONSULTAS', label: 'TELECONSULTAS' },
      { value: 'USUARIOS', label: 'USUARIOS' },
      { value: 'GENERAL', label: 'GENERAL' },
    ],
    []
  );

  const acciones = useMemo(
    () => [
      { value: '', label: 'Todas las acciones' },
      { value: 'CREAR', label: 'CREAR' },
      { value: 'EDITAR', label: 'EDITAR' },
      { value: 'ELIMINAR', label: 'ELIMINAR' },
      { value: 'STOCK_MOV', label: 'STOCK_MOV' },
      { value: 'LOGIN', label: 'LOGIN' },
      { value: 'LOGOUT', label: 'LOGOUT' },
    ],
    []
  );

  if (!isAdmin) {
    return (
      <PageWrap>
        <PageTitle>Bitácora</PageTitle>
        <EmptyState icon="🔒">Solo admin puede ver esta página.</EmptyState>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <TopRow>
        <div>
          <PageTitle>Bitácora / Auditoría</PageTitle>
        </div>

        <SoftBtn type="button" onClick={() => { setOffset(0); cargar(); }}>
          Recargar
        </SoftBtn>
      </TopRow>

      <Filters>
        <Select value={modulo} onChange={(e) => { setOffset(0); setModulo(e.target.value); }}>
          {modulos.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </Select>

        <Select value={accion} onChange={(e) => { setOffset(0); setAccion(e.target.value); }}>
          {acciones.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </Select>

        <SearchInput
          placeholder="Buscar (usuario, descripción, entidad, id...)"
          value={q}
          onChange={(e) => { setOffset(0); setQ(e.target.value); }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
          <div style={{ color: colors.textSecondary, fontWeight: 700 }}>
            Total: {total}
          </div>
        </div>
      </Filters>

      <Card>
        <CardHead>
          <SectionTitle style={{ margin: 0 }}>Registros</SectionTitle>
        </CardHead>

        <ListBody>
          {data.length === 0 ? (
            <EmptyState icon="🧾">No hay registros con esos filtros.</EmptyState>
          ) : (
            data.map((x) => (
              <Item key={x.id}>
                <ItemTop>
                  <div>
                    <Title>{x.modulo} • {x.accion}</Title>
                    <Desc>{x.descripcion || 'Sin descripción.'}</Desc>
                  </div>

                  <Meta>
                    {x.creado_en ? new Date(x.creado_en).toLocaleString() : '—'}
                  </Meta>
                </ItemTop>

                <BadgeRow>
                  <Badge>Usuario: {x.usuario_nombre || x.usuario_email || '—'}</Badge>
                  {x.entidad ? <Badge>Entidad: {x.entidad}</Badge> : null}
                  {x.entidad_id ? <Badge>ID: {x.entidad_id}</Badge> : null}
                  {x.ip ? <Badge>IP: {x.ip}</Badge> : null}
                </BadgeRow>
              </Item>
            ))
          )}
        </ListBody>
      </Card>
    </PageWrap>
  );
}
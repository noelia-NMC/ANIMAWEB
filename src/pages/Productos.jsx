// src/pages/Productos.jsx
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  desactivarProducto,
  moverStockProducto,
  obtenerMovimientosProducto,
} from '../services/productos';

import {
  PageWrap,
  TopBar,
  TopLeft,
  Title,
  SubTitle,
  Controls,
  Search,
  Select,
  PrimaryBtn,
  SoftBtn,
  LayoutGrid,
  LeftPanel,
  PanelHeader,
  PanelTitle,
  PanelBody,
  Field,
  Input,
  TextArea,
  ErrorText,
  Hint,
  RightPanel,
  Section,
  SectionHead,
  SectionName,
  SmallInfo,
  CardsGrid,
  Card,
  CardTop,
  CardTitle,
  AlertPill,
  ChipsRow,
  Chip,
  StockChip,
  CollarChip,
  Desc,
  CardActions,
  MiniSoft,
  MiniPrimary,
  MiniDanger,
  Overlay,
  Modal,
  ModalHeader,
  CloseX,
  ModalBody,
  ModalActions,
  MovList,
  MovItem,
  MovTop,
  MovMeta,
  MovObs,
  MovBy,
} from '../styles/productosGridStyles';

// ✅ Normaliza para que pinte aunque el backend devuelva otros nombres
const normalizeProducto = (p) => {
  if (!p) return null;

  const stockActual =
    p.stock_actual ?? p.stockActual ?? p.stock ?? p.cantidad ?? p.existencia ?? 0;

  const stockMin =
    p.stock_minimo ?? p.stockMinimo ?? p.minimo ?? p.stockmin ?? 0;

  const categoria = p.categoria ?? p.category ?? p.tipo ?? 'Otros';

  const tipoProducto =
    p.tipo_producto ??
    p.tipoProducto ??
    (String(categoria).toLowerCase() === 'collares' ? 'COLLAR' : 'NORMAL');

  return {
    ...p,
    id: p.id ?? p.producto_id ?? p.productoId,
    nombre: p.nombre ?? p.name ?? p.producto ?? 'Sin nombre',
    categoria,
    tipo_producto: tipoProducto,
    descripcion: p.descripcion ?? p.description ?? '',
    stock_actual: Number(stockActual) || 0,
    stock_minimo: Number(stockMin) || 0,
  };
};

export default function Productos() {
  const { hasPermission } = useAuth();

  // puede gestionar si tiene permisos (admin bypass ya está en hasPermission)
  const canCreate = hasPermission('productos:create');
  const canUpdate = hasPermission('productos:update');
  const canDelete = hasPermission('productos:delete');

  // Para simplificar tu UI actual (que usa isAdmin para todo):
  const isAdmin = canCreate || canUpdate || canDelete;
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODOS');

  // form (solo admin)
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: 'Collares',
    descripcion: '',
    stock_minimo: 0,
    tipo_producto: 'NORMAL',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idActual, setIdActual] = useState(null);

  // modal stock
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockTarget, setStockTarget] = useState(null);
  const [stockForm, setStockForm] = useState({
    tipo_movimiento: 'ENTRADA',
    cantidad: 0,
    observacion: '',
  });

  // movimientos modal
  const [movModalOpen, setMovModalOpen] = useState(false);
  const [movTarget, setMovTarget] = useState(null);
  const [movimientos, setMovimientos] = useState([]);

  const cargar = async () => {
    try {
      const res = await obtenerProductos();

      const raw =
        Array.isArray(res.data) ? res.data :
          Array.isArray(res.data?.rows) ? res.data.rows :
            Array.isArray(res.data?.data) ? res.data.data :
              [];

      const normalized = raw.map(normalizeProducto).filter(Boolean);
      setProductos(normalized);
    } catch (e) {
      console.error(e);
      setProductos([]);
      alert('Error cargando productos.');
    }
  };

  useEffect(() => { cargar(); }, []);

  const categorias = useMemo(() => {
    const set = new Set();
    productos.forEach((p) => p?.categoria && set.add(p.categoria));
    const arr = Array.from(set);
    arr.sort((a, b) => a.localeCompare(b));
    return ['TODOS', ...arr];
  }, [productos]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre?.trim() || formData.nombre.trim().length < 2) newErrors.nombre = 'Nombre mínimo 2 caracteres.';
    if (!formData.categoria?.trim()) newErrors.categoria = 'Categoría obligatoria.';
    if (!formData.tipo_producto) newErrors.tipo_producto = 'Tipo obligatorio.';
    const min = Number(formData.stock_minimo);
    if (Number.isNaN(min) || min < 0) newErrors.stock_minimo = 'Stock mínimo inválido.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: null }));
  };

  const limpiarFormulario = () => {
    setFormData({ nombre: '', categoria: 'Collares', descripcion: '', stock_minimo: 0, tipo_producto: 'NORMAL' });
    setErrors({});
    setModoEdicion(false);
    setIdActual(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        categoria: formData.categoria,
        descripcion: formData.descripcion,
        stock_minimo: Number(formData.stock_minimo),
        tipo_producto: formData.tipo_producto,
      };

      if (modoEdicion) {
        await actualizarProducto(idActual, payload);
        alert('Producto actualizado.');
      } else {
        await crearProducto(payload);
        alert('Producto creado.');
      }

      limpiarFormulario();
      await cargar();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error guardando producto.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditar = (p) => {
    if (!isAdmin) return;
    setModoEdicion(true);
    setIdActual(p.id);
    setFormData({
      nombre: p.nombre ?? '',
      categoria: p.categoria ?? 'Otros',
      descripcion: p.descripcion ?? '',
      stock_minimo: p.stock_minimo ?? 0,
      tipo_producto: p.tipo_producto ?? 'NORMAL',
    });
    setErrors({});
  };

  const handleDesactivar = async (id) => {
    if (!isAdmin) return;
    if (!window.confirm('¿Desactivar este producto?')) return;

    try {
      await desactivarProducto(id);
      alert('Producto desactivado.');
      await cargar();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error desactivando.');
    }
  };

  const abrirStock = (p) => {
    if (!isAdmin) return;
    setStockTarget(p);
    setStockForm({ tipo_movimiento: 'ENTRADA', cantidad: 0, observacion: '' });
    setStockModalOpen(true);
  };

  const guardarStock = async () => {
    if (!isAdmin || !stockTarget) return;

    const qty = Number(stockForm.cantidad);
    if (Number.isNaN(qty) || qty < 0) return alert('Cantidad inválida.');

    try {
      await moverStockProducto({
        producto_id: stockTarget.id,
        tipo_movimiento: stockForm.tipo_movimiento,
        cantidad: qty,
        observacion: stockForm.observacion,
      });

      alert('Stock actualizado.');
      setStockModalOpen(false);
      await cargar();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error moviendo stock.');
    }
  };

  const verMovimientos = async (p) => {
    try {
      const res = await obtenerMovimientosProducto(p.id);
      const raw =
        Array.isArray(res.data) ? res.data :
          Array.isArray(res.data?.rows) ? res.data.rows :
            [];
      setMovimientos(raw);
      setMovTarget(p);
      setMovModalOpen(true);
    } catch (e) {
      console.error(e);
      alert('No se pudo cargar movimientos.');
    }
  };

  // ✅ filtro + búsqueda + orden “Collares arriba”
  const productosFiltrados = useMemo(() => {
    const q = (busqueda || '').toLowerCase().trim();

    const list = productos.filter((p) => {
      if (!p) return false;

      if (filtroCategoria !== 'TODOS' && (p.categoria || '') !== filtroCategoria) return false;

      if (!q) return true;

      const n = (p.nombre || '').toLowerCase();
      const c = (p.categoria || '').toLowerCase();
      const t = (p.tipo_producto || '').toLowerCase();
      return n.includes(q) || c.includes(q) || t.includes(q);
    });

    // ⭐ Orden:
    // 1) categoría "Collares" arriba
    // 2) dentro de "Collares", tipo_producto "COLLAR" arriba
    // 3) luego alfabético por nombre
    list.sort((a, b) => {
      const aIsCollares = (a.categoria || '').toLowerCase() === 'collares';
      const bIsCollares = (b.categoria || '').toLowerCase() === 'collares';
      if (aIsCollares !== bIsCollares) return aIsCollares ? -1 : 1;

      const aIsCollarType = (a.tipo_producto || '').toUpperCase() === 'COLLAR';
      const bIsCollarType = (b.tipo_producto || '').toUpperCase() === 'COLLAR';
      if (aIsCollarType !== bIsCollarType) return aIsCollarType ? -1 : 1;

      return (a.nombre || '').localeCompare(b.nombre || '');
    });

    return list;
  }, [productos, busqueda, filtroCategoria]);

  const collaresList = useMemo(
    () => productosFiltrados.filter((p) => (p.categoria || '').toLowerCase() === 'collares'),
    [productosFiltrados]
  );
  const otrosList = useMemo(
    () => productosFiltrados.filter((p) => (p.categoria || '').toLowerCase() !== 'collares'),
    [productosFiltrados]
  );

  const countLow = useMemo(() => {
    return productosFiltrados.filter((p) => Number(p.stock_actual || 0) <= Number(p.stock_minimo || 0)).length;
  }, [productosFiltrados]);

  return (
    <PageWrap>
      <TopBar>
        <TopLeft>
          <div>
            <Title>Inventario / Stock</Title>
            <SubTitle>
              Total: <b>{productosFiltrados.length}</b> • En alerta: <b>{countLow}</b>
            </SubTitle>
          </div>
        </TopLeft>

        <Controls>
          <Search
            placeholder="Buscar producto, categoría, tipo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>

          <SoftBtn type="button" onClick={cargar}>Recargar</SoftBtn>
        </Controls>
      </TopBar>

      <LayoutGrid>
        {/* LEFT */}
        <LeftPanel>
          <PanelHeader>
            <PanelTitle>
              {isAdmin ? (modoEdicion ? 'Editar producto' : 'Registrar producto') : 'Solo lectura'}
            </PanelTitle>

            {isAdmin ? (
              <div style={{ display: 'flex', gap: 8 }}>
                {modoEdicion ? (
                  <SoftBtn type="button" onClick={limpiarFormulario} disabled={saving}>
                    Cancelar
                  </SoftBtn>
                ) : null}

                <PrimaryBtn type="submit" form="productos-form" disabled={saving}>
                  {saving ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Registrar')}
                </PrimaryBtn>
              </div>
            ) : null}
          </PanelHeader>

          <PanelBody>
            {isAdmin ? (
              <form id="productos-form" onSubmit={handleSubmit} noValidate>
                <Field>
                  <Input
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={formData.nombre}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  <ErrorText>{errors.nombre || ''}</ErrorText>
                </Field>

                <Field>
                  <Select name="categoria" value={formData.categoria} onChange={handleChange} disabled={saving}>
                    <option value="Collares">Categoría: Collares</option>
                    <option value="Medicamentos">Medicamentos</option>
                    <option value="Aseo">Aseo</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Internación">Internación</option>
                    <option value="Otros">Otros</option>
                  </Select>
                  <ErrorText>{errors.categoria || ''}</ErrorText>
                </Field>

                <Field>
                  <Select name="tipo_producto" value={formData.tipo_producto} onChange={handleChange} disabled={saving}>
                    <option value="NORMAL">Tipo: NORMAL</option>
                    <option value="COLLAR">COLLAR</option>
                  </Select>
                  <ErrorText>{errors.tipo_producto || ''}</ErrorText>
                </Field>

                <Field>
                  <Input
                    name="stock_minimo"
                    type="number"
                    placeholder="Stock mínimo"
                    value={formData.stock_minimo}
                    onChange={handleChange}
                    disabled={saving}
                  />
                  <ErrorText>{errors.stock_minimo || ''}</ErrorText>
                </Field>

                <Field>
                  <TextArea
                    name="descripcion"
                    placeholder="Descripción (opcional)"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </Field>
              </form>
            ) : (
              <Hint>
                Puedes ver el inventario y movimientos, pero <b>no</b> puedes crear/editar ni mover stock.
              </Hint>
            )}
          </PanelBody>
        </LeftPanel>

        {/* RIGHT */}
        <RightPanel>
          {/* Collares */}
          <Section>
            <SectionHead>
              <SectionName>Collares</SectionName>
              <SmallInfo>{collaresList.length} items</SmallInfo>
            </SectionHead>

            <CardsGrid>
              {collaresList.length ? (
                collaresList.map((p) => {
                  const low = Number(p.stock_actual || 0) <= Number(p.stock_minimo || 0);
                  const isCollarType = (p.tipo_producto || '').toUpperCase() === 'COLLAR';
                  const desc = (p.descripcion || '').trim();

                  return (
                    <Card key={p.id}>
                      <CardTop>
                        <CardTitle title={p.nombre}>{p.nombre}</CardTitle>
                        {low ? <AlertPill>ALERTA</AlertPill> : null}
                      </CardTop>

                      <ChipsRow>
                        <StockChip $low={low}>Stock: {p.stock_actual ?? 0}</StockChip>
                        <Chip>Min: {p.stock_minimo ?? 0}</Chip>
                        {isCollarType ? <CollarChip>COLLAR</CollarChip> : <Chip>NORMAL</Chip>}
                      </ChipsRow>

                      {desc ? <Desc>{desc}</Desc> : null}

                      <CardActions>
                        <MiniSoft type="button" onClick={() => verMovimientos(p)}>Movimientos</MiniSoft>

                        {isAdmin ? (
                          <>
                            <MiniPrimary type="button" onClick={() => abrirStock(p)}>Stock</MiniPrimary>
                            <MiniSoft type="button" onClick={() => handleEditar(p)}>Editar</MiniSoft>
                            <MiniDanger type="button" onClick={() => handleDesactivar(p.id)}>Desactivar</MiniDanger>
                          </>
                        ) : null}
                      </CardActions>
                    </Card>
                  );
                })
              ) : (
                <Hint>No hay productos en “Collares”.</Hint>
              )}
            </CardsGrid>
          </Section>

          {/* Otros */}
          <Section>
            <SectionHead>
              <SectionName>Otros productos</SectionName>
              <SmallInfo>{otrosList.length} items</SmallInfo>
            </SectionHead>

            <CardsGrid>
              {otrosList.length ? (
                otrosList.map((p) => {
                  const low = Number(p.stock_actual || 0) <= Number(p.stock_minimo || 0);
                  const isCollarType = (p.tipo_producto || '').toUpperCase() === 'COLLAR';
                  const desc = (p.descripcion || '').trim();

                  return (
                    <Card key={p.id}>
                      <CardTop>
                        <CardTitle title={p.nombre}>{p.nombre}</CardTitle>
                        {low ? <AlertPill>ALERTA</AlertPill> : null}
                      </CardTop>

                      <ChipsRow>
                        <Chip>{p.categoria}</Chip>
                        <StockChip $low={low}>Stock: {p.stock_actual ?? 0}</StockChip>
                        <Chip>Min: {p.stock_minimo ?? 0}</Chip>
                        {isCollarType ? <CollarChip>COLLAR</CollarChip> : <Chip>NORMAL</Chip>}
                      </ChipsRow>

                      {desc ? <Desc>{desc}</Desc> : null}

                      <CardActions>
                        <MiniSoft type="button" onClick={() => verMovimientos(p)}>Movimientos</MiniSoft>

                        {isAdmin ? (
                          <>
                            <MiniPrimary type="button" onClick={() => abrirStock(p)}>Stock</MiniPrimary>
                            <MiniSoft type="button" onClick={() => handleEditar(p)}>Editar</MiniSoft>
                            <MiniDanger type="button" onClick={() => handleDesactivar(p.id)}>Desactivar</MiniDanger>
                          </>
                        ) : null}
                      </CardActions>
                    </Card>
                  );
                })
              ) : (
                <Hint>No hay productos en inventario.</Hint>
              )}
            </CardsGrid>
          </Section>
        </RightPanel>
      </LayoutGrid>

      {/* MODAL STOCK (admin) */}
      {stockModalOpen && stockTarget && (
        <Overlay onMouseDown={() => setStockModalOpen(false)}>
          <Modal onMouseDown={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>Stock: {stockTarget.nombre}</div>
              <CloseX onClick={() => setStockModalOpen(false)}>✕</CloseX>
            </ModalHeader>

            <ModalBody>
              <Field>
                <Select
                  value={stockForm.tipo_movimiento}
                  onChange={(e) => setStockForm((p) => ({ ...p, tipo_movimiento: e.target.value }))}
                >
                  <option value="ENTRADA">Tipo: ENTRADA</option>
                  <option value="SALIDA">SALIDA</option>
                  <option value="AJUSTE">AJUSTE</option>
                </Select>
              </Field>

              <Field>
                <Input
                  type="number"
                  placeholder="Cantidad"
                  value={stockForm.cantidad}
                  onChange={(e) => setStockForm((p) => ({ ...p, cantidad: e.target.value }))}
                />
              </Field>

              <Field>
                <TextArea
                  placeholder="Observación (opcional)"
                  value={stockForm.observacion}
                  onChange={(e) => setStockForm((p) => ({ ...p, observacion: e.target.value }))}
                />
              </Field>

              <Hint>
                Stock actual: <b>{stockTarget.stock_actual ?? 0}</b> • Mínimo: <b>{stockTarget.stock_minimo ?? 0}</b>
              </Hint>
            </ModalBody>

            <ModalActions>
              <SoftBtn type="button" onClick={() => setStockModalOpen(false)}>Cancelar</SoftBtn>
              <PrimaryBtn type="button" onClick={guardarStock}>Guardar</PrimaryBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}

      {/* MODAL MOVIMIENTOS */}
      {movModalOpen && movTarget && (
        <Overlay onMouseDown={() => setMovModalOpen(false)}>
          <Modal onMouseDown={(e) => e.stopPropagation()}>
            <ModalHeader>
              <div>Movimientos: {movTarget.nombre}</div>
              <CloseX onClick={() => setMovModalOpen(false)}>✕</CloseX>
            </ModalHeader>

            <ModalBody>
              {movimientos.length ? (
                <MovList>
                  {movimientos.map((m) => (
                    <MovItem key={m.id ?? `${m.tipo_movimiento}-${m.creado_en}-${m.cantidad}`}>
                      <MovTop>
                        <div>{m.tipo_movimiento} • {m.cantidad}</div>
                        <MovMeta>
                          {m.creado_en ? new Date(m.creado_en).toLocaleString() : '—'}
                        </MovMeta>
                      </MovTop>

                      {m.observacion ? <MovObs>{m.observacion}</MovObs> : null}

                      <MovBy>
                        Por: {m.usuario_nombre || m.usuario_email || 'Sistema'}
                      </MovBy>
                    </MovItem>
                  ))}
                </MovList>
              ) : (
                <Hint>No hay movimientos.</Hint>
              )}
            </ModalBody>

            <ModalActions>
              <SoftBtn type="button" onClick={() => setMovModalOpen(false)}>Cerrar</SoftBtn>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
    </PageWrap>
  );
}
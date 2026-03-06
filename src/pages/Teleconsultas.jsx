// ARCHIVO COMPLETO Y CORREGIDO: src/pages/Teleconsultas.js

import { useEffect, useState, useCallback } from 'react';
// 1. Cambia la forma de importar jsPDF
import jsPDF from 'jspdf';
// 2. Importa el plugin directamente
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import {
  obtenerTeleconsultasDelVeterinario,
  aceptarTeleconsulta,
  finalizarTeleconsulta,
} from '../services/teleconsultas';
import {
  PageContainer, PageTitle, HeaderSection, ControlsContainer, SearchInput,
  Select, ExportButtonGroup, ExportButton, ConsultasList, ConsultaCard, CardHeader, PetName,
  InfoGrid, InfoRow, Label, Value, MeetLink, StatusBadge, ButtonGroup,
  AcceptButton, FinishButton, EmptyState,
} from '../styles/teleconsultasStyles';

export default function Teleconsultas() {
  const token = localStorage.getItem('token');
  const [consultas, setConsultas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const cargarConsultas = useCallback(async () => {
    if (!token) return;
    try {
      const res = await obtenerTeleconsultasDelVeterinario(token);
      setConsultas(res.data);
    } catch (error) {
      console.error('Error al cargar teleconsultas:', error);
      alert('No se pudieron cargar las teleconsultas.');
    }
  }, [token]);

  useEffect(() => {
    cargarConsultas();
  }, [cargarConsultas]);

  const handleAceptar = async (consultaId) => {
    let meetLink = prompt("Por favor, ingrese el enlace de Google Meet para esta consulta:");
    if (!meetLink || !meetLink.trim().startsWith('https://meet.google.com/')) {
      alert("Enlace de Meet no válido. Debe comenzar con 'https://meet.google.com/'.");
      return;
    }
    try {
      await aceptarTeleconsulta(consultaId, { meet_link: meetLink.trim() }, token);
      alert('Consulta aceptada con éxito.');
      cargarConsultas(); 
    } catch (error) {
      console.error('Error al aceptar la consulta:', error);
      alert(error.response?.data?.message || 'Error al aceptar la consulta.');
    }
  };
  
  const handleFinalizar = async (consultaId) => {
    if (window.confirm("¿Está seguro de que desea marcar esta consulta como finalizada?")) {
      try {
        await finalizarTeleconsulta(consultaId, token);
        alert('Consulta finalizada correctamente.');
        cargarConsultas();
      } catch (error) {
        console.error('Error al finalizar la consulta:', error);
        alert(error.response?.data?.message || 'Error al finalizar la consulta.');
      }
    }
  };

  const filtradas = consultas.filter(c =>
    (c.nombre_mascota || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.propietario_email || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.motivo || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  const visibles = filtradas.filter(c =>
    filtroEstado === 'todos' ? true : c.estado === filtroEstado
  );

  const exportarCSV = () => {
    if (visibles.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    const csvData = visibles.map(({ id, fecha, motivo, estado, nombre_mascota, propietario_email, meet_link }) => ({
        ID: id,
        Fecha_Solicitud: new Date(fecha).toLocaleString('es-ES'),
        Mascota: nombre_mascota,
        Propietario: propietario_email,
        Motivo: motivo,
        Estado: estado,
        Enlace_Meet: meet_link || 'N/A'
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'teleconsultas.csv');
  };

  // --- FUNCIÓN DE EXPORTAR PDF CORREGIDA ---
  const exportarPDF = () => {
    if (visibles.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }
    
    // 3. Se crea una nueva instancia de jsPDF
    const doc = new jsPDF();
    
    const tableColumn = ["Mascota", "Propietario", "Fecha", "Estado", "Motivo"];
    const tableRows = [];

    visibles.forEach(item => {
      const itemData = [
        item.nombre_mascota,
        item.propietario_email,
        new Date(item.fecha).toLocaleDateString('es-ES'),
        item.estado,
        item.motivo,
      ];
      tableRows.push(itemData);
    });

    doc.setFontSize(18);
    doc.text("Reporte de teleconsultas", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // 4. Se llama a la función autoTable directamente en la instancia 'doc'
    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [66, 168, 161] }, // Tu color primario en RGB
        styles: { font: 'helvetica', fontSize: 9 },
    });

    doc.save("teleconsultas.pdf");
  };

  return (
    <PageContainer>
      <PageTitle>Solicitudes de teleconsulta</PageTitle>
      <HeaderSection>
        <ControlsContainer>
          <SearchInput
            type="text"
            placeholder="Buscar por mascota, dueño o motivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aceptada">Aceptadas</option>
            <option value="finalizada">Finalizadas</option>
          </Select>
          <ExportButtonGroup>
            <ExportButton onClick={exportarCSV} color="#27ae60" hoverColor="#229954">
              📄 Exportar CSV
            </ExportButton>
            <ExportButton onClick={exportarPDF} color="#e74c3c" hoverColor="#c0392b">
              📕 Exportar PDF
            </ExportButton>
          </ExportButtonGroup>
        </ControlsContainer>
      </HeaderSection>
      
      <ConsultasList>
        {visibles.length === 0 ? (
          <EmptyState>No hay solicitudes que coincidan con los filtros actuales.</EmptyState>
        ) : (
          visibles.map(c => (
            <ConsultaCard key={c.id} estado={c.estado}>
              <CardHeader>
                <PetName>{c.nombre_mascota}</PetName>
                <StatusBadge estado={c.estado}>{c.estado}</StatusBadge>
              </CardHeader>
              <InfoGrid>
                <InfoRow><Label>Dueño</Label><Value>{c.propietario_email}</Value></InfoRow>
                <InfoRow><Label>Fecha solicitud</Label><Value>{new Date(c.fecha).toLocaleString()}</Value></InfoRow>
                <InfoRow className="full-width"><Label>Motivo</Label><Value>{c.motivo}</Value></InfoRow>
                {c.meet_link && <InfoRow className="full-width"><Label>Enlace Meet</Label><Value><MeetLink href={c.meet_link} target="_blank" rel="noreferrer">{c.meet_link}</MeetLink></Value></InfoRow>}
              </InfoGrid>
              <ButtonGroup>
                {c.estado === 'pendiente' && <AcceptButton onClick={() => handleAceptar(c.id)}>Aceptar</AcceptButton>}
                {c.estado === 'aceptada' && <FinishButton onClick={() => handleFinalizar(c.id)}>Finalizar</FinishButton>}
              </ButtonGroup>
            </ConsultaCard>
          ))
        )}
      </ConsultasList>
    </PageContainer>
  );
}
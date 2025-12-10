// src/utils/generarPDFViaje.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Observacion {
  id: number;
  observacion: string;
  quien_envia: string;
  quien_recibe: string;
  fecha: string;
  hora: string;
}

// Interfaz que coincide con Viaje + observaciones de seguimiento opcional
interface DatosViaje {
  id: number;
  ano: string | null;
  funcionario_a_cargo: string | null;
  nombre_actividad: string | null;
  organizador: string | null;
  pais: string | null;  // lugar de destino
  fecha_actividad_inicio: string | null;
  fecha_actividad_final: string | null;
  fecha_viaje_inicio: string | null;
  fecha_viaje_final: string | null;
  estado: string | null;
  sector: string | null;
  tema: string | null;
  numero_acuerdo: string | null;
  autoridad_delegado: string | null;
  nombre_participante: string | null;
  cargo_funcionario: string | null;
  modalidad: string | null;
  observaciones: string | null;  // observaciones de texto del viaje (ESTA SECCIÓN SERÁ IGNORADA AHORA)
  financiamiento: string | null;
  vacaciones: string | null;
  detalle_vacaciones: string | null;
  observacionesSeguimiento?: Observacion[];
}

/**
 * Carga una imagen desde una URL y devuelve un dataURL (base64) o null si falla.
 */
const loadImageToDataURL = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("No se pudo cargar la imagen de encabezado:", err);
    return null;
  }
};

/**
 * Genera y descarga un PDF con los datos del viaje.
 * Recibe objeto DatosViaje y opcionalmente { headerImageUrl }
 */
export const generarPDFViaje = async (
  datos: DatosViaje,
  options?: { headerImageUrl?: string }
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Cargar imagen de encabezado (si existe)
  const headerUrl = options?.headerImageUrl ?? "/encabezado.png";
  const headerDataUrl = await loadImageToDataURL(headerUrl);

  let yPosition = 20;

  if (headerDataUrl) {
    const mimeMatch = headerDataUrl.match(/^data:(image\/[a-zA-Z]+);base64,/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const format = mime.includes("jpeg") || mime.includes("jpg") ? "JPEG" : "PNG";

    const imgEl = new Image();
    imgEl.src = headerDataUrl;

    await new Promise((resolve) => {
      imgEl.onload = resolve;
    });

    const maxWidth = pageWidth - 40;
    const ratio = imgEl.height / imgEl.width;
    const newWidth = maxWidth;
    const newHeight = newWidth * ratio;

    // Dibuja la imagen con proporción (no estirada)
    doc.addImage(headerDataUrl, format as any, 20, 10, newWidth, newHeight);
    yPosition = 10 + newHeight + 10;
  } else {
    // Si no hay imagen, dibuja texto por defecto en el encabezado
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 41, 81);
    doc.text("MINISTERIO DE EDUCACIÓN PÚBLICA", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
    doc.setFontSize(14);
    doc.text("Reporte de Viaje al Exterior", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
  }

  // Título debajo de la imagen (tamaño medio)
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(23, 41, 81);
  doc.text("Reporte de Viaje al Exterior", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 10;

  // Separador
  doc.setDrawColor(205, 169, 95);
  doc.setLineWidth(0.5);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 8;

  // Meta información
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  const fechaHoraGeneracion = new Date().toLocaleString("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  doc.text(`Generado: ${fechaHoraGeneracion}`, pageWidth - 15, yPosition, { align: "right" });
  doc.text(`ID Viaje: ${datos.id}`, 15, yPosition);
  yPosition += 12;

  // INFORMACIÓN GENERAL
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(23, 41, 81);
  doc.text("INFORMACIÓN GENERAL", 15, yPosition);
  yPosition += 7;

  // Nombre de la actividad
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Nombre de la actividad:", 15, yPosition);
  doc.setFont("helvetica", "normal");
  const splitActividad = doc.splitTextToSize(datos.nombre_actividad || "—", pageWidth - 30);
  doc.text(splitActividad, 15, yPosition + 5);
  yPosition += 5 + (splitActividad.length * 5);

  // Lugar de destino
  doc.setFont("helvetica", "bold");
  doc.text("Lugar de destino:", 15, yPosition);
  doc.setFont("helvetica", "normal");
  doc.text(datos.pais || "—", 15, yPosition + 5);
  yPosition += 12;

  // TABLA DE DETALLES
  autoTable(doc, {
    startY: yPosition,
    head: [["Campo", "Valor"]],
    body: [
      ["Año", datos.ano || "—"],
      ["Funcionario a cargo", datos.funcionario_a_cargo || "—"],
      ["Sector", datos.sector || "—"],
      ["Tema", datos.tema || "—"],
      ["Acuerdo N°", datos.numero_acuerdo || "—"],
      ["Autoridad/Delegado", datos.autoridad_delegado || "—"],
      ["Nombre del participante", datos.nombre_participante || "—"],
      ["Cargo/Dependencia", datos.cargo_funcionario || "—"],
      ["Organizador", datos.organizador || "—"],
      ["Modalidad", datos.modalidad || "—"],
      ["Fuente financiamiento", datos.financiamiento || "—"],
      ["Fecha actividad (inicio)", datos.fecha_actividad_inicio || "—"],
      ["Fecha actividad (final)", datos.fecha_actividad_final || "—"],
      ["Fecha viaje (inicio)", datos.fecha_viaje_inicio || "—"],
      ["Fecha viaje (final)", datos.fecha_viaje_final || "—"],
      ["Vacaciones", datos.vacaciones || "—"],
      ["Estado", datos.estado || "—"],
    ],
    headStyles: {
      fillColor: [23, 41, 81],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 60, fontStyle: "bold" },
      1: { cellWidth: "auto" },
    },
    styles: { fontSize: 9, cellPadding: 3 },
    theme: "striped",
  });

  let afterTableY = (doc as any).lastAutoTable?.finalY ?? (yPosition + 10);
  afterTableY += 10;

  // DETALLES DE VACACIONES (si aplica)
  if (datos.vacaciones === "Si" && datos.detalle_vacaciones) {
    if (afterTableY > 250) { doc.addPage(); afterTableY = 20; }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 41, 81);
    doc.text("DETALLES DE VACACIONES", 15, afterTableY);
    afterTableY += 7;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const splitVacaciones = doc.splitTextToSize(datos.detalle_vacaciones, pageWidth - 30);
    doc.setFillColor(239, 246, 255);
    doc.rect(15, afterTableY - 3, pageWidth - 30, splitVacaciones.length * 5 + 6, "F");
    doc.text(splitVacaciones, 17, afterTableY + 2);
    afterTableY += splitVacaciones.length * 5 + 10;
  }

  // *** NOTA IMPORTANTE: LA SECCIÓN "OBSERVACIONES" (CUADRO AMARILLO) HA SIDO ELIMINADA AQUÍ ***
  // Ya no se agregará el cuadro amarillo con el texto libre 'observaciones' del viaje.
  // La tabla de "REGISTRO DE SEGUIMIENTO" que contiene las observaciones detalladas (observacionesSeguimiento) se mantiene.

  // REGISTRO DE SEGUIMIENTO (observaciones detalladas)
  if (datos.observacionesSeguimiento && datos.observacionesSeguimiento.length > 0) {
    if (afterTableY > 250) { doc.addPage(); afterTableY = 20; }
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(23, 41, 81);
    doc.text("REGISTRO DE SEGUIMIENTO", 15, afterTableY);
    afterTableY += 7;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Total de observaciones: ${datos.observacionesSeguimiento.length}`, 15, afterTableY);
    afterTableY += 7;

    const observacionesData = datos.observacionesSeguimiento.map((obs, index) => [
      `#${index + 1}`,
      `${obs.fecha}\n${obs.hora}`,
      obs.observacion,
      obs.quien_envia,
      obs.quien_recibe,
    ]);

    autoTable(doc, {
      startY: afterTableY,
      head: [["#", "Fecha/Hora", "Observación", "Quién envía", "Quién recibe"]],
      body: observacionesData,
      headStyles: { fillColor: [205, 169, 95], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 
        0: { cellWidth: 10 }, 
        1: { cellWidth: 25 }, 
        2: { cellWidth: 70 }, 
        3: { cellWidth: 40 }, 
        4: { cellWidth: 40 } 
      },
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      theme: "grid",
    });
  }

  // PIE DE PÁGINA
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`, 
      pageWidth / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: "center" }
    );
  }

  // NOMBRE DEL ARCHIVO - Más descriptivo
  const nombreCorto = (datos.nombre_actividad || "Viaje")
    .slice(0, 30)
    .replace(/[^a-zA-Z0-9]/g, "_");
  const codigo = datos.id.toString().padStart(4, "0");
  const nombreArchivo = `Viaje_${codigo}_${nombreCorto}_${datos.ano}.pdf`;

  doc.save(nombreArchivo);
};

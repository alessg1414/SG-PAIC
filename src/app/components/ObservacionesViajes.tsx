"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { API_BASE } from "@/utils/api";

interface Observacion {
  id: number;
  observacion: string;
  quien_envia: string;
  quien_recibe: string;
  fecha: string;
  hora: string;
  timestamp: number;
}

interface ObservacionesViajesProps {
  viajeId: number;
  nombreActividad: string;
  lugarDestino?: string;
  onVolver?: () => void;
}

export default function ObservacionesViajes({ viajeId, nombreActividad, lugarDestino, onVolver }: ObservacionesViajesProps) {
  const toast = useRef<Toast>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔹 Estado para las observaciones (desde API)
  const [observaciones, setObservaciones] = useState<Observacion[]>([]);
  const [showDialogObservacion, setShowDialogObservacion] = useState(false);

  // Estado para el formulario de nueva observación
  const [nuevaObservacion, setNuevaObservacion] = useState({
    observacion: "",
    quien_envia: "",
    quien_recibe: "",
    fecha: null as Date | null,
    hora: null as Date | null,
  });

  // Estado para PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfNombre, setPdfNombre] = useState<string | null>(null);

  // Estado para La Gaceta
  const [gacetaUrl, setGacetaUrl] = useState("");
  const [modoEditarGaceta, setModoEditarGaceta] = useState(false);

  // 🔹 CARGAR OBSERVACIONES DESDE API
  useEffect(() => {
    fetchObservaciones();
  }, [viajeId]);

  const fetchObservaciones = async () => {
    try {
      const response = await fetch(`${API_BASE}observaciones_viajes/?viaje_id=${viajeId}`);
      const data = await response.json();
      setObservaciones(data);
    } catch (error) {
      console.error("Error cargando observaciones:", error);
    }
  };

  // Función para formatear fecha
  const formatearFecha = (fecha: Date | null) => {
    if (!fecha) return "";
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  // Función para formatear hora
  const formatearHora = (hora: Date | null) => {
    if (!hora) return "";
    const hours = String(hora.getHours()).padStart(2, "0");
    const minutes = String(hora.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 🔹 Guardar nueva observación (API)
  const guardarObservacion = async () => {
    if (!nuevaObservacion.observacion.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Campo vacío",
        detail: "Por favor escriba la observación",
        life: 3000,
      });
      return;
    }

    if (!nuevaObservacion.quien_envia.trim() || !nuevaObservacion.quien_recibe.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Campos requeridos",
        detail: "Por favor complete Quién envía y Quién recibe",
        life: 3000,
      });
      return;
    }

    if (!nuevaObservacion.fecha || !nuevaObservacion.hora) {
      toast.current?.show({
        severity: "warn",
        summary: "Fecha y hora requeridas",
        detail: "Por favor seleccione fecha y hora",
        life: 3000,
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE}observaciones_viajes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          viaje_id: viajeId,
          observacion: nuevaObservacion.observacion,
          quien_envia: nuevaObservacion.quien_envia,
          quien_recibe: nuevaObservacion.quien_recibe,
          fecha: formatearFecha(nuevaObservacion.fecha),
          hora: formatearHora(nuevaObservacion.hora),
        }),
      });

      if (!response.ok) throw new Error("Error al guardar");

      // Limpiar formulario
      setNuevaObservacion({
        observacion: "",
        quien_envia: "",
        quien_recibe: "",
        fecha: null,
        hora: null,
      });

      setShowDialogObservacion(false);

      toast.current?.show({
        severity: "success",
        summary: "Observación agregada",
        detail: "La observación se guardó correctamente",
        life: 2000,
      });

      fetchObservaciones();
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la observación",
        life: 3000,
      });
    }
  };

  // Subir PDF
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.current?.show({
        severity: "warn",
        summary: "Formato inválido",
        detail: "Solo se permiten archivos PDF",
        life: 3000,
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.current?.show({
        severity: "warn",
        summary: "Archivo muy grande",
        detail: "El archivo no debe superar 10MB",
        life: 3000,
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    setPdfNombre(file.name);

    toast.current?.show({
      severity: "success",
      summary: "PDF cargado",
      detail: "El archivo PDF se cargó correctamente",
      life: 2000,
    });
  };

  // Eliminar PDF
  const eliminarPDF = () => {
    setPdfUrl(null);
    setPdfNombre(null);
    toast.current?.show({
      severity: "info",
      summary: "PDF eliminado",
      detail: "El archivo PDF fue eliminado",
      life: 2000,
    });
  };

  // Guardar URL de La Gaceta
  const guardarGaceta = () => {
    if (!gacetaUrl.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Campo vacío",
        detail: "Por favor ingrese la URL de La Gaceta",
        life: 3000,
      });
      return;
    }

    setModoEditarGaceta(false);
    toast.current?.show({
      severity: "success",
      summary: "Guardado",
      detail: "URL de La Gaceta guardada correctamente",
      life: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast ref={toast} />
      
      {/* 🔹 ESTILOS PERSONALIZADOS PARA EL SCROLL */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CDA95F;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #172951;
        }
        
        /* Para Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #CDA95F #f1f1f1;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Botón de regreso */}
        <Button
          icon="pi pi-arrow-left"
          label="Volver a la lista"
          className="p-button-text text-[#172951] hover:text-[#CDA95F] font-semibold"
          onClick={onVolver}
        />

        {/* Título */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-[#172951] mb-2">Nombre de la actividad</h1>
          <p className="text-gray-600 text-lg mb-3">{nombreActividad}</p>
          
          {/* 🔹 LUGAR DE DESTINO */}
          {lugarDestino && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
              <i className="pi pi-map-marker text-[#CDA95F] text-xl"></i>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Lugar de destino</p>
                <p className="text-base font-semibold text-[#172951]">{lugarDestino}</p>
              </div>
            </div>
          )}
          
          <p className="text-sm text-gray-400 mt-3">ID del viaje: {viajeId}</p>
        </div>

        {/* ✅ REGISTRO DE SEGUIMIENTO - CON HISTORIAL */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-xl font-semibold text-[#172951]">Registro de seguimiento</h2>
            <Button
              icon="pi pi-plus"
              label="Agregar Observación"
              className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition-all duration-300"
              onClick={() => setShowDialogObservacion(true)}
            />
          </div>

          {/* LISTA DE OBSERVACIONES CON SCROLL */}
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {observaciones.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <i className="pi pi-inbox text-6xl mb-4 block"></i>
                <p className="text-lg">No hay observaciones registradas</p>
                <p className="text-sm mt-2">Haga clic en &quot;Agregar Observación&quot; para comenzar el seguimiento</p>
              </div>
            ) : (
              observaciones.map((obs, index) => (
                <div
                  key={obs.id}
                  className="border-l-4 border-[#CDA95F] bg-gray-50 p-5 rounded-r-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Encabezado de la observación */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#172951] text-white text-xs font-bold px-3 py-1 rounded-full">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {obs.fecha} - {obs.hora}
                      </span>
                    </div>
                  </div>

                  {/* Contenido de la observación */}
                  <div className="mb-3">
                    <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {obs.observacion}
                    </p>
                  </div>

                  {/* Footer con información de envío y recepción */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">📤 Quién envía</p>
                      <p className="text-sm font-medium text-gray-700">{obs.quien_envia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">📥 Quién recibe</p>
                      <p className="text-sm font-medium text-gray-700">{obs.quien_recibe}</p>
                    </div>
                  </div>

                  {/* Separador entre observaciones (excepto la última) */}
                  {index < observaciones.length - 1 && (
                    <div className="mt-4 border-b-2 border-dashed border-gray-300"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ SECCIÓN DE PDF Y LA GACETA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#172951] mb-4">PDF</h3>

            {pdfUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <i className="pi pi-file-pdf text-red-500 text-2xl"></i>
                  <span className="text-sm text-gray-700 flex-1 truncate">{pdfNombre}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    label="Ver PDF"
                    icon="pi pi-eye"
                    className="flex-1 bg-white hover:bg-gray-50 text-[#172951] border-2 border-[#172951] font-semibold rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
                    onClick={() => window.open(pdfUrl, "_blank")}
                  />
                  <Button
                    icon="pi pi-trash"
                    className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 font-semibold rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
                    onClick={eliminarPDF}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <i className="pi pi-upload text-gray-400 text-4xl mb-3"></i>
                  <p className="text-gray-500 text-sm mb-3">No hay PDF cargado</p>
                  <Button
                    label="Subir PDF"
                    icon="pi pi-upload"
                    className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition-all duration-300"
                    onClick={() => fileInputRef.current?.click()}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* LA GACETA */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#172951] mb-4">La Gaceta</h3>

            {!modoEditarGaceta && gacetaUrl ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded border border-gray-200">
                  <i className="pi pi-link text-blue-500 text-xl"></i>
                  <a
                    href={gacetaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex-1 truncate"
                  >
                    {gacetaUrl}
                  </a>
                </div>
                <div className="flex gap-2">
                  <Button
                    label="Abrir enlace"
                    icon="pi pi-external-link"
                    className="flex-1 bg-white hover:bg-gray-50 text-[#172951] border-2 border-[#172951] font-semibold rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
                    onClick={() => window.open(gacetaUrl, "_blank")}
                  />
                  <Button
                    icon="pi pi-pencil"
                    className="bg-white hover:bg-yellow-50 text-yellow-600 border-2 border-yellow-600 font-semibold rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
                    onClick={() => setModoEditarGaceta(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <InputText
                  value={gacetaUrl}
                  onChange={(e) => setGacetaUrl(e.target.value)}
                  placeholder="https://www.imprentanacional.go.cr/..."
                  className="w-full border border-gray-300 rounded-md p-3"
                />
                <Button
                  label="Guardar URL"
                  icon="pi pi-check"
                  className="w-full bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition-all duration-300"
                  onClick={guardarGaceta}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ DIALOG PARA AGREGAR OBSERVACIÓN */}
      <Dialog
        header="Nueva Observación"
        visible={showDialogObservacion}
        style={{ width: "600px" }}
        modal
        onHide={() => setShowDialogObservacion(false)}
        footer={
          <div className="flex justify-end gap-2 mt-4">
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 font-semibold rounded-lg shadow-sm px-4 py-2 transition-all duration-300"
              onClick={() => setShowDialogObservacion(false)}
            />
            <Button
              label="Guardar Observación"
              icon="pi pi-check"
              className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition-all duration-300"
              onClick={guardarObservacion}
            />
          </div>
        }
      >
        <div className="space-y-4">
          {/* Observación (textarea grande) */}
          <div className="flex flex-col">
            <label htmlFor="observacion" className="text-sm font-semibold text-gray-700 mb-1">
              Observación <span className="text-red-500">*</span>
            </label>
            <InputTextarea
              id="observacion"
              value={nuevaObservacion.observacion}
              onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, observacion: e.target.value })}
              rows={8}
              placeholder="Escriba aquí la observación detallada del seguimiento..."
              className="w-full border border-gray-300 rounded-md p-3 text-sm"
            />
          </div>

          {/* Quién envía */}
          <div className="flex flex-col">
            <label htmlFor="quien_envia" className="text-sm font-semibold text-gray-700 mb-1">
              Quién envía <span className="text-red-500">*</span>
            </label>
            <InputText
              id="quien_envia"
              value={nuevaObservacion.quien_envia}
              onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, quien_envia: e.target.value })}
              placeholder="Nombre de quien envía la observación"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Quién recibe */}
          <div className="flex flex-col">
            <label htmlFor="quien_recibe" className="text-sm font-semibold text-gray-700 mb-1">
              Quién recibe <span className="text-red-500">*</span>
            </label>
            <InputText
              id="quien_recibe"
              value={nuevaObservacion.quien_recibe}
              onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, quien_recibe: e.target.value })}
              placeholder="Nombre de quien recibe la observación"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Fecha y Hora en la misma línea */}
          <div className="grid grid-cols-2 gap-4">
            {/* Fecha */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Fecha <span className="text-red-500">*</span>
              </label>
              <Calendar
                value={nuevaObservacion.fecha}
                onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, fecha: e.value as Date | null })}
                showIcon
                dateFormat="dd/mm/yy"
                placeholder="Seleccione fecha"
                className="w-full"
              />
            </div>

            {/* Hora */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Hora <span className="text-red-500">*</span>
              </label>
              <Calendar
                value={nuevaObservacion.hora}
                onChange={(e) => setNuevaObservacion({ ...nuevaObservacion, hora: e.value as Date | null })}
                showIcon
                timeOnly
                hourFormat="24"
                placeholder="Seleccione hora"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
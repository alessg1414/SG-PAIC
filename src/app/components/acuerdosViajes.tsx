// AcuerdosViajes.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import AgregarViajeDialog from "./AgregarViajesDialog";
import EditarViajeDialog from "./EditarViajeDialog";
import ObservacionesViajes from "./ObservacionesViajes";
import { API_BASE, FILE_BASE } from "@/utils/api";
import { generarPDFViaje } from "@/utils/generarPDFViaje";

interface Viaje {
  id: number;
  ano: string | null;
  funcionario_a_cargo: string | null;
  nombre_actividad: string | null;
  organizador: string | null;
  pais: string | null;
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
  observaciones: string | null;
  financiamiento: string | null;
  vacaciones: string | null;
  detalle_vacaciones: string | null;
}

export default function AcuerdosViajes() {
  // 🔹 ESTADOS PARA NAVEGACIÓN INTERNA
  const [vistaActual, setVistaActual] = useState<"lista" | "observaciones">("lista");
  const [viajeSeleccionado, setViajeSeleccionado] = useState<Viaje | null>(null);

  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);

  const [registroSeleccionado, setRegistroSeleccionado] = useState<Viaje | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchViajes();
  }, []);

  // 🔹 FETCH VIAJES DESDE API
  const fetchViajes = async () => {
    try {
      const response = await fetch(`${API_BASE}viajes_al_exterior/`);
      const data = await response.json();
      setViajes(data.viajes || []);
    } catch (error) {
      console.error("Error obteniendo viajes:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudieron cargar los viajes",
        life: 3000,
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, rowData: Viaje) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.current?.show({ severity: "warn", summary: "Formato inválido", detail: "Solo PDF", life: 3000 });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.current?.show({ severity: "warn", summary: "Archivo grande", detail: "Máx 10MB", life: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", String(rowData.id));

    try {
      const response = await fetch(`${API_BASE}upload/`, { method: "POST", body: formData });
      if (!response.ok) {
        toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo subir el archivo", life: 3000 });
        return;
      }

      const { url } = await response.json();
      toast.current?.show({ severity: "success", summary: "Archivo subido", detail: "PDF subido correctamente", life: 3000 });
      fetchViajes();
    } catch (err) {
      console.error("Error upload:", err);
      toast.current?.show({ severity: "error", summary: "Error", detail: "Error al subir el archivo", life: 3000 });
    }
  };

  const handleDeletePDF = async (rowData: Viaje) => {
    try {
      toast.current?.show({
        severity: "info",
        summary: "PDF eliminado",
        detail: "El documento fue eliminado",
        life: 3000,
      });
      fetchViajes();
    } catch (_error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el documento",
        life: 3000,
      });
    }
  };

  // 🔹 ELIMINAR VIAJE CON API
  const handleDeleteViaje = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}viajes_al_exterior/?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error("Error al eliminar el viaje");

      setViajes(viajes.filter(v => v.id !== id));
      toast.current?.show({
        severity: "info",
        summary: "Eliminado",
        detail: "Viaje eliminado",
        life: 3000,
      });
    } catch (_error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el viaje",
        life: 3000,
      });
    }
  };

  const abrirDialogEditar = (rowData: Viaje) => {
    setRegistroSeleccionado(rowData);
    setShowEditDialog(true);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  // 🔹 FUNCIÓN PARA CAMBIAR A VISTA DE OBSERVACIONES
  const irAObservaciones = (viaje: Viaje) => {
    setViajeSeleccionado(viaje);
    setVistaActual("observaciones");
  };

  // 🔹 FUNCIÓN PARA VOLVER A LA LISTA
  const volverALista = () => {
    setVistaActual("lista");
    setViajeSeleccionado(null);
  };

  // 🔹 SI ESTAMOS EN VISTA DE OBSERVACIONES, MOSTRAR ESE COMPONENTE
  if (vistaActual === "observaciones" && viajeSeleccionado) {
    return (
      <div>
        <ObservacionesViajes 
          viajeId={viajeSeleccionado.id} 
          nombreActividad={viajeSeleccionado.nombre_actividad || "Sin nombre"}
          lugarDestino={viajeSeleccionado.pais || "No especificado"}
          onVolver={volverALista}
        />
      </div>
    );
  }

  const rowExpansionTemplate = (rowData: Viaje) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-1">Año</p>
          <p className="font-medium">{rowData.ano || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Organizador del evento</p>
          <p className="font-medium">{rowData.organizador || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de actividad inicio</p>
          <p className="font-medium">{rowData.fecha_actividad_inicio || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Funcionario a cargo</p>
          <p className="font-medium">{rowData.funcionario_a_cargo || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Nombre de la actividad</p>
          <p className="font-medium">{rowData.nombre_actividad || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de actividad final</p>
          <p className="font-medium">{rowData.fecha_actividad_final || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Sector</p>
          <p className="font-medium">{rowData.sector || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Lugar de destino</p>
          <p className="font-medium">{rowData.pais || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de inicio de viaje</p>
          <p className="font-medium">{rowData.fecha_viaje_inicio || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Tema</p>
          <p className="font-medium">{rowData.tema || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Modalidad</p>
          <p className="font-medium">{rowData.modalidad || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fecha de viaje final</p>
          <p className="font-medium">{rowData.fecha_viaje_final || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Acuerdo N</p>
          <p className="font-medium">{rowData.numero_acuerdo || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Fuente de financiamiento</p>
          <p className="font-medium">{rowData.financiamiento || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Estado</p>
          <p className="text-gray-700 whitespace-pre-wrap">{rowData.estado || "Sin observaciones"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Autoridad / Delegado</p>
          <p className="font-medium">{rowData.autoridad_delegado || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Vacaciones</p>
          <p className="font-medium">{rowData.vacaciones || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Nombre del funcionario(a)</p>
          <p className="font-medium">{rowData.funcionario_a_cargo || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Cargo del funcionario (a)/ Dependencia a la que pertenece</p>
          <p className="font-medium">{rowData.cargo_funcionario || "—"}</p>
        </div>
      </div>

      {/* 🔹 DETALLES DE VACACIONES */}
      {rowData.vacaciones === "Si" && rowData.detalle_vacaciones && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
          <p className="text-xs text-blue-700 font-semibold mb-2">Detalles de Vacaciones</p>
          <p className="text-sm text-gray-700 leading-relaxed">{rowData.detalle_vacaciones}</p>
        </div>
      )}
      
      {/* 🔹 BOTÓN CON NAVEGACIÓN INTERNA */}
      <Button
        label="Observaciones"
        icon="pi pi-comments"
        className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition"
        onClick={() => irAObservaciones(rowData)}
      />

      {/* 🔹 NUEVO: Botón Generar Reporte */}
      <Button
      label="Generar Reporte"
      icon="pi pi-file-pdf"
      className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md px-4 py-2 transition ml-2"
      onClick={() => {
        const observacionesSeguimiento = rowData.observaciones
          ? [
              {
                id: Date.now(),
                observacion: rowData.observaciones,
                quien_envia: "",
                quien_recibe: "",
                fecha: new Date().toLocaleDateString("es-CR"),
                hora: new Date().toLocaleTimeString("es-CR", { hour: "2-digit", minute: "2-digit" }),
              },
            ]
          : [];

        generarPDFViaje({
          id: rowData.id,
          ano: rowData.ano,
          funcionario_a_cargo: rowData.funcionario_a_cargo,
          nombre_actividad: rowData.nombre_actividad,
          organizador: rowData.organizador,
          pais: rowData.pais,
          fecha_actividad_inicio: rowData.fecha_actividad_inicio,
          fecha_actividad_final: rowData.fecha_actividad_final,
          fecha_viaje_inicio: rowData.fecha_viaje_inicio,
          fecha_viaje_final: rowData.fecha_viaje_final,
          estado: rowData.estado,
          sector: rowData.sector,
          tema: rowData.tema,
          numero_acuerdo: rowData.numero_acuerdo,
          autoridad_delegado: rowData.autoridad_delegado,
          nombre_participante: rowData.nombre_participante || null,
          cargo_funcionario: rowData.cargo_funcionario,
          modalidad: rowData.modalidad,
          financiamiento: rowData.financiamiento,
          vacaciones: rowData.vacaciones,
          detalle_vacaciones: rowData.detalle_vacaciones,
          observaciones: rowData.observaciones,
          observacionesSeguimiento: observacionesSeguimiento,
        });
      }}
    />
    </div>
  );

  // 🔹 VISTA DE LISTA DE VIAJES (VISTA PRINCIPAL)
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600">Viajes</h3>
        <div className="mt-2 mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#172951]">Lista de Viajes</h1>
          <p className="text-sm text-gray-500 mt-1">Gestión y seguimiento de acuerdos de viajes</p>
        </div>
      </div>

      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full md:w-96">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar viaje, organizador, país..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all duration-200"
          />
        </div>

        <Button
          label="Añadir Viaje"
          icon="pi pi-plus"
          className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition"
          onClick={() => setShowAddDialog(true)}
        />
      </div>

      <DataTable
        value={viajes}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="id"
        paginator
        rows={10}
        filters={{
          global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
        }}
        globalFilterFields={["nombre_actividad", "organizador", "pais", "funcionario_a_cargo", "ano"]}
        className="text-sm border border-gray-100 rounded-lg"
        responsiveLayout="scroll"
        emptyMessage="No hay viajes registrados"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="id" header="#" sortable style={{ width: "6rem" }} />
        <Column field="organizador" header="Organizador" sortable />
        <Column field="nombre_actividad" header="Nombre de la actividad" sortable />
        <Column field="pais" header="País" sortable />
        <Column 
          field="fecha_actividad_inicio" 
          header="Fecha de la actividad" 
          sortable 
          body={(rowData: Viaje) => (
            <div>
              <div>{formatDate(rowData.fecha_actividad_inicio)}</div>
              {rowData.fecha_actividad_final && (
                <div className="text-xs text-gray-500">{formatDate(rowData.fecha_actividad_final)}</div>
              )}
            </div>
          )}
        />
        <Column
          field="estado"
          header="Estado"
          sortable
          body={(rowData: Viaje) => {
            const estado = rowData.estado;
            const modalidad = rowData.modalidad;
            let colorClass = "";

            if (modalidad === "Virtual") {
              colorClass = "bg-blue-100 text-blue-800 border-blue-300";
            } 
            else if (estado === "Realizado") {
              colorClass = "bg-green-100 text-green-800 border-green-300";
            } else if (estado === "En proceso") {
              colorClass = "bg-yellow-100 text-yellow-800 border-yellow-300";
            } else if (estado === "No se participó") {
              colorClass = "bg-red-100 text-red-800 border-red-300";
            } else {
              colorClass = "bg-gray-100 text-gray-800 border-gray-300";
            }

            return (
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${colorClass} whitespace-normal break-words text-center`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "110px",
                  maxWidth: "160px",
                  lineHeight: "1.2",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {estado}
              </span>
            );
          }}
          style={{ minWidth: "130px", whiteSpace: "normal" }}
        />
        
        <Column
          header="Acciones"
          body={(rowData: Viaje) => (
            <div className="flex gap-1 justify-center">
              <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-sm p-button-text text-yellow-600"
                onClick={() => abrirDialogEditar(rowData)}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-sm p-button-text text-red-500"
                onClick={() => {
                  setRegistroSeleccionado(rowData);
                  setShowConfirmDialog(true);
                }}
              />
            </div>
          )}
          style={{ width: "100px" }}
        />
      </DataTable>

      <AgregarViajeDialog
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        onSave={() => {
          toast.current?.show({
            severity: "success",
            summary: "Viaje agregado",
            detail: "El viaje fue agregado",
            life: 3000,
          });
          fetchViajes();
        }}
      />

      <EditarViajeDialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        registro={registroSeleccionado}
        onSave={() => {
          toast.current?.show({
            severity: "success",
            summary: "Actualizado",
            detail: "Viaje actualizado",
            life: 3000,
          });
          fetchViajes();
        }}
      />

      <Dialog
        visible={showConfirmDialog}
        style={{ width: 450 }}
        header="Confirmar eliminación"
        modal
        onHide={() => setShowConfirmDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button 
              label="Cancelar" 
              icon="pi pi-times" 
              onClick={() => setShowConfirmDialog(false)} 
              className="p-button-text" 
            />
            <Button
              label="Eliminar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => {
                if (registroSeleccionado) handleDeleteViaje(registroSeleccionado.id);
                setShowConfirmDialog(false);
              }}
            />
          </div>
        }
      >
        {registroSeleccionado && (
          <div>
            <p className="text-gray-700">¿Seguro que deseas eliminar este viaje?</p>
            <p className="font-semibold text-red-600">{registroSeleccionado.nombre_actividad}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
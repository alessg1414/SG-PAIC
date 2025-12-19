"use client";

import { useEffect, useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import EditarProyectoDialog from "./EditarProyectoDialog";
import AgregarProyectoDialog from "./AgregarProyectoDialog";
import { API_BASE, FILE_BASE } from "@/utils/api";

interface Proyecto {
  NumProyecto?: number;
  CantidadDependencias: string | null;
  NombreActor: string | null;
  NombreProyecto: string | null;
  FechaAprovacion: string | null;
  EtapaProyecto: string | null;
  DependenciasSolicitantes: string | null;
  CostoTotal: string | null;
  ContrapartidaInstitucional: string | null;
  DocumentosCambiar: string | null;
  Observaciones: string | null;
  ObjetivoGeneral: string | null;
  Resultados: string | null;
  Productos: string | null;
  Ano: string | null;
  ContrapartidaCooperante: string | null;
  IdAreas: number;
  InstitucionSolicitante: string | string[] | null;
  Region: string | null;
  Modalidad: string | null;
  Sector: string | null;
  TipoCooperacion: string | null;
  AutoridadAcargo: string | null;
}

interface Areas {
  IdAreas: number;
  NombreArea: string | null;
}

export default function Proyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef<Toast>(null);

  const [registroSeleccionado, setRegistroSeleccionado] = useState<Proyecto | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [areas, setAreas] = useState<Record<number, string>>({});

  // refs de input file por NumProyecto
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchProyectos();
    fetchAreas();
  }, []);

  const fetchProyectos = async () => {
    try {
      const response = await fetch(`${API_BASE}proyectos/`);
      const data = await response.json();
      const list: Proyecto[] = Array.isArray(data) ? data : (data?.proyectos ?? []);
      setProyectos(list);
    } catch (error) {
      console.error("Error obteniendo proyectos:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar los proyectos", life: 3000 });
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_BASE}areas/`);
      const data = await response.json();

      const map: Record<number, string> = {};
      data.forEach((a: any) => {
        map[a.IdAreas] = a.NombreArea;
      });

      setAreas(map);
    } catch (error) {
      console.error("Error cargando áreas:", error);
    }
  };

  const handleFileUpload = async (event: any, rowData: Proyecto) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", String(rowData.NumProyecto));

    const response = await fetch(`${API_BASE}upload/`, { method: "POST", body: formData });

    if (!response.ok) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo subir el archivo", life: 3000 });
      return;
    }

    const { url } = await response.json();

    await fetch(`${API_BASE}proyectos/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ NumProyecto: rowData.NumProyecto, DocumentosCambiar: url }),
    });

    toast.current?.show({ severity: "success", summary: "Archivo subido", detail: "PDF subido correctamente", life: 3000 });
    fetchProyectos();
  };

  const handleDeletePDF = async (rowData: Proyecto) => {
    try {
      await fetch(`${API_BASE}proyectos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NumProyecto: rowData.NumProyecto, DocumentosCambiar: "" }),
      });

      toast.current?.show({ severity: "info", summary: "PDF eliminado", detail: "El documento fue eliminado", life: 3000 });
      fetchProyectos();
    } catch (_error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el documento", life: 3000 });
    }
  };

  const handleDeleteProyecto = async (NumProyecto?: number) => {
    if (!NumProyecto) return;
    
    try {
      const response = await fetch(`${API_BASE}proyectos/?NumProyecto=${NumProyecto}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar proyecto");

      toast.current?.show({ severity: "info", summary: "Eliminado", detail: "Proyecto eliminado", life: 3000 });
      fetchProyectos();
    } catch (_error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el proyecto", life: 3000 });
    }
  };

  const abrirDialogEditar = (rowData: Proyecto) => {
    setRegistroSeleccionado(rowData);
    setShowEditDialog(true);
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currency = (valor?: string | null) => {
    if (!valor) return "";
    const num = Number(String(valor).replace(/[^0-9.-]/g, ""));
    if (Number.isNaN(num)) return valor;
    return `$ ${num.toLocaleString("es-CR", { minimumFractionDigits: 2 })}`;
  };

  const formatDependencias = (dependencias: string | string[] | null) => {
    if (!dependencias) return "—";
    if (Array.isArray(dependencias)) {
      return dependencias.join(", ");
    }
    return dependencias;
  };

  const rowExpansionTemplate = (rowData: Proyecto) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-1">Nombre Actor</p>
          <p className="font-medium">{rowData.NombreActor || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Etapa</p>
          <p className="font-medium">{rowData.EtapaProyecto || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Modalidad</p>
          <p className="font-medium">{rowData.Modalidad || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Sector</p>
          <p className="font-medium">{rowData.Sector || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Tipo de Cooperación</p>
          <p className="font-medium">{rowData.TipoCooperacion || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Autoridad a Cargo</p>
          <p className="font-medium">{rowData.AutoridadAcargo || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Costo Total</p>
          <p className="font-medium">{currency(rowData.CostoTotal)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Aprobación</p>
          <p className="font-medium">{formatDate(rowData.FechaAprovacion)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Año</p>
          <p className="font-medium">{rowData.Ano || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Área</p>
          <p className="font-medium">{areas[rowData.IdAreas] || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Región</p>
          <p className="font-medium">{rowData.Region || "—"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-gray-500 mb-1">Dependencias Solicitantes</p>
          <p className="font-medium">{formatDependencias(rowData.InstitucionSolicitante)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Cantidad Dependencias</p>
          <p className="font-medium">{rowData.CantidadDependencias || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Contrapartida Institucional</p>
          <p className="font-medium">{currency(rowData.ContrapartidaInstitucional)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Contrapartida Cooperante</p>
          <p className="font-medium">{currency(rowData.ContrapartidaCooperante)}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Objetivo General</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.ObjetivoGeneral || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Resultados</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Resultados || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Productos</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Productos || "—"}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Observaciones</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Observaciones || "—"}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow">
      <Toast ref={toast} />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative w-full md:w-96">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar proyecto, actor, región..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all duration-200"
          />
        </div>

        <Button
          label="Añadir"
          icon="pi pi-plus"
          className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold rounded-lg shadow-md px-4 py-2 transition"
          onClick={() => setShowAddDialog(true)}
        />
      </div>

      <DataTable
        value={proyectos}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="NumProyecto"
        paginator
        rows={10}
        filters={{
          global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
        }}
        globalFilterFields={["NombreProyecto", "NombreActor", "Region", "EtapaProyecto", "Ano"]}
        className="text-sm border border-gray-100 rounded-lg"
        responsiveLayout="scroll"
        emptyMessage="No hay proyectos"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="NumProyecto" header="#" sortable style={{ width: "6rem" }} />
        <Column field="NombreProyecto" header="Proyecto" sortable />
        <Column field="NombreActor" header="Nombre Actor" sortable />
        <Column field="EtapaProyecto" header="Etapa" sortable />
        <Column field="Region" header="Región" sortable />
        <Column field="Ano" header="Año" sortable style={{ width: "6rem" }} />
        <Column
          field="DocumentosCambiar"
          header="Documentos"
          body={(rowData: Proyecto) => {
            // Separar múltiples documentos si están separados por coma
            const documentos = rowData.DocumentosCambiar 
              ? rowData.DocumentosCambiar.split(",").map(d => d.trim()).filter(d => d) 
              : [];
            
            return (
              <div className="flex items-center gap-2">
                {documentos.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {documentos.map((doc, index) => {
                      const fileName = doc.split("/").pop();
                      return (
                        <a
                          key={index}
                          href={`${FILE_BASE}${doc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:underline truncate max-w-[150px]"
                          title={fileName}
                        >
                          <i className="pi pi-file-pdf text-red-500" />
                          <span className="truncate">{fileName || `Documento ${index + 1}`}</span>
                        </a>
                      );
                    })}
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text text-red-500 text-xs"
                      onClick={() => handleDeletePDF(rowData)}
                      title="Eliminar documentos"
                    />
                  </div>
                ) : (
                  <>
                    <Button
                      icon="pi pi-upload"
                      className="p-button-text text-[#172951]"
                      onClick={() => fileInputRefs.current[rowData.NumProyecto!]?.click()}
                      title="Subir PDF"
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={(el) => {
                        if (el && rowData.NumProyecto) fileInputRefs.current[rowData.NumProyecto] = el;
                      }}
                      onChange={(event) => handleFileUpload(event, rowData)}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>
            );
          }}
        />
        <Column
          header="Acciones"
          body={(rowData: Proyecto) => (
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

      {/* Editar */}
      <EditarProyectoDialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        registro={registroSeleccionado}
        onSave={() => {
          toast.current?.show({ severity: "success", summary: "Actualizado", detail: "Proyecto actualizado", life: 3000 });
          fetchProyectos();
        }}
      />

      {/* Crear */}
      <AgregarProyectoDialog
        visible={showAddDialog}
        onHide={() => setShowAddDialog(false)}
        onSave={() => {
          toast.current?.show({ severity: "success", summary: "Proyecto agregado", detail: "El proyecto fue agregado", life: 3000 });
          fetchProyectos();
        }}
      />

      {/* Confirmación eliminar */}
      <Dialog
        visible={showConfirmDialog}
        style={{ width: 450 }}
        header="Confirmar eliminación"
        modal
        onHide={() => setShowConfirmDialog(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setShowConfirmDialog(false)} className="p-button-text" />
            <Button
              label="Eliminar"
              icon="pi pi-check"
              className="p-button-danger"
              onClick={() => {
                if (registroSeleccionado) handleDeleteProyecto(registroSeleccionado.NumProyecto);
                setShowConfirmDialog(false);
              }}
            />
          </div>
        }
      >
        {registroSeleccionado && (
          <div>
            <p className="text-gray-700">¿Seguro que deseas eliminar el proyecto?</p>
            <p className="font-semibold text-red-600">{registroSeleccionado.NombreProyecto}</p>
          </div>
        )}
      </Dialog>
    </div>
  );
}

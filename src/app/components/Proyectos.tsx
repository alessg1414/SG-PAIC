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
  NumProyecto: number;
  ActorCooperacion: string | null;
  NombreActor: string | null;
  NombreProyecto: string | null;
  FechaAprovacion: string | null; // YYYY-MM-DD
  EtapaProyecto: string | null;
  TipoProyecto: string | null;
  CostoTotal: string | null;
  ContrapartidaInstitucion: string | null;
  Documentos: string | null; // ruta/archivo.pdf
  Observaciones: string | null;
  Objetivos: string | null;
  Resultados: string | null;
  Tematicas: string | null;
  Dependencia: string | null;
  Ano: string | null; // 4
  ContrapartidaCooperante: string | null;
  Areas: string | null;
  InstitucionSolicitante: string | null;
  Region: string | null;
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

  // refs de input file por NumProyecto
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      const response = await fetch(`${API_BASE}proyectos/`);
      const data = await response.json();
      const list: Proyecto[] = (data?.proyectos ?? data) || [];
      setProyectos(list);
    } catch (error) {
      console.error("Error obteniendo proyectos:", error);
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudieron cargar los proyectos", life: 3000 });
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
      body: JSON.stringify({ NumProyecto: rowData.NumProyecto, Documentos: url }),
    });

    toast.current?.show({ severity: "success", summary: "Archivo subido", detail: "PDF subido correctamente", life: 3000 });
    fetchProyectos();
  };

  const handleDeletePDF = async (rowData: Proyecto) => {
    try {
      await fetch(`${API_BASE}proyectos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NumProyecto: rowData.NumProyecto, Documentos: "" }),
      });

      toast.current?.show({ severity: "info", summary: "PDF eliminado", detail: "El documento fue eliminado", life: 3000 });
      fetchProyectos();
    } catch (_error) {
      toast.current?.show({ severity: "error", summary: "Error", detail: "No se pudo eliminar el documento", life: 3000 });
    }
  };

  const handleDeleteProyecto = async (NumProyecto: number) => {
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
    return `₡ ${num.toLocaleString("es-CR", { minimumFractionDigits: 2 })}`;
  };

  const rowExpansionTemplate = (rowData: Proyecto) => (
    <div className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-800">
        <div>
          <p className="text-xs text-gray-500 mb-1">Actor de Cooperación</p>
          <p className="font-medium">{rowData.ActorCooperacion}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Nombre Actor</p>
          <p className="font-medium">{rowData.NombreActor}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Etapa</p>
          <p className="font-medium">{rowData.EtapaProyecto}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Tipo</p>
          <p className="font-medium">{rowData.TipoProyecto}</p>
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
          <p className="font-medium">{rowData.Ano}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Área</p>
          <p className="font-medium">{rowData.Areas}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Región</p>
          <p className="font-medium">{rowData.Region}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Dependencia</p>
          <p className="font-medium">{rowData.Dependencia}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Institución Solicitante</p>
          <p className="font-medium">{rowData.InstitucionSolicitante}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Contrapartida (Institución)</p>
          <p className="font-medium">{rowData.ContrapartidaInstitucion}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Contrapartida (Cooperante)</p>
          <p className="font-medium">{rowData.ContrapartidaCooperante}</p>
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Temáticas</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Tematicas}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Objetivos</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Objetivos}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Resultados</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Resultados}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Observaciones</p>
        <p className="text-gray-700 whitespace-pre-wrap">{rowData.Observaciones}</p>
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
            placeholder="Buscar proyecto, actor, dependencia..."
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
        globalFilterFields={["NombreProyecto", "NombreActor", "ActorCooperacion", "Dependencia", "InstitucionSolicitante", "Ano"]}
        className="text-sm border border-gray-100 rounded-lg"
        responsiveLayout="scroll"
        emptyMessage="No hay proyectos"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="NumProyecto" header="#" sortable style={{ width: "6rem" }} />
        <Column field="NombreProyecto" header="Proyecto" sortable />
        <Column field="NombreActor" header="Nombre Actor" sortable />
        <Column field="ActorCooperacion" header="Actor de Cooperación" sortable />
        <Column field="EtapaProyecto" header="Etapa" sortable />
        <Column field="TipoProyecto" header="Tipo" sortable />
        <Column field="Ano" header="Año" sortable style={{ width: "6rem" }} />
        <Column
          field="Documentos"
          header="PDF"
          body={(rowData: Proyecto) => {
            const fileName = rowData.Documentos?.split("/").pop();
            return (
              <div className="flex items-center gap-2">
                {rowData.Documentos ? (
                  <>
                    <a
                      href={`${FILE_BASE}${rowData.Documentos}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline truncate max-w-[150px]"
                      title={fileName}
                    >
                      <i className="pi pi-file-pdf text-red-500" />
                      <span className="truncate">{fileName}</span>
                    </a>
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text text-red-500"
                      onClick={() => handleDeletePDF(rowData)}
                      title="Eliminar PDF"
                    />
                  </>
                ) : (
                  <>
                    <Button
                      icon="pi pi-upload"
                      className="p-button-text text-[#172951]"
                      onClick={() => fileInputRefs.current[rowData.NumProyecto]?.click()}
                      title="Subir PDF"
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={(el) => {
                        if (el) fileInputRefs.current[rowData.NumProyecto] = el;
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

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { API_BASE } from "@/utils/api";
import AgregarOrdenDialog from "./AgregarOrdenDialog";
import EditarOrdenDialog from "./EditarOrdenDialog";

// Interfaces
interface SubpartidaContratacion {
  id: number;
  subpartida: string;
  ano_contrato: string;
  nombre_subpartida: string;
  descripcion_contratacion: string;
  numero_contratacion: string;
  numero_contrato: string;
  numero_orden_compra: string;
  orden_pedido_sicop: string;
  presupuesto_asignado: number;
  // Calculados
  monto_consumido?: number;
  saldo?: number;
}

interface SolicitudPresupuesto {
  id: number;
  subpartida_contratacion_id: number;
  descripcion: string;
  
  // Fase 1: Solicitud
  fecha_solicitud_boleto: string;
  hora_solicitud_boleto: string;
  oficio_solicitud: string;
  fecha_respuesta_solicitud: string;
  hora_respuesta_solicitud: string;
  cumple_solicitud: 'Sí' | 'No' | 'Pendiente';
  
  // Fase 2: Emisión
  fecha_solicitud_emision: string;
  hora_solicitud_emision: string;
  oficio_emision: string;
  fecha_respuesta_emision: string;
  hora_respuesta_emision: string;
  cumple_emision: 'Sí' | 'No' | 'Pendiente';
  
  // Fase 3: Recepción
  fecha_recibido_conforme: string;
  hora_recibido_conforme: string;
  oficio_recepcion: string;
  
  // Fase 4: Facturación
  numero_factura: string;
  total_factura: number;
  
  // Fase 5: Entrega
  fecha_entrega_direccion: string;
  
  estado: string;
  activo: boolean;
}

export default function PresupuestosTable() {
  // ...existing code...
  const [anoFiltro, setAnoFiltro] = useState<string>("");
  // Diálogos para orden
  const [showAgregarOrden, setShowAgregarOrden] = useState(false);
  const [showEditarOrden, setShowEditarOrden] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<SolicitudPresupuesto | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [ordenAEliminar, setOrdenAEliminar] = useState<SolicitudPresupuesto | null>(null);
  const toast = useRef<Toast>(null);
  
  const [subpartidas, setSubpartidas] = useState<SubpartidaContratacion[]>([]);
  const [solicitudes, setSolicitudes] = useState<SolicitudPresupuesto[]>([]);
  const [fichaSeleccionada, setFichaSeleccionada] = useState<SubpartidaContratacion | null>(null);
  const [subpartidaFiltro, setSubpartidaFiltro] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
  const [isMounted, setIsMounted] = useState(false);

  // Cargar subpartidas al montar
  useEffect(() => {
    fetchSubpartidas();
    setIsMounted(true);
  }, []);

  // Cargar solicitudes cuando se selecciona una subpartida o año
  useEffect(() => {
    if (subpartidaFiltro && anoFiltro) {
      fetchFichaYSolicitudes(subpartidaFiltro, anoFiltro);
    } else if (subpartidaFiltro) {
      fetchFichaYSolicitudes(subpartidaFiltro, "");
    }
  }, [subpartidaFiltro, anoFiltro]);

  const fetchSubpartidas = async () => {
    try {
      const response = await fetch(`${API_BASE}subpartida_contratacion/`);
      const data = await response.json();
      setSubpartidas(data || []);
    } catch (error) {
      console.error("Error obteniendo subpartidas:", error);
      toast.current?.show({ 
        severity: "error", 
        summary: "Error", 
        detail: "No se pudieron cargar las subpartidas", 
        life: 3000 
      });
    }
  };

  const fetchFichaYSolicitudes = async (subpartida: string, ano: string) => {
    try {
      // Buscar la ficha de la subpartida seleccionada y año
      let fichaEncontrada = subpartidas.find(s => s.subpartida === subpartida && (ano ? s.ano_contrato === ano : true));
      if (!fichaEncontrada && ano) {
        // Si no hay coincidencia exacta, buscar solo por subpartida
        fichaEncontrada = subpartidas.find(s => s.subpartida === subpartida);
      }
      if (!fichaEncontrada) return;

      // Obtener todas las solicitudes de esta subpartida y año
      const response = await fetch(`${API_BASE}solicitud_presupuesto/`);
      const data = await response.json();
      let solicitudesFiltradas = (data || []).filter(
        (s: SolicitudPresupuesto) => s.subpartida_contratacion_id === fichaEncontrada.id
      );
      if (ano) {
        solicitudesFiltradas = fichaEncontrada.ano_contrato === ano ? solicitudesFiltradas : [];
      }

      // Calcular monto consumido y saldo
      const montoConsumido = solicitudesFiltradas.reduce(
        (sum: number, s: SolicitudPresupuesto) => sum + Number(s.total_factura || 0), 
        0
      );
      const fichaConCalculos = {
        ...fichaEncontrada,
        monto_consumido: montoConsumido,
        saldo: fichaEncontrada.presupuesto_asignado - montoConsumido
      };
      setFichaSeleccionada(fichaConCalculos);
      setSolicitudes(solicitudesFiltradas);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      toast.current?.show({ 
        severity: "error", 
        summary: "Error", 
        detail: "No se pudieron cargar los datos", 
        life: 3000 
      });
    }
  };

  const formatCurrency = (value: number | string | null | undefined) => {
    if (!value) return "₡ 0.00";
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return "₡ 0.00";
    return `₡ ${num.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Template de expansión con las 5 fases
  const rowExpansionTemplate = useCallback((rowData: SolicitudPresupuesto) => {
    return (
      <div className="p-5 bg-gray-50 border border-gray-200 rounded-lg text-sm space-y-4">
        {/* Fase 1: Solicitud */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-700 mb-2">Fase 1: Solicitud Inicial</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Fecha Solicitud</p>
              <p className="font-medium">{formatDate(rowData.fecha_solicitud_boleto)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora</p>
              <p className="font-medium">{rowData.hora_solicitud_boleto}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Oficio</p>
              <p className="font-medium">{rowData.oficio_solicitud}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fecha Respuesta</p>
              <p className="font-medium">{formatDate(rowData.fecha_respuesta_solicitud)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora Respuesta</p>
              <p className="font-medium">{rowData.hora_respuesta_solicitud}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cumple</p>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                rowData.cumple_solicitud === 'Sí' ? 'bg-green-100 text-green-800' :
                rowData.cumple_solicitud === 'No' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {rowData.cumple_solicitud}
              </span>
            </div>
          </div>
        </div>

        {/* Fase 2: Emisión */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <h4 className="font-bold text-green-700 mb-2">Fase 2: Emisión</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Fecha Solicitud Emisión</p>
              <p className="font-medium">{formatDate(rowData.fecha_solicitud_emision)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora</p>
              <p className="font-medium">{rowData.hora_solicitud_emision}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Oficio</p>
              <p className="font-medium">{rowData.oficio_emision}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fecha Respuesta</p>
              <p className="font-medium">{formatDate(rowData.fecha_respuesta_emision)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora Respuesta</p>
              <p className="font-medium">{rowData.hora_respuesta_emision}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cumple</p>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                rowData.cumple_emision === 'Sí' ? 'bg-green-100 text-green-800' :
                rowData.cumple_emision === 'No' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {rowData.cumple_emision}
              </span>
            </div>
          </div>
        </div>

        {/* Fase 3: Recepción Conforme */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <h4 className="font-bold text-yellow-700 mb-2">Fase 3: Recepción Conforme</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Fecha Recibido</p>
              <p className="font-medium">{formatDate(rowData.fecha_recibido_conforme)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hora</p>
              <p className="font-medium">{rowData.hora_recibido_conforme}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Oficio</p>
              <p className="font-medium">{rowData.oficio_recepcion}</p>
            </div>
          </div>
        </div>

        {/* Fase 4: Facturación */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
          <h4 className="font-bold text-orange-700 mb-2">Fase 4: Facturación</h4>
          <div className="grid grid-cols-2 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Número de Factura</p>
              <p className="font-medium">{rowData.numero_factura}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Factura</p>
              <p className="font-bold text-lg text-[#CDA95F]">{formatCurrency(rowData.total_factura)}</p>
            </div>
          </div>
        </div>

        {/* Fase 5: Entrega */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h4 className="font-bold text-purple-700 mb-2">Fase 5: Entrega a Dirección</h4>
          <div className="grid grid-cols-2 gap-3 text-gray-700">
            <div>
              <p className="text-xs text-gray-500">Fecha Entrega</p>
              <p className="font-medium">{formatDate(rowData.fecha_entrega_direccion)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <span className="px-3 py-1 rounded-full bg-[#172951] text-white text-xs font-semibold">
                {rowData.estado}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }, []);

  // Opciones de subpartidas para el dropdown (solo subpartida)
  const opcionesSubpartida = Array.from(new Set(subpartidas.map(s => s.subpartida))).map(sub => ({
    label: sub,
    value: sub
  }));

  // Opciones de años para el dropdown
  const opcionesAno = Array.from(new Set(subpartidas.map(s => s.ano_contrato))).map(ano => ({
    label: ano,
    value: ano
  }));

  if (!isMounted) return null;

  return (
    <>
      <Toast ref={toast} />
      
      <div className="p-6 bg-white rounded-xl border border-gray-200 shadow">
        <h1 className="text-3xl font-bold text-[#172951] mb-2">Presupuestos</h1>
        <p className="text-gray-600 mb-6">Gestión y seguimiento de los presupuestos por subpartida</p>

        {/* Filtros y botones */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <i className="pi pi-search text-gray-500" />

            <Dropdown
              value={subpartidaFiltro}
              options={opcionesSubpartida}
              onChange={(e) => setSubpartidaFiltro(e.value)}
              placeholder="Subpartida *"
              className="p-inputtext-sm border border-gray-400 rounded-md px-4 py-2 bg-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 hover:shadow-lg 
                         transition-all duration-300 w-56"
            />
            <Dropdown
              value={anoFiltro}
              options={opcionesAno}
              onChange={(e) => setAnoFiltro(e.value)}
              placeholder="Año *"
              className="p-inputtext-sm border border-gray-400 rounded-md px-4 py-2 bg-white shadow-sm 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500 hover:shadow-lg 
                         transition-all duration-300 w-40"
            />
          </div>
          <div className="flex gap-4">
            <Button 
              label="Añadir orden" 
              icon="pi pi-plus" 
              className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold py-2 px-4 rounded-lg 
                         shadow-md transition-all duration-300 transform hover:scale-105"
              disabled={!subpartidaFiltro}
              onClick={() => setShowAgregarOrden(true)}
            />
          </div>
        </div>

        {/* Layout: Ficha izquierda + Tabla derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ficha del subpartido */}
          <div className="lg:col-span-1">
            {fichaSeleccionada ? (
              <div className="bg-gradient-to-br from-[#172951] to-[#1a3a6b] text-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 border-b border-white/30 pb-3">
                  {fichaSeleccionada.nombre_subpartida}
                </h2>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/70 text-xs mb-1">Descripción</p>
                    <p className="leading-relaxed">{fichaSeleccionada.descripcion_contratacion}</p>
                  </div>

                  <div className="pt-3 border-t border-white/20">
                    <p className="text-white/70 text-xs mb-1">Año</p>
                    <p className="font-mono">{fichaSeleccionada.ano_contrato}</p>
                  </div>

                  <div className="pt-3 border-t border-white/20">
                    <p className="text-white/70 text-xs mb-1">Contratación</p>
                    <p className="font-mono">{fichaSeleccionada.numero_contratacion}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-xs mb-1">Contrato número</p>
                    <p className="font-mono">{fichaSeleccionada.numero_contrato}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-xs mb-1">Nº orden de compra</p>
                    <p className="font-mono">{fichaSeleccionada.numero_orden_compra}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-xs mb-1">Orden de pedido SICOP</p>
                    <p className="font-mono">{fichaSeleccionada.orden_pedido_sicop}</p>
                  </div>
                </div>

                {/* Presupuesto */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="bg-yellow-400/10 backdrop-blur-sm rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">Presupuesto Inicial</span>
                      <span className="font-bold text-[#CDA95F]">
                        {formatCurrency(fichaSeleccionada.presupuesto_asignado)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">Monto Consumido</span>
                      <span className="font-semibold">
                        {formatCurrency(fichaSeleccionada.monto_consumido || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/20">
                      <span className="text-sm font-bold">Saldo</span>
                      <span className={`font-bold text-lg ${
                        (fichaSeleccionada.saldo || 0) < 0 ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {formatCurrency(fichaSeleccionada.saldo || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    label="Añadir subpartido"
                    icon="pi pi-plus"
                    className="flex-1 bg-[#CDA95F] hover:bg-[#b8934d] text-white font-semibold py-2 px-3 
                               rounded-lg shadow-md transition-all duration-300 text-sm"
                  />
                  <Button
                    label="Editar subpartido"
                    icon="pi pi-pencil"
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 
                               rounded-lg shadow-md transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 p-8 rounded-xl text-center">
                <i className="pi pi-info-circle text-4xl text-gray-400 mb-3"></i>
                <p className="text-gray-600">Seleccione una subpartida para ver los detalles</p>
              </div>
            )}
          </div>

          {/* Tabla de solicitudes */}
          <div className="lg:col-span-2">
            <DataTable
              value={solicitudes}
              expandedRows={expandedRows}
              onRowToggle={(e) => setExpandedRows(e.data)}
              rowExpansionTemplate={rowExpansionTemplate}
              dataKey="id"
              paginator
              rows={5}
              filters={{
                global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS }
              }}
              globalFilterFields={["descripcion", "numero_factura", "oficio_solicitud"]}
              responsiveLayout="scroll"
              className="text-sm border border-gray-100 rounded-lg"
              emptyMessage="No hay órdenes registradas"
            >
              <Column expander style={{ width: "3rem" }} />
              <Column 
                field="id" 
                header="Registro" 
                sortable 
                style={{ width: "5rem" }}
                body={(row) => (
                  <span className="flex justify-center items-center bg-[#CDA95F] text-white 
                                   font-bold text-sm rounded-full w-8 h-8">
                    {row.id}
                  </span>
                )}
              />
              <Column field="descripcion" header="Descripción" sortable />
              <Column 
                field="total_factura" 
                header="Monto" 
                sortable 
                body={(row) => (
                  <span className="font-semibold text-[#172951]">
                    {formatCurrency(row.total_factura)}
                  </span>
                )}
              />
              <Column 
                field="estado" 
                header="Estado" 
                sortable
                body={(row) => (
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                    {row.estado}
                  </span>
                )}
              />
              <Column
                header="Acciones"
                body={(row) => (
                  <div className="flex gap-2">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-text p-button-warning"
                      title="Editar"
                      onClick={() => {
                        setOrdenSeleccionada(row);
                        setShowEditarOrden(true);
                      }}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-sm p-button-text p-button-danger"
                      title="Eliminar"
                      onClick={() => {
                        setOrdenAEliminar(row);
                        setShowConfirmDelete(true);
                      }}
                    />
                  </div>
                )}
                style={{ width: "7rem" }}
              />
            </DataTable>
          </div>
        </div>
      {/* Diálogo para agregar orden */}
      <AgregarOrdenDialog
        visible={showAgregarOrden}
        onHide={() => setShowAgregarOrden(false)}
        onRefresh={() => fetchFichaYSolicitudes(subpartidaFiltro, anoFiltro)}
        subpartidaId={fichaSeleccionada?.id ?? 0}
        subpartidas={opcionesSubpartida.map(opt => opt.value)}
      />
      {/* Diálogo para editar orden */}
      <EditarOrdenDialog
        visible={showEditarOrden}
        onHide={() => setShowEditarOrden(false)}
        onRefresh={() => fetchFichaYSolicitudes(subpartidaFiltro, anoFiltro)}
        orden={ordenSeleccionada}
      />
      {/* Diálogo de confirmación para eliminar */}
      {showConfirmDelete && (
        <Dialog header="Confirmar eliminación" visible={showConfirmDelete} style={{ width: "30vw" }} onHide={() => setShowConfirmDelete(false)}>
          <div className="p-4">
            <p className="mb-4">¿Está seguro que desea eliminar la orden <b>#{ordenAEliminar?.id}</b>?</p>
            <div className="flex justify-end gap-2">
              <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={() => setShowConfirmDelete(false)} />
              <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={async () => {
                if (!ordenAEliminar) return;
                try {
                  const response = await fetch(`${API_BASE}solicitud_presupuesto/${ordenAEliminar.id}/`, { method: "DELETE" });
                  if (!response.ok) throw new Error("Error al eliminar la orden");
                  toast.current?.show({ severity: "success", summary: "Eliminado", detail: "Orden eliminada correctamente", life: 2000 });
                  setShowConfirmDelete(false);
                  setOrdenAEliminar(null);
                  fetchFichaYSolicitudes(subpartidaFiltro, anoFiltro);
                } catch (error) {
                  toast.current?.show({ severity: "error", summary: "Error", detail: `Error al eliminar: ${(error as any).message}`, life: 3000 });
                }
              }} />
            </div>
          </div>
        </Dialog>
      )}
      </div>
    </>
  );
}
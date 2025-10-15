"use client";

import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { API_BASE } from "@/utils/api";

export interface Proyecto {
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

interface EditarProyectoDialogProps {
  visible: boolean;
  onHide: () => void;
  registro: Proyecto | null;
  onSave: () => void; // callback para refrescar y toasts desde el padre
}

export default function EditarProyectoDialog({ visible, onHide, registro, onSave }: EditarProyectoDialogProps) {
  const [formData, setFormData] = useState<Proyecto>({
    NumProyecto: 0,
    ActorCooperacion: null,
    NombreActor: null,
    NombreProyecto: null,
    FechaAprovacion: null,
    EtapaProyecto: null,
    TipoProyecto: null,
    CostoTotal: null,
    ContrapartidaInstitucion: null,
    Documentos: null,
    Observaciones: null,
    Objetivos: null,
    Resultados: null,
    Tematicas: null,
    Dependencia: null,
    Ano: null,
    ContrapartidaCooperante: null,
    Areas: null,
    InstitucionSolicitante: null,
    Region: null,
  });

  // Cargar datos iniciales del registro seleccionado
  useEffect(() => {
    if (registro) setFormData(registro);
  }, [registro]);

  const handleChange = (field: keyof Proyecto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as Proyecto));
  };

  const toISODate = (value: Date | null) => (value ? new Date(value).toISOString().split("T")[0] : null);

  const handleSubmit = async () => {
    try {
      const payload: Proyecto = {
        ...formData,
        // asegurar formato de fecha correcto
        FechaAprovacion: formData.FechaAprovacion,
      };

      const response = await fetch(`${API_BASE}proyectos/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al actualizar el proyecto");

      onSave();
      onHide();
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
    }
  };

  return (
    <Dialog
      header="Editar Proyecto"
      visible={visible}
      style={{ width: "70vw", maxWidth: 900 }}
      modal
      onHide={onHide}
      className="p-dialog-custom"
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} />
          <Button
            label="Guardar cambios"
            icon="pi pi-check"
            className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            onClick={handleSubmit}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm mt-2">
        {/* NumProyecto (solo lectura) */}
        <div className="flex flex-col">
          <label className="font-semibold">Número de Proyecto</label>
          <InputText value={String(formData.NumProyecto ?? "")} disabled className="w-full border border-gray-300 rounded-md p-2 bg-gray-100" />
        </div>

        {/* Año */}
        <div className="flex flex-col">
          <label className="font-semibold">Año</label>
          <InputText value={formData.Ano ?? ""} maxLength={4} onChange={(e) => handleChange("Ano", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Fecha Aprobación */}
        <div className="flex flex-col">
          <label className="font-semibold">Fecha de Aprobación</label>
          <Calendar
            value={formData.FechaAprovacion ? new Date(formData.FechaAprovacion) : null}
            onChange={(e) => handleChange("FechaAprovacion", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className="w-full border border-gray-300 rounded-md p-2 bg-white"
          />
        </div>

        {/* Nombre Proyecto */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">Nombre del Proyecto</label>
          <InputText value={formData.NombreProyecto ?? ""} onChange={(e) => handleChange("NombreProyecto", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Actor Cooperación / Nombre Actor */}
        <div className="flex flex-col">
          <label className="font-semibold">Actor de Cooperación</label>
          <InputText value={formData.ActorCooperacion ?? ""} onChange={(e) => handleChange("ActorCooperacion", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Nombre Actor</label>
          <InputText value={formData.NombreActor ?? ""} onChange={(e) => handleChange("NombreActor", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Etapa / Tipo */}
        <div className="flex flex-col">
          <label className="font-semibold">Etapa</label>
          <InputText value={formData.EtapaProyecto ?? ""} onChange={(e) => handleChange("EtapaProyecto", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Tipo</label>
          <InputText value={formData.TipoProyecto ?? ""} onChange={(e) => handleChange("TipoProyecto", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Área / Región */}
        <div className="flex flex-col">
          <label className="font-semibold">Área</label>
          <InputText value={formData.Areas ?? ""} onChange={(e) => handleChange("Areas", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Región</label>
          <InputText value={formData.Region ?? ""} onChange={(e) => handleChange("Region", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Dependencia / Institución Solicitante */}
        <div className="flex flex-col">
          <label className="font-semibold">Dependencia</label>
          <InputText value={formData.Dependencia ?? ""} onChange={(e) => handleChange("Dependencia", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Institución Solicitante</label>
          <InputText value={formData.InstitucionSolicitante ?? ""} onChange={(e) => handleChange("InstitucionSolicitante", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Contrapartidas */}
        <div className="flex flex-col">
          <label className="font-semibold">Contrapartida (Institución)</label>
          <InputText value={formData.ContrapartidaInstitucion ?? ""} onChange={(e) => handleChange("ContrapartidaInstitucion", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Contrapartida (Cooperante)</label>
          <InputText value={formData.ContrapartidaCooperante ?? ""} onChange={(e) => handleChange("ContrapartidaCooperante", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Costo Total */}
        <div className="flex flex-col">
          <label className="font-semibold">Costo Total</label>
          <InputText value={formData.CostoTotal ?? ""} onChange={(e) => handleChange("CostoTotal", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Documentos (URL) */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">Documento (URL)</label>
          <InputText value={formData.Documentos ?? ""} onChange={(e) => handleChange("Documentos", e.target.value)} placeholder="ruta/archivo.pdf" className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Campos largos */}
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Temáticas</label>
          <InputTextarea value={formData.Tematicas ?? ""} onChange={(e) => handleChange("Tematicas", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Objetivos</label>
          <InputTextarea value={formData.Objetivos ?? ""} onChange={(e) => handleChange("Objetivos", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Resultados</label>
          <InputTextarea value={formData.Resultados ?? ""} onChange={(e) => handleChange("Resultados", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Observaciones</label>
          <InputTextarea value={formData.Observaciones ?? ""} onChange={(e) => handleChange("Observaciones", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
      </div>
    </Dialog>
  );
}

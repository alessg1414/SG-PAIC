"use client";

import { useState } from "react";
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
  Documentos: string | null;
  Observaciones: string | null;
  Objetivos: string | null;
  Resultados: string | null;
  Tematicas: string | null;
  Dependencia: string | null;
  Ano: string | null;
  ContrapartidaCooperante: string | null;
  Areas: string | null;
  InstitucionSolicitante: string | null;
  Region: string | null;
}

interface AgregarProyectoDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: () => void;
}

export default function AgregarProyectoDialog({ visible, onHide, onSave }: AgregarProyectoDialogProps) {
  const [formData, setFormData] = useState<Proyecto>({
    NumProyecto: 0,
    ActorCooperacion: "",
    NombreActor: "",
    NombreProyecto: "",
    FechaAprovacion: null,
    EtapaProyecto: "",
    TipoProyecto: "",
    CostoTotal: "",
    ContrapartidaInstitucion: "",
    Documentos: "",
    Observaciones: "",
    Objetivos: "",
    Resultados: "",
    Tematicas: "",
    Dependencia: "",
    Ano: "",
    ContrapartidaCooperante: "",
    Areas: "",
    InstitucionSolicitante: "",
    Region: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Proyecto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as Proyecto));
  };

  const toISODate = (value: Date | null) => (value ? new Date(value).toISOString().split("T")[0] : null);

  const reset = () => {
    setFormData({
      NumProyecto: 0,
      ActorCooperacion: "",
      NombreActor: "",
      NombreProyecto: "",
      FechaAprovacion: null,
      EtapaProyecto: "",
      TipoProyecto: "",
      CostoTotal: "",
      ContrapartidaInstitucion: "",
      Documentos: "",
      Observaciones: "",
      Objetivos: "",
      Resultados: "",
      Tematicas: "",
      Dependencia: "",
      Ano: "",
      ContrapartidaCooperante: "",
      Areas: "",
      InstitucionSolicitante: "",
      Region: "",
    });
    setErrors({});
  };

  // ✅ Validar: NombreProyecto + FechaAprovacion obligatorios
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.NombreProyecto || !String(formData.NombreProyecto).trim()) e.NombreProyecto = "Requerido";
    if (!formData.FechaAprovacion || !String(formData.FechaAprovacion).trim()) e.FechaAprovacion = "Requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = {
        ...formData,
        FechaAprovacion: formData.FechaAprovacion, // ya viene YYYY-MM-DD
      };
      if (!payload.NumProyecto) delete payload.NumProyecto; 

      const url = `${API_BASE}proyectos/`; 

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`POST ${url} -> ${response.status} ${response.statusText}. ${text}`);
      }

      onSave();
      onHide();
      reset();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      header="Nuevo Proyecto"
      visible={visible}
      style={{ width: "70vw", maxWidth: 900 }}
      modal
      onHide={onHide}
      className="p-dialog-custom"
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} disabled={saving} />
          <Button
            label={saving ? "Guardando..." : "Guardar"}
            icon="pi pi-check"
            className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            onClick={handleSubmit}
            disabled={saving}
          />
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm mt-2">
        {/* NumProyecto (opcional, lo genera el backend si no se envía) */}
        <div className="flex flex-col">
          <label className="font-semibold">Número de Proyecto</label>
          <InputText
            value={formData.NumProyecto ? String(formData.NumProyecto) : ""}
            onChange={(e) => handleChange("NumProyecto", e.target.value ? Number(e.target.value) : 0)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Ej: 1001"
          />
        </div>

        {/* Año */}
        <div className="flex flex-col">
          <label className="font-semibold">Año</label>
          <InputText value={formData.Ano ?? ""} maxLength={4} onChange={(e) => handleChange("Ano", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Fecha de Aprobación (obligatoria) */}
        <div className="flex flex-col">
          <label className="font-semibold">
            Fecha de Aprobación <span className="text-red-500">*</span>
          </label>
          <Calendar
            value={formData.FechaAprovacion ? new Date(formData.FechaAprovacion) : null}
            onChange={(e) => handleChange("FechaAprovacion", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className={`w-full border rounded-md p-2 bg-white ${errors.FechaAprovacion ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.FechaAprovacion && <span className="text-xs text-red-500 mt-1">{errors.FechaAprovacion}</span>}
        </div>

        {/* Nombre del Proyecto (obligatorio) */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </label>
          <InputText
            value={formData.NombreProyecto ?? ""}
            onChange={(e) => handleChange("NombreProyecto", e.target.value)}
            className={`w-full border rounded-md p-2 ${errors.NombreProyecto ? "border-red-400" : "border-gray-300"}`}
            placeholder="Escribe el nombre"
          />
          {errors.NombreProyecto && <span className="text-xs text-red-500 mt-1">{errors.NombreProyecto}</span>}
        </div>

        {/* ActorCooperacion / NombreActor */}
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
          <InputText value={formData.CostoTotal ?? ""} onChange={(e) => handleChange("CostoTotal", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" placeholder="Ej: 1500000" />
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

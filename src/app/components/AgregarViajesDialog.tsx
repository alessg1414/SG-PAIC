// AgregarViajeDialog.tsx
"use client";

import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { API_BASE } from "@/utils/api";

export interface Viaje {
  id?: number;
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

interface AgregarViajeDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: () => void;
}

export default function AgregarViajeDialog({ visible, onHide, onSave }: AgregarViajeDialogProps) {
  const [formData, setFormData] = useState<Viaje>({
    ano: new Date().getFullYear().toString(),
    funcionario_a_cargo: "",
    nombre_actividad: "",
    organizador: "",
    pais: "",
    fecha_actividad_inicio: null,
    fecha_actividad_final: null,
    fecha_viaje_inicio: null,
    fecha_viaje_final: null,
    estado: "Pendiente",
    sector: "",
    tema: "",
    numero_acuerdo: "",
    autoridad_delegado: "",
    nombre_participante: "",
    cargo_funcionario: "",
    modalidad: "",
    observaciones: "",
    financiamiento: "",
    vacaciones: "",
    detalle_vacaciones: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Viaje, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as Viaje));
  };

  const parseISOToLocalDate = (iso?: string | null): Date | null => {
    if (!iso) return null;
    const datePart = String(iso).split("T")[0];
    const [y, m, d] = datePart.split("-").map((s) => parseInt(s, 10));
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
    return new Date(y, m - 1, d);
  };

  const toISODate = (value: Date | null) => {
    if (!value) return null;
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const reset = () => {
    setFormData({
      ano: new Date().getFullYear().toString(),
      funcionario_a_cargo: "",
      nombre_actividad: "",
      organizador: "",
      pais: "",
      fecha_actividad_inicio: null,
      fecha_actividad_final: null,
      fecha_viaje_inicio: null,
      fecha_viaje_final: null,
      estado: "Pendiente",
      sector: "",
      tema: "",
      numero_acuerdo: "",
      autoridad_delegado: "",
      nombre_participante: "",
      cargo_funcionario: "",
      modalidad: "",
      observaciones: "",
      financiamiento: "",
      vacaciones: "",
      detalle_vacaciones: "",
    });
    setErrors({});
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.nombre_actividad?.trim()) e.nombre_actividad = "Requerido";
    if (!formData.fecha_actividad_inicio) e.fecha_actividad_inicio = "Requerida";
    if (!formData.fecha_actividad_final) e.fecha_actividad_final = "Requerida";
    if (!formData.fecha_viaje_inicio) e.fecha_viaje_inicio = "Requerida";
    if (!formData.fecha_viaje_final) e.fecha_viaje_final = "Requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // 🔹 GUARDAR CON API
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = {
        ano_viaje: formData.ano,
        funcionario_a_cargo: formData.funcionario_a_cargo,
        sector: formData.sector,
        tema: formData.tema,
        numero_acuerdo: formData.numero_acuerdo,
        autoridad_delegado: formData.autoridad_delegado,
        nombre_funcionario: formData.funcionario_a_cargo,
        cargo_funcionario_dependencia: formData.cargo_funcionario,
        organizador_evento: formData.organizador,
        nombre_actividad: formData.nombre_actividad,
        lugar_destino: formData.pais,
        modalidad: formData.modalidad,
        fuente_financiamiento: formData.financiamiento,
        fecha_actividad_inicio: formData.fecha_actividad_inicio,
        fecha_actividad_final: formData.fecha_actividad_final,
        fecha_viaje_inicio: formData.fecha_viaje_inicio,
        fecha_viaje_final: formData.fecha_viaje_final,
        vacaciones: formData.vacaciones,
        observaciones: formData.observaciones,
        estado: formData.estado,
        detalle_vacaciones: formData.detalle_vacaciones,
      };

      const response = await fetch(`${API_BASE}viajes_al_exterior/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar viaje");

      onSave();
      onHide();
      reset();
    } catch (error) {
      console.error("Error al guardar viaje:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      header="Nuevo Viaje"
      visible={visible}
      style={{ width: "70vw", maxWidth: 900 }}
      modal
      onHide={onHide}
      className="p-dialog-custom"
      footer={
        <div className="flex justify-end gap-2 mt-4">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-outlined p-button-secondary"
            onClick={onHide}
            disabled={saving}
          />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Año */}
        <div className="flex flex-col">
          <label htmlFor="ano" className="text-sm font-semibold text-gray-700 mb-1">
            Año
          </label>
          <input
            id="ano"
            type="text"
            value={formData.ano ?? ""}
            onChange={(e) => handleChange("ano", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
            placeholder="Ej: 2025"
          />
        </div>

        {/* Sector */}
        <div className="flex flex-col">
          <label htmlFor="sector" className="text-sm font-semibold text-gray-700 mb-1">
            Sector
          </label>
          <input
            id="sector"
            type="text"
            list="sector-options"
            value={formData.sector ?? ""}
            onChange={(e) => handleChange("sector", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
          />
          <datalist id="sector-options">
            <option value="Multilateral" />
            <option value="Bilateral" />
            <option value="Privado" />
            <option value="Público" />
            <option value="Academia" />
            <option value="Sociedad Civil" />
          </datalist>
        </div>

        {/* Tema */}
        <div className="flex flex-col">
          <label htmlFor="tema" className="text-sm font-semibold text-gray-700 mb-1">
            Tema
          </label>
          <input
            id="tema"
            type="text"
            value={formData.tema ?? ""}
            onChange={(e) => handleChange("tema", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
          />
        </div>

        {/* Acuerdo N° */}
        <div className="flex flex-col">
          <label htmlFor="numero_acuerdo" className="text-sm font-semibold text-gray-700 mb-1">
            Acuerdo N°
          </label>
          <input
            id="numero_acuerdo"
            type="text"
            value={formData.numero_acuerdo ?? ""}
            onChange={(e) => handleChange("numero_acuerdo", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
          />
        </div>

        {/* Autoridad o delegado */}
        <div className="flex flex-col">
          <label htmlFor="autoridad_delegado" className="text-sm font-semibold text-gray-700 mb-1">
            Autoridad/Delegado
          </label>
          <input
            id="autoridad_delegado"
            type="text"
            list="autoridad-options"
            value={formData.autoridad_delegado ?? ""}
            onChange={(e) => handleChange("autoridad_delegado", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
            placeholder="Escriba o seleccione"
          />
          <datalist id="autoridad-options">
            <option value="Autoridad" />
            <option value="Delegado" />
          </datalist>
        </div>

        {/* Lugar de destino */}
        <div className="flex flex-col">
          <label htmlFor="pais" className="text-sm font-semibold text-gray-700 mb-1">
            Lugar de destino
          </label>
          <input
            id="pais"
            type="text"
            value={formData.pais ?? ""}
            onChange={(e) => handleChange("pais", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
          />
        </div>

        {/* Modalidad */}
        <div className="flex flex-col">
          <label htmlFor="modalidad" className="text-sm font-semibold text-gray-700 mb-1">
            Modalidad
          </label>
          <input
            id="modalidad"
            type="text"
            list="modalidad-options"
            value={formData.modalidad ?? ""}
            onChange={(e) => handleChange("modalidad", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
            placeholder="Escriba o seleccione"
          />
          <datalist id="modalidad-options">
            <option value="Presencial" />
            <option value="Virtual" />
          </datalist>
        </div>

        {/* Fuente de financiamiento */}
        <div className="flex flex-col">
          <label htmlFor="financiamiento" className="text-sm font-semibold text-gray-700 mb-1">
            Fuente de financiamiento
          </label>
          <input
            id="financiamiento"
            type="text"
            value={formData.financiamiento ?? ""}
            onChange={(e) => handleChange("financiamiento", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
          />
        </div>

        {/* Vacaciones */}
        <div className="flex flex-col">
          <label htmlFor="vacaciones" className="text-sm font-semibold text-gray-700 mb-1">
            Vacaciones
          </label>
          <input
            id="vacaciones"
            type="text"
            list="vacaciones-options"
            value={formData.vacaciones ?? ""}
            onChange={(e) => handleChange("vacaciones", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
            placeholder="Escriba o seleccione"
          />
          <datalist id="vacaciones-options">
            <option value="Si" />
            <option value="No" />
          </datalist>
        </div>

        {/*  DETALLES DE VACACIONES - Solo se muestra si selecciona "Si" */}
        {formData.vacaciones === "Si" && (
          <div className="flex flex-col md:col-span-3">
            <label htmlFor="detalles_vacaciones" className="text-sm font-semibold text-gray-700 mb-1">
              Detalles de vacaciones
            </label>
            <InputTextarea
              id="detalles_vacaciones"
              value={formData.detalle_vacaciones ?? ""}
              onChange={(e) => handleChange("detalle_vacaciones", e.target.value)}
              rows={4}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all resize-none"
              placeholder="Escriba los detalles sobre las vacaciones relacionadas con este viaje..."
            />
          </div>
        )}

        {/* Estado */}
        <div className="flex flex-col">
          <label htmlFor="estado" className="text-sm font-semibold text-gray-700 mb-1">
            Estado
          </label>
          <input
            id="estado"
            type="text"
            list="estado-options"
            value={formData.estado ?? ""}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDA95F] transition-all"
            placeholder="Escriba o seleccione"
          />
          <datalist id="estado-options">
            <option value="Realizado" />
            <option value="En proceso" />
            <option value="No se participó" />
          </datalist>
        </div>

        {/* Fecha de actividad inicio */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Fecha de actividad inicio <span className="text-red-500">*</span>
          </label>
          <Calendar
            value={parseISOToLocalDate(formData.fecha_actividad_inicio)}
            onChange={(e) => handleChange("fecha_actividad_inicio", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className={`w-full ${errors.fecha_actividad_inicio ? "border-red-400" : ""}`}
          />
          {errors.fecha_actividad_inicio && (
            <span className="text-xs text-red-500 mt-1">{errors.fecha_actividad_inicio}</span>
          )}
        </div>

        {/* Fecha de actividad final */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Fecha de la actividad final <span className="text-red-500">*</span>
          </label>
          <Calendar
            value={parseISOToLocalDate(formData.fecha_actividad_final)}
            onChange={(e) => handleChange("fecha_actividad_final", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className={`w-full ${errors.fecha_actividad_final ? "border-red-400" : ""}`}
          />
          {errors.fecha_actividad_final && (
            <span className="text-xs text-red-500 mt-1">{errors.fecha_actividad_final}</span>
          )}
        </div>

        {/* Fecha de inicio de viaje */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Fecha de inicio de viaje <span className="text-red-500">*</span>
          </label>
          <Calendar
            value={parseISOToLocalDate(formData.fecha_viaje_inicio)}
            onChange={(e) => handleChange("fecha_viaje_inicio", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className={`w-full ${errors.fecha_viaje_inicio ? "border-red-400" : ""}`}
          />
          {errors.fecha_viaje_inicio && (
            <span className="text-xs text-red-500 mt-1">{errors.fecha_viaje_inicio}</span>
          )}
        </div>

        {/* Fecha de viaje final */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Fecha de viaje final <span className="text-red-500">*</span>
          </label>
          <Calendar
            value={parseISOToLocalDate(formData.fecha_viaje_final)}
            onChange={(e) => handleChange("fecha_viaje_final", toISODate(e.value as Date | null))}
            showIcon
            dateFormat="dd/mm/yy"
            placeholder="Seleccione fecha"
            className={`w-full ${errors.fecha_viaje_final ? "border-red-400" : ""}`}
          />
          {errors.fecha_viaje_final && (
            <span className="text-xs text-red-500 mt-1">{errors.fecha_viaje_final}</span>
          )}
        </div>
      </div>

      {/* Campos largos al final */}
      <div className="grid grid-cols-1 gap-4 mt-4">
        {/* Nombre del funcionario */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Nombre del funcionario(a) <span className="text-red-500">*</span>
          </label>
          <InputText
            value={formData.funcionario_a_cargo ?? ""}
            onChange={(e) => handleChange("funcionario_a_cargo", e.target.value)}
            className={`w-full border rounded-md p-2 ${errors.funcionario_a_cargo ? "border-red-400" : "border-gray-300"}`}
            placeholder="Nombre completo del funcionario"
          />
          {errors.funcionario_a_cargo && (
            <span className="text-xs text-red-500 mt-1">{errors.funcionario_a_cargo}</span>
          )}
        </div>

        {/* Cargo del funcionario(a) / Dependencia a la que pertenece */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Cargo del funcionario (a) / Dependencia a la que pertenece
          </label>
          <InputText
            value={formData.cargo_funcionario ?? ""}
            onChange={(e) => handleChange("cargo_funcionario", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Cargo y dependencia"
          />
        </div>

        {/* Organizador el evento */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Organizador el evento
          </label>
          <InputText
            value={formData.organizador ?? ""}
            onChange={(e) => handleChange("organizador", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            placeholder="Nombre del organizador"
          />
        </div>

        {/* Nombre de la actividad */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Nombre de la actividad <span className="text-red-500">*</span>
          </label>
          <InputText
            value={formData.nombre_actividad ?? ""}
            onChange={(e) => handleChange("nombre_actividad", e.target.value)}
            className={`w-full border rounded-md p-2 ${errors.nombre_actividad ? "border-red-400" : "border-gray-300"}`}
            placeholder="Título de la actividad"
          />
          {errors.nombre_actividad && (
            <span className="text-xs text-red-500 mt-1">{errors.nombre_actividad}</span>
          )}
        </div>
      </div>
    </Dialog>
  );
}
// EditarViajeDialog.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
 import { API_BASE } from "@/utils/api"; // Descomenta cuando tengas API

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

interface EditarViajeDialogProps {
  visible: boolean;
  onHide: () => void;
  registro: Viaje | null;
  onSave: () => void;
}

export default function EditarViajeDialog({ visible, onHide, registro, onSave }: EditarViajeDialogProps) {
  const [formData, setFormData] = useState<Viaje>({
    id: undefined,
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

  useEffect(() => {
    if (registro) {
      setFormData({
        id: registro.id,
        ano: registro.ano ?? new Date().getFullYear().toString(),
        funcionario_a_cargo: registro.funcionario_a_cargo ?? "",
        nombre_actividad: registro.nombre_actividad ?? "",
        organizador: registro.organizador ?? "",
        pais: registro.pais ?? "",
        fecha_actividad_inicio: registro.fecha_actividad_inicio ?? null,
        fecha_actividad_final: registro.fecha_actividad_final ?? null,
        fecha_viaje_inicio: registro.fecha_viaje_inicio ?? null,
        fecha_viaje_final: registro.fecha_viaje_final ?? null,
        estado: registro.estado ?? "Pendiente",
        sector: registro.sector ?? "",
        tema: registro.tema ?? "",
        numero_acuerdo: registro.numero_acuerdo ?? "",
        autoridad_delegado: registro.autoridad_delegado?? "",
        nombre_participante: registro.nombre_participante ?? "",
        cargo_funcionario: registro.cargo_funcionario ?? "",
        modalidad: registro.modalidad ?? "",
        observaciones: registro.observaciones ?? "",
        financiamiento: registro.financiamiento ?? "",
        vacaciones: registro.vacaciones ?? "",
        detalle_vacaciones: registro.vacaciones ?? "",
      });
      setErrors({});
    }
  }, [registro, visible]);

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

  const toISODate = (value: Date | null) =>
    value ? new Date(value).toISOString().split("T")[0] : null;

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

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: any = {
        ...formData,
      };

      // TODO: cambiar cuando tengas backend
      // const url = `${API_BASE}viajes/`;
      // const response = await fetch(url, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!response.ok) throw new Error("Error al actualizar viaje");

      console.log("Viaje a actualizar:", payload);

      onSave();
      onHide();
    } catch (error) {
      console.error("Error al actualizar viaje:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      header="Editar Viaje"
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
            placeholder="Escriba o seleccione"
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

        {/* Autoridad/Delegado */}
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

        {/* Detalles de vacaciones (visible si 'Si') */}
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
          {errors.funcionario_a_cargo && <span className="text-xs text-red-500 mt-1">{errors.funcionario_a_cargo}</span>}
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

        {/* Organizador del evento */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-700 mb-1">
            Organizador del evento
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
          {errors.nombre_actividad && <span className="text-xs text-red-500 mt-1">{errors.nombre_actividad}</span>}
        </div>
      </div>
    </Dialog>
  );
}

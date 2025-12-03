"use client";

import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useState, useEffect, useRef } from "react";
import { API_BASE } from "@/utils/api";

interface EditarSubpartidaDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: () => void;
  subpartidaData: any; // Recibe los datos iniciales de la subpartida
}

export default function EditarSubpartidaDialog({
  visible,
  onHide,
  onSave,
  subpartidaData,
}: EditarSubpartidaDialogProps) {
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState({
    id: 0,
    subpartida: "",
    ano_contrato: "",
    nombre_subpartida: "",
    descripcion_contratacion: "",
    numero_contratacion: "",
    numero_contrato: "",
    numero_orden_compra: "",
    orden_pedido_sicop: "",
    presupuesto_asignado: 0,
  });

  const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
  const [camposConError, setCamposConError] = useState<string[]>([]);

  useEffect(() => {
    if (subpartidaData) {
      setFormData({
        id: subpartidaData.id,
        subpartida: subpartidaData.subpartida || "",
        ano_contrato: subpartidaData.ano_contrato || "",
        nombre_subpartida: subpartidaData.nombre_subpartida || "",
        descripcion_contratacion: subpartidaData.descripcion_contratacion || "",
        numero_contratacion: subpartidaData.numero_contratacion || "",
        numero_contrato: subpartidaData.numero_contrato || "",
        numero_orden_compra: subpartidaData.numero_orden_compra || "",
        orden_pedido_sicop: subpartidaData.orden_pedido_sicop || "",
        presupuesto_asignado: subpartidaData.presupuesto_asignado || 0,
      });
    }
  }, [subpartidaData, visible]);

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      // Validar campos obligatorios
      const camposFaltantes: string[] = [];
      if (!formData.subpartida) camposFaltantes.push("subpartida");
      if (!formData.ano_contrato) camposFaltantes.push("ano_contrato");
      if (!formData.nombre_subpartida) camposFaltantes.push("nombre_subpartida");
      if (!formData.numero_contratacion) camposFaltantes.push("numero_contratacion");
      if (!formData.presupuesto_asignado || formData.presupuesto_asignado <= 0) {
        camposFaltantes.push("presupuesto_asignado");
      }

      if (camposFaltantes.length > 0) {
        setCamposConError(camposFaltantes);
        toast.current?.show({
          severity: "warn",
          summary: "Campos requeridos",
          detail: "Por favor complete todos los campos obligatorios.",
          life: 3000,
        });
        return;
      }

      setCamposConError([]);
      setErrorMensaje(null);

      const response = await fetch(`${API_BASE}subpartida_contratacion/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: errorData.error || "Error al actualizar la subpartida",
          life: 3000,
        });
        return;
      }

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Subpartida actualizada correctamente",
        life: 2000,
      });
      
      onSave();
      onHide();
    } catch (error) {
      console.error("Error al actualizar la subpartida:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al conectar con el servidor",
        life: 3000,
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header="Editar subpartida"
        visible={visible}
        style={{ width: "50vw", maxWidth: "700px" }}
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
          />
          <Button
            label="Guardar cambios"
            icon="pi pi-check"
            className="bg-[#172951] hover:bg-[#CDA95F] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
            onClick={handleSubmit}
          />
        </div>
      }
    >
      {errorMensaje && (
        <div className="col-span-2 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {errorMensaje}
        </div>
      )}
      <div className="grid grid-cols-2 gap-6 text-sm mt-2">
        <div>
          <label className="font-semibold">Código de subpartida *</label>
          <InputText
            value={formData.subpartida}
            onChange={(e) => handleChange("subpartida", e.target.value)}
            className={`w-full border rounded-md p-3 bg-white ${
              camposConError.includes("subpartida")
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Ej: 10503"
          />
        </div>
        <div>
          <label className="font-semibold">Año del contrato *</label>
          <InputText
            value={formData.ano_contrato}
            onChange={(e) => handleChange("ano_contrato", e.target.value)}
            className={`w-full border rounded-md p-3 bg-white ${
              camposConError.includes("ano_contrato")
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Ej: 2025"
          />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Nombre completo de subpartida *</label>
          <InputText
            value={formData.nombre_subpartida}
            onChange={(e) => handleChange("nombre_subpartida", e.target.value)}
            className={`w-full border rounded-md p-3 bg-white ${
              camposConError.includes("nombre_subpartida")
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Ej: DETALLE DE BOLETOS AÉREOS"
          />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Descripción de subpartida</label>
          <InputText
            value={formData.descripcion_contratacion}
            onChange={(e) => handleChange("descripcion_contratacion", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-5 bg-white"
            placeholder="Descripción adicional..."
          />
        </div>
        <div>
          <label className="font-semibold">Número de contratación *</label>
          <InputText
            value={formData.numero_contratacion}
            onChange={(e) => handleChange("numero_contratacion", e.target.value)}
            className={`w-full border rounded-md p-3 bg-white ${
              camposConError.includes("numero_contratacion")
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Ej: 2025LE-000012-007300001"
          />
        </div>
        <div>
          <label className="font-semibold">Número de contrato</label>
          <InputText
            value={formData.numero_contrato}
            onChange={(e) => handleChange("numero_contrato", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 bg-white"
            placeholder="Número del contrato"
          />
        </div>
        <div>
          <label className="font-semibold">Número de orden de compra</label>
          <InputText
            value={formData.numero_orden_compra}
            onChange={(e) => handleChange("numero_orden_compra", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 bg-white"
            placeholder="Número de la orden"
          />
        </div>
        <div>
          <label className="font-semibold">Orden de pedido SICOP</label>
          <InputText
            value={formData.orden_pedido_sicop}
            onChange={(e) => handleChange("orden_pedido_sicop", e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 bg-white"
            placeholder="Orden SICOP"
          />
        </div>
        <div className="col-span-2">
          <label className="font-semibold">Presupuesto asignado *</label>
          <InputNumber
            value={formData.presupuesto_asignado}
            onValueChange={(e) => handleChange("presupuesto_asignado", e.value)}
            mode="currency"
            currency="CRC"
            locale="es-CR"
            className={`w-full ${
              camposConError.includes("presupuesto_asignado")
                ? "border-red-500"
                : ""
            }`}
            inputClassName="w-full border border-gray-300 rounded-md p-3 bg-white"
            placeholder="₡ 0.00"
          />
        </div>
      </div>
      </Dialog>
    </>
  );
}

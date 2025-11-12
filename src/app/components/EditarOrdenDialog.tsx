"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { API_BASE } from "@/utils/api";

interface SolicitudPresupuesto {
	id: number;
	subpartida_contratacion_id: number;
	descripcion: string;
	fecha_solicitud_boleto: string;
	hora_solicitud_boleto: string;
	oficio_solicitud: string;
	fecha_respuesta_solicitud: string;
	hora_respuesta_solicitud: string;
	cumple_solicitud: 'Sí' | 'No' | 'Pendiente';
	fecha_solicitud_emision: string;
	hora_solicitud_emision: string;
	oficio_emision: string;
	fecha_respuesta_emision: string;
	hora_respuesta_emision: string;
	cumple_emision: 'Sí' | 'No' | 'Pendiente';
	fecha_recibido_conforme: string;
	hora_recibido_conforme: string;
	oficio_recepcion: string;
	numero_factura: string;
	total_factura: number;
	fecha_entrega_direccion: string;
	estado: string;
	activo: boolean;
}

interface EditarOrdenDialogProps {
	visible: boolean;
	onHide: () => void;
	onRefresh: () => void;
	orden: SolicitudPresupuesto | null;
}

export default function EditarOrdenDialog({ visible, onHide, onRefresh, orden }: EditarOrdenDialogProps) {
	const toast = useRef<Toast>(null);
	const [formData, setFormData] = useState<SolicitudPresupuesto | null>(orden);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		setFormData(orden);
	}, [orden]);

	const handleChange = (e: any) => {
		setFormData((prev) => prev ? { ...prev, [e.target.name]: e.target.value } : prev);
	};

	const handleDateChange = (name: string, value: any) => {
		setFormData((prev) => prev ? { ...prev, [name]: value ? new Date(value).toISOString().split("T")[0] : "" } : prev);
	};

	const handleSubmit = async () => {
		if (!formData) return;
		setSaving(true);
		try {
			const payload = { ...formData };
			const response = await fetch(`${API_BASE}solicitud_presupuesto/${formData.id}/`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!response.ok) throw new Error("Error al actualizar la orden");
			toast.current?.show({
				severity: "success",
				summary: "Éxito",
				detail: "Orden actualizada correctamente.",
				life: 2000,
			});
			onRefresh();
			onHide();
		} catch (error) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: `Error al actualizar: ${(error as any).message}`,
				life: 3000,
			});
		} finally {
			setSaving(false);
		}
	};

	if (!formData) return null;

	return (
		<Dialog header="Editar Orden" visible={visible} onHide={onHide} style={{ width: "60vw" }}>
			<Toast ref={toast} />
			<div className="p-6 space-y-6">
				{/* Fase 1: Solicitud */}
				<div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 mb-4">
					<h4 className="font-bold text-blue-700 mb-2">Fase 1: Solicitud Inicial</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
						<InputText name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} placeholder="Descripción" className="col-span-2" />
						<Calendar name="fecha_solicitud_boleto" value={formData.fecha_solicitud_boleto ? new Date(formData.fecha_solicitud_boleto) : null} onChange={(e) => handleDateChange("fecha_solicitud_boleto", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Solicitud" />
						<InputText name="hora_solicitud_boleto" value={formData.hora_solicitud_boleto ?? ""} onChange={handleChange} placeholder="Hora Solicitud" />
						<InputText name="oficio_solicitud" value={formData.oficio_solicitud ?? ""} onChange={handleChange} placeholder="Oficio Solicitud" />
						<Calendar name="fecha_respuesta_solicitud" value={formData.fecha_respuesta_solicitud ? new Date(formData.fecha_respuesta_solicitud) : null} onChange={(e) => handleDateChange("fecha_respuesta_solicitud", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Respuesta" />
						<InputText name="hora_respuesta_solicitud" value={formData.hora_respuesta_solicitud ?? ""} onChange={handleChange} placeholder="Hora Respuesta" />
						<InputText name="cumple_solicitud" value={formData.cumple_solicitud ?? ""} onChange={handleChange} placeholder="Cumple Solicitud (Sí/No/Pendiente)" />
					</div>
				</div>
				{/* Fase 2: Emisión */}
				<div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500 mb-4">
					<h4 className="font-bold text-green-700 mb-2">Fase 2: Emisión</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
						<Calendar name="fecha_solicitud_emision" value={formData.fecha_solicitud_emision ? new Date(formData.fecha_solicitud_emision) : null} onChange={(e) => handleDateChange("fecha_solicitud_emision", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Solicitud Emisión" />
						<InputText name="hora_solicitud_emision" value={formData.hora_solicitud_emision ?? ""} onChange={handleChange} placeholder="Hora Solicitud Emisión" />
						<InputText name="oficio_emision" value={formData.oficio_emision ?? ""} onChange={handleChange} placeholder="Oficio Emisión" />
						<Calendar name="fecha_respuesta_emision" value={formData.fecha_respuesta_emision ? new Date(formData.fecha_respuesta_emision) : null} onChange={(e) => handleDateChange("fecha_respuesta_emision", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Respuesta Emisión" />
						<InputText name="hora_respuesta_emision" value={formData.hora_respuesta_emision ?? ""} onChange={handleChange} placeholder="Hora Respuesta Emisión" />
						<InputText name="cumple_emision" value={formData.cumple_emision ?? ""} onChange={handleChange} placeholder="Cumple Emisión (Sí/No/Pendiente)" />
					</div>
				</div>
				{/* Fase 3: Recepción */}
				<div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500 mb-4">
					<h4 className="font-bold text-yellow-700 mb-2">Fase 3: Recepción</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
						<Calendar name="fecha_recibido_conforme" value={formData.fecha_recibido_conforme ? new Date(formData.fecha_recibido_conforme) : null} onChange={(e) => handleDateChange("fecha_recibido_conforme", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Recibido Conforme" />
						<InputText name="hora_recibido_conforme" value={formData.hora_recibido_conforme ?? ""} onChange={handleChange} placeholder="Hora Recibido Conforme" />
						<InputText name="oficio_recepcion" value={formData.oficio_recepcion ?? ""} onChange={handleChange} placeholder="Oficio Recepción" />
					</div>
				</div>
				{/* Fase 4: Facturación */}
				<div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500 mb-4">
					<h4 className="font-bold text-purple-700 mb-2">Fase 4: Facturación</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
						<InputText name="numero_factura" value={formData.numero_factura ?? ""} onChange={handleChange} placeholder="Número Factura" />
						<InputText name="total_factura" value={formData.total_factura?.toString() ?? ""} onChange={handleChange} placeholder="Total Factura" />
					</div>
				</div>
				{/* Fase 5: Entrega */}
				<div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-pink-500 mb-4">
					<h4 className="font-bold text-pink-700 mb-2">Fase 5: Entrega</h4>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
						<Calendar name="fecha_entrega_direccion" value={formData.fecha_entrega_direccion ? new Date(formData.fecha_entrega_direccion) : null} onChange={(e) => handleDateChange("fecha_entrega_direccion", e.value)} dateFormat="dd/mm/yy" showIcon className="w-full" placeholder="Fecha Entrega Dirección" />
					</div>
				</div>
				{/* Estado y activo */}
				<div className="grid grid-cols-2 gap-4">
					<InputText name="estado" value={formData.estado ?? ""} onChange={handleChange} placeholder="Estado" />
					<InputText name="activo" value={formData.activo ? "Sí" : "No"} onChange={handleChange} placeholder="Activo (Sí/No)" />
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} disabled={saving} />
					<Button label={saving ? "Guardando..." : "Guardar Cambios"} icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} disabled={saving} />
				</div>
			</div>
		</Dialog>
	);
}

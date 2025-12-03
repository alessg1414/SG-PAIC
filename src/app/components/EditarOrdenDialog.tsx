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
			const payload = {
				id: formData.id,
				descripcion: formData.descripcion,
				fecha_solicitud_boleto: formData.fecha_solicitud_boleto,
				hora_solicitud_boleto: formData.hora_solicitud_boleto,
				oficio_solicitud: formData.oficio_solicitud,
				fecha_respuesta_solicitud: formData.fecha_respuesta_solicitud,
				hora_respuesta_solicitud: formData.hora_respuesta_solicitud,
				cumple_solicitud: formData.cumple_solicitud,
				fecha_solicitud_emision: formData.fecha_solicitud_emision,
				hora_solicitud_emision: formData.hora_solicitud_emision,
				oficio_emision: formData.oficio_emision,
				fecha_respuesta_emision: formData.fecha_respuesta_emision,
				hora_respuesta_emision: formData.hora_respuesta_emision,
				cumple_emision: formData.cumple_emision,
				fecha_recibido_conforme: formData.fecha_recibido_conforme,
				hora_recibido_conforme: formData.hora_recibido_conforme,
				oficio_recepcion: formData.oficio_recepcion,
				numero_factura: formData.numero_factura,
				total_factura: formData.total_factura,
				fecha_entrega_direccion: formData.fecha_entrega_direccion,
				estado: formData.estado,
				activo: formData.activo
			};
			const response = await fetch(`${API_BASE}solicitud_presupuesto/`, {
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
						<div className="rounded-lg mb-6">
							<div className="bg-blue-50 rounded-t px-4 py-3 border-b border-blue-100">
								<h4 className="font-bold text-blue-700 text-lg tracking-wide">Fase 1: Solicitud Inicial</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Descripción</label>
									<InputText name="descripcion" value={formData.descripcion ?? ""} onChange={handleChange} placeholder="Descripción" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Solicitud</label>
									<Calendar name="fecha_solicitud_boleto" value={formData.fecha_solicitud_boleto ? new Date(formData.fecha_solicitud_boleto) : null} onChange={(e) => handleDateChange("fecha_solicitud_boleto", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Solicitud" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Hora Solicitud</label>
									<InputText name="hora_solicitud_boleto" value={formData.hora_solicitud_boleto ?? ""} onChange={handleChange} placeholder="Hora Solicitud" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Oficio Solicitud</label>
									<InputText name="oficio_solicitud" value={formData.oficio_solicitud ?? ""} onChange={handleChange} placeholder="Oficio Solicitud" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Respuesta</label>
									<Calendar name="fecha_respuesta_solicitud" value={formData.fecha_respuesta_solicitud ? new Date(formData.fecha_respuesta_solicitud) : null} onChange={(e) => handleDateChange("fecha_respuesta_solicitud", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Respuesta" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Hora Respuesta</label>
									<InputText name="hora_respuesta_solicitud" value={formData.hora_respuesta_solicitud ?? ""} onChange={handleChange} placeholder="Hora Respuesta" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Cumple Solicitud</label>
									<InputText name="cumple_solicitud" value={formData.cumple_solicitud ?? ""} onChange={handleChange} placeholder="Cumple Solicitud (Sí/No/Pendiente)" />
								</div>
							</div>
						</div>
						{/* Fase 2: Emisión */}
						<div className="rounded-lg mb-6">
							<div className="bg-green-50 rounded-t px-4 py-3 border-b border-green-100">
								<h4 className="font-bold text-green-700 text-lg tracking-wide">Fase 2: Emisión</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Solicitud Emisión</label>
									<Calendar name="fecha_solicitud_emision" value={formData.fecha_solicitud_emision ? new Date(formData.fecha_solicitud_emision) : null} onChange={(e) => handleDateChange("fecha_solicitud_emision", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Solicitud Emisión" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Hora Solicitud Emisión</label>
									<InputText name="hora_solicitud_emision" value={formData.hora_solicitud_emision ?? ""} onChange={handleChange} placeholder="Hora Solicitud Emisión" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Oficio Emisión</label>
									<InputText name="oficio_emision" value={formData.oficio_emision ?? ""} onChange={handleChange} placeholder="Oficio Emisión" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Respuesta Emisión</label>
									<Calendar name="fecha_respuesta_emision" value={formData.fecha_respuesta_emision ? new Date(formData.fecha_respuesta_emision) : null} onChange={(e) => handleDateChange("fecha_respuesta_emision", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Respuesta Emisión" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Hora Respuesta Emisión</label>
									<InputText name="hora_respuesta_emision" value={formData.hora_respuesta_emision ?? ""} onChange={handleChange} placeholder="Hora Respuesta Emisión" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Cumple Emisión</label>
									<InputText name="cumple_emision" value={formData.cumple_emision ?? ""} onChange={handleChange} placeholder="Cumple Emisión (Sí/No/Pendiente)" />
								</div>
							</div>
						</div>
						{/* Fase 3: Recepción */}
						<div className="rounded-lg mb-6">
							<div className="bg-yellow-50 rounded-t px-4 py-3 border-b border-yellow-100">
								<h4 className="font-bold text-yellow-700 text-lg tracking-wide">Fase 3: Recepción</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Recibido Conforme</label>
									<Calendar name="fecha_recibido_conforme" value={formData.fecha_recibido_conforme ? new Date(formData.fecha_recibido_conforme) : null} onChange={(e) => handleDateChange("fecha_recibido_conforme", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Recibido Conforme" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Hora Recibido Conforme</label>
									<InputText name="hora_recibido_conforme" value={formData.hora_recibido_conforme ?? ""} onChange={handleChange} placeholder="Hora Recibido Conforme" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Oficio Recepción</label>
									<InputText name="oficio_recepcion" value={formData.oficio_recepcion ?? ""} onChange={handleChange} placeholder="Oficio Recepción" />
								</div>
							</div>
						</div>
						{/* Fase 4: Facturación */}
						<div className="rounded-lg mb-6">
							<div className="bg-purple-50 rounded-t px-4 py-3 border-b border-purple-100">
								<h4 className="font-bold text-purple-700 text-lg tracking-wide">Fase 4: Facturación</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Número Factura</label>
									<InputText name="numero_factura" value={formData.numero_factura ?? ""} onChange={handleChange} placeholder="Número Factura" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Total Factura</label>
									<InputText name="total_factura" value={formData.total_factura?.toString() ?? ""} onChange={handleChange} placeholder="Total Factura" />
								</div>
							</div>
						</div>
						{/* Fase 5: Entrega */}
						<div className="rounded-lg mb-6">
							<div className="bg-pink-50 rounded-t px-4 py-3 border-b border-pink-100">
								<h4 className="font-bold text-pink-700 text-lg tracking-wide">Fase 5: Entrega</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Fecha Entrega Dirección</label>
									<Calendar name="fecha_entrega_direccion" value={formData.fecha_entrega_direccion ? new Date(formData.fecha_entrega_direccion) : null} onChange={(e) => handleDateChange("fecha_entrega_direccion", e.value)} dateFormat="dd/mm/yy" showIcon placeholder="Fecha Entrega Dirección" />
								</div>
							</div>
						</div>
						{/* Estado y activo */}
						<div className="rounded-lg mb-6">
							<div className="bg-gray-200 rounded-t px-4 py-3 border-b border-gray-300">
								<h4 className="font-bold text-gray-700 text-lg tracking-wide">Otros campos</h4>
							</div>
							<div className="bg-gray-50 p-6 rounded-b grid grid-cols-1 md:grid-cols-3 gap-6">
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Estado</label>
									<InputText name="estado" value={formData.estado ?? ""} onChange={handleChange} placeholder="Estado" />
								</div>
								<div className="flex flex-col gap-1">
									<label className="text-xs font-semibold text-gray-600">Activo</label>
									<InputText name="activo" value={formData.activo ? "Sí" : "No"} onChange={handleChange} placeholder="Activo (Sí/No)" />
								</div>
							</div>
						</div>
						<div className="flex justify-end gap-3 mt-6">
							<Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} disabled={saving} />
							<Button label={saving ? "Guardando..." : "Guardar Cambios"} icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} disabled={saving} />
						</div>
					</div>
				</Dialog>
	);
}

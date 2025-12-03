"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { API_BASE } from "@/utils/api";

interface AgregarOrdenDialogProps {
	visible: boolean;
	onHide: () => void;
	onRefresh: () => void;
	subpartidaId: number;
	subpartidas: string[];
}

export default function AgregarOrdenDialog({ visible, onHide, onRefresh, subpartidaId, subpartidas }: AgregarOrdenDialogProps) {
	const toast = useRef<Toast>(null);
	const [formData, setFormData] = useState({
		subpartida_contratacion_id: subpartidaId,
		descripcion: "",
		fecha_solicitud_boleto: "",
		hora_solicitud_boleto: "",
		oficio_solicitud: "",
		total_factura: "",
	});
	const [saving, setSaving] = useState(false);

	// Actualizar subpartida_contratacion_id cuando cambia la prop
	useEffect(() => {
		setFormData(prev => ({
			...prev,
			subpartida_contratacion_id: subpartidaId
		}));
	}, [subpartidaId]);

	const handleChange = (e: any) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleDateChange = (value: any) => {
		setFormData({ ...formData, fecha_solicitud_boleto: value ? new Date(value).toISOString().split("T")[0] : "" });
	};

	const handleSubmit = async () => {
		if (!formData.descripcion || !formData.fecha_solicitud_boleto || !formData.hora_solicitud_boleto || !formData.oficio_solicitud || !formData.total_factura) {
			toast.current?.show({
				severity: "warn",
				summary: "Campos requeridos",
				detail: "Completa todos los campos.",
				life: 3000,
			});
			return;
		}
		
		// Validar que total_factura sea un número válido
		const totalFacturaNum = parseFloat(formData.total_factura);
		if (isNaN(totalFacturaNum) || totalFacturaNum <= 0) {
			toast.current?.show({
				severity: "warn",
				summary: "Total inválido",
				detail: "El total de factura debe ser un número mayor a 0.",
				life: 3000,
			});
			return;
		}
		
		setSaving(true);
		try {
			const payload = {
				subpartida_contratacion_id: formData.subpartida_contratacion_id,
				descripcion: formData.descripcion,
				fecha_solicitud_boleto: formData.fecha_solicitud_boleto,
				hora_solicitud_boleto: formData.hora_solicitud_boleto,
				oficio_solicitud: formData.oficio_solicitud,
				total_factura: totalFacturaNum,
			};
			const response = await fetch(`${API_BASE}solicitud_presupuesto/`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});
			if (!response.ok) throw new Error("Error al guardar la orden");
			toast.current?.show({
				severity: "success",
				summary: "Éxito",
				detail: "Orden registrada correctamente.",
				life: 2000,
			});
			onRefresh();
			onHide();
			setFormData({
				subpartida_contratacion_id: subpartidaId,
				descripcion: "",
				fecha_solicitud_boleto: "",
				hora_solicitud_boleto: "",
				oficio_solicitud: "",
				total_factura: "",
			});
		} catch (error) {
			toast.current?.show({
				severity: "error",
				summary: "Error",
				detail: `Error al guardar: ${(error as any).message}`,
				life: 3000,
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<Dialog header="Añadir Orden" visible={visible} onHide={onHide} style={{ width: "40vw" }}>
			<Toast ref={toast} />
			<div className="p-6 space-y-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col col-span-2">
						<label className="font-semibold text-gray-700">Descripción</label>
						<InputText name="descripcion" value={formData.descripcion} onChange={handleChange} placeholder="Ingrese la descripción" className="w-full p-2 border border-gray-300 rounded-lg" />
					</div>
					<div className="flex flex-col">
						<label className="font-semibold text-gray-700">Fecha Solicitud Boleto</label>
						<Calendar name="fecha_solicitud_boleto" value={formData.fecha_solicitud_boleto ? new Date(formData.fecha_solicitud_boleto) : null} onChange={(e) => handleDateChange(e.value)} dateFormat="dd/mm/yy" showIcon className="w-full p-2 border border-gray-300 rounded-lg" placeholder="Seleccione fecha" />
					</div>
					<div className="flex flex-col">
						<label className="font-semibold text-gray-700">Hora Solicitud Boleto</label>
						<InputText name="hora_solicitud_boleto" value={formData.hora_solicitud_boleto} onChange={handleChange} placeholder="Ej: 14:30" className="w-full p-2 border border-gray-300 rounded-lg" />
					</div>
					<div className="flex flex-col col-span-2">
						<label className="mb-2 font-semibold text-gray-700">Oficio de solicitud</label>
						<InputText name="oficio_solicitud" value={formData.oficio_solicitud} onChange={handleChange} placeholder="Ingrese el oficio" className="w-full p-2 border border-gray-300 rounded-lg" />
					</div>
					<div className="flex flex-col col-span-2">
						<label className="mb-2 font-semibold text-gray-700">Total Factura (₡)</label>
						<InputText name="total_factura" type="number" value={formData.total_factura} onChange={handleChange} placeholder="Ingrese el monto total" className="w-full p-2 border border-gray-300 rounded-lg" />
					</div>
				</div>
				<div className="flex justify-end gap-3">
					<Button label="Cancelar" icon="pi pi-times" className="p-button-outlined p-button-secondary" onClick={onHide} disabled={saving} />
					<Button label={saving ? "Guardando..." : "Guardar Orden"} icon="pi pi-check" className="p-button-primary" onClick={handleSubmit} disabled={saving} />
				</div>
			</div>
		</Dialog>
	);
}

"use client";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { API_BASE } from "@/utils/api";
import { Dropdown } from "primereact/dropdown";
import { label } from "framer-motion/client";
import { MultiSelect } from "primereact/multiselect";

export interface Proyecto {
  NumProyecto?: number;
  CantidadDependencias: string | null;
  NombreActor: string | null;
  NombreProyecto: string | null;
  FechaAprovacion: string | null;
  EtapaProyecto: string | null;
  DependenciasSolicitantes: string | null;
  CostoTotal: string | null;
  ContrapartidaInstitucional: string | null;
  DocumentosCambiar: string | null; // String separado por comas para múltiples documentos
  Observaciones: string | null;
  ObjetivoGeneral: string | null;
  Resultados: string | null;
  Productos: string | null;
  Ano: string | null;
  ContrapartidaCooperante: string | null;
  IdAreas: number;
  InstitucionSolicitante: string | string[] | null;
  Region: string | null;
  Modalidad: string | null;
  Sector: string | null;
  TipoCooperacion: string | null;
  AutoridadAcargo: string | null;
}

interface AgregarProyectoDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: () => void;
}

export default function AgregarProyectoDialog({ visible, onHide, onSave }: AgregarProyectoDialogProps) {
  const [formData, setFormData] = useState<Proyecto>({
    NumProyecto: 0,
    CantidadDependencias: "",
    NombreActor: "",
    NombreProyecto: "",
    FechaAprovacion: null,
    EtapaProyecto: "",
    DependenciasSolicitantes: "",
    CostoTotal: "",
    ContrapartidaInstitucional: "",
    DocumentosCambiar: null,
    Observaciones: "",
    ObjetivoGeneral: "",
    Resultados: "",
    Productos: "",
    Ano: "",
    ContrapartidaCooperante: "",
    IdAreas: 0,
    InstitucionSolicitante: null,
    Region: "",
    Modalidad: "",
    Sector: "",
    TipoCooperacion: "",
    AutoridadAcargo: "",
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [listaAreas, setListaAreas] = useState<{ label: string; value: number | "new" }[]>([]);
  const [nuevaArea, setNuevaArea] = useState(""); 
  const [agregandoArea, setAgregandoArea] = useState(false); 
  const [cantidadDependencias, setCantidadDependencias] = useState("una");

  // ✅ Estados para los dos documentos
  const [cartaAprobacionMideplan, setCartaAprobacionMideplan] = useState("");
  const [formularioProyecto, setFormularioProyecto] = useState("");
  // Nuevo campo opcional: Informe del proyecto (URL)
  const [informeProyecto, setInformeProyecto] = useState("");

  // Borra o ajusta dependencias al cambiar entre una y varias
  const handleCantidadDependenciasChange = (value: string) => {
    setCantidadDependencias(value);

    // Limpiar campo cuando se cambia para evitar inconsistencias
    handleChange("InstitucionSolicitante", value === "una" ? "" : []);
  };
 useEffect(() => {
  const fetchAreas = async () => {
    try {
      const response = await fetch(`${API_BASE}areas/`);
      const data = await response.json();

      const opciones = data.map((a: any) => ({
        label: a.NombreArea,
        value: a.IdAreas,
      }));

      opciones.push({ label: "Agregar nueva área", value: "new" });

      setListaAreas(opciones);
    } catch (error) {
      console.error("Error cargando áreas:", error);


      setListaAreas([{ label: "Agregar nueva área", value: "new" }]);
    }
  };
  fetchAreas();
}, []);
  
  const handleAreaChange = (value: number | "new") => {
  if (value === "new") {
    setAgregandoArea(true);
    setFormData((prev) => ({ ...prev, IdAreas: 0 })); 
  } else {
    setAgregandoArea(false);
    setFormData((prev) => ({ ...prev, IdAreas: value as number }));
  }
};


  /*Declaracion de los elementos de cada Lista en Ingreso de Proyecto*/ 
  const etapas = [
  { label: "Finalizado", value: "Finalizado" },
  { label: "Aprobado por el MEP", value: "aprobado por el MEP" },
  { label: "Aprobado por el MIDEPLAN", value: "aprobado por el MIDEPLAN" },
  { label: "Rechazado por MIDEPLAN", value: "Rechazado por MIDEPLAN" },
  { label: "En proceso de formulacion", value: "En proceso de formulacion" },
  {label: "Rechazado por fuente externa", value: "Rechazado por fuente externa"},
  { label: "En ejecución", value: "En ejecución" },
  { label: "Cancelado por el cooperante", value: "Cancelado por el cooperante" },
  { label: "Cancelado por el MEP", value: "Cancelado por el MEP" },
  { label: "En negociación", value: "En negociación" },
  {label:"Suspendido por el MEP",value:"Suspendido por el MEP"},
  {label:"Suspendido por el cooperante",value:"Suspendido por el cooperante"}
  ];

  const dependencias = [
    { label: "Una", value: "Una" },
    { label: "Más de una", value: "Más de una" }
  ];
  const EntidadesDependencias = [
    { label: "Unidad para la promocion de la igualdad de genero", value: "Unidad para la promocion de la igualdad de genero" },
    { label: "Contraloría de servicios", value: "Contraloría de servicios" },
    { label: "Auditoria interna", value: "Auditoria interna" },
    { label: "Prensa y relaciones públicas", value: "Prensa y relaciones públicas" },
    { label: "Asuntos internacionales y cooperación", value: "Asuntos internacionales y cooperación" },
    { label: "Unidad de planificacion sectorial", value: "Unidad de planificacion sectorial" },
    { label: "Asuntos jurídicos", value: "Asuntos jurídicos" },
    { label: "Contraloría de derechos estudiantiles", value: "Contraloría de derechos estudiantiles" },
    { label: "Educación privada", value: "Educación privada" },
    { label: "Recursos tecnologicos en educacion", value: "Recursos tecnologicos en educacion" },
    { label: "Educación técnica y capacidades emprendedoras", value: "Educación técnica y capacidades emprendedoras" },
    { label: "Desarrollo curricular", value: "Desarrollo curricular" },
    { label: "Vida estudiantil", value: "Vida estudiantil" },
    { label: "Gestión y evaluación de la calidad", value: "Gestión y evaluación de la calidad" },
    { label: "Gestión y desarrollo regional", value: "Gestión y desarrollo regional" },
    { label: "Proveeduría institucional", value: "Proveeduría institucional" },
    { label: "Financiera", value: "Financiera" },
    { label: "Planificación institucional", value: "Planificación institucional" },
    { label: "Gestión de talento humano", value: "Gestión de talento humano" },
    { label: "Infraestructura educativa", value: "Infraestructura educativa" },
    { label: "Programas de equidad", value: "Programas de equidad" },
    { label: "Informática de gestión", value: "Informática de gestión" },
    { label: "Servicios generales", value: "Servicios generales"}
  ];
  const modalidades = [
    { label: "Todas", value: "Todas" },
    { label: "Financiera reembolsables", value: "Financiera reembolsables" },
    { label: "Financiera no reembolsables", value: "Financiera no reembolsables" },
    { label: "Cooperación técnica", value: "Cooperación técnica" }
  ]

  const sectores = [
    { label: "Vilateral", value: "Vilateral" },
    { label: "Multilateral", value: "Multilateral" }
  ]

  const TipoCooperaciones = [
    { label: "Todas", value: "Todas" },
    { label: "Cooperación sur-sur", value: "Cooperación sur-sur" },
    { label: "Triangulación", value: "Triangulación" },
    { label: "Regional", value: "Regional" },
    { label: "Fronteriza", value: "Fronteriza" },
    { label: "Norte-Sur", value: "Norte-Sur" }
  ]

  const AutoridadesAcargo = [
    { label: "Despacho del ministro", value: "Despacho del ministro" },
    { label: "Viceministerio academico", value: "Viceministerio academico" },
    { label: "Viceministerio administrativo", value: "Viceministerio administrativo" },
    { label: "Viceministerio de coordinacion regional", value: "Viceministerio de coordinacion regional" },
    { label: "Multigerencial", value: "Multigerencial" }
  ]
  /* Aqui termina la declaracion de las listas*/


  const handleChange = (field: keyof Proyecto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as Proyecto));
  };

  const toISODate = (value: Date | null): string | null => {
    if (!value) return null;
    const year = value.getFullYear();
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const day = value.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const reset = () => {
    setFormData({
      NumProyecto: 0,
      CantidadDependencias: "",
      NombreActor: "",
      NombreProyecto: "",
      FechaAprovacion: null,
      EtapaProyecto: "",
      DependenciasSolicitantes: "",
      CostoTotal: "",
      ContrapartidaInstitucional: "",
      DocumentosCambiar: null,
      Observaciones: "",
      ObjetivoGeneral: "",
      Resultados: "",
      Productos: "",
      Ano: "",
      ContrapartidaCooperante: "",
      IdAreas: 0,
      InstitucionSolicitante: null,
      Region: "",
      Modalidad: "",
      Sector: "",
      TipoCooperacion: "",
      AutoridadAcargo: "",
    });
    setCartaAprobacionMideplan("");
    setFormularioProyecto("");
    setInformeProyecto("");
    setErrors({});
  };

  // ✅ Validar: NombreProyecto + FechaAprovacion + Documentos + Área obligatorios
  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.NombreProyecto || !String(formData.NombreProyecto).trim()) e.NombreProyecto = "Requerido";
    if (!formData.FechaAprovacion || !String(formData.FechaAprovacion).trim()) e.FechaAprovacion = "Requerida";
    if (!cartaAprobacionMideplan.trim()) e.CartaAprobacionMideplan = "Requerida";
    if (!formularioProyecto.trim()) e.FormularioProyecto = "Requerido";
    if (!formData.IdAreas || formData.IdAreas === 0) e.IdAreas = "Debe seleccionar un área";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  
  const revisarEtapa = () => {
    if (!formData.EtapaProyecto || String(formData.EtapaProyecto).trim() === "") {
      setFormData((prev) => ({ ...prev, EtapaProyecto: "No definido" }));
      return "No definido";
    }
    return formData.EtapaProyecto;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    try {
      let idAreaFinal = formData.IdAreas;

      if (agregandoArea && nuevaArea.trim() !== "") {
        const resArea = await fetch(`${API_BASE}areas/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ NombreArea: nuevaArea.trim() }),
        });
        if (!resArea.ok) throw new Error("Error guardando nueva área");
        const areaCreada = await resArea.json();
        idAreaFinal = areaCreada.IdAreas; 
      }

      // ✅ Normalizar InstitucionSolicitante
      let institucionSolicitante: string[] = [];
      
      if (cantidadDependencias === "una") {
        // Si es "una", convertir a array de un elemento
        if (typeof formData.InstitucionSolicitante === "string" && formData.InstitucionSolicitante) {
          institucionSolicitante = [formData.InstitucionSolicitante];
        }
      } else {
        // Si es "varias", asegurar que sea array
        if (Array.isArray(formData.InstitucionSolicitante)) {
          institucionSolicitante = formData.InstitucionSolicitante;
        } else if (typeof formData.InstitucionSolicitante === "string" && formData.InstitucionSolicitante) {
          institucionSolicitante = [formData.InstitucionSolicitante];
        }
      }

      // ✅ Crear string de documentos separados por coma
      const documentos = [cartaAprobacionMideplan.trim(), formularioProyecto.trim(), informeProyecto.trim()]
        .filter(d => d) // Filtrar vacíos
        .join(", "); // Unir con coma y espacio

      const payload: any = {
        ...formData,
        IdAreas: idAreaFinal,
        FechaAprovacion: formData.FechaAprovacion,
        EtapaProyecto: revisarEtapa(),
        InstitucionSolicitante: institucionSolicitante,
        DocumentosCambiar: documentos, // ✅ String separado por comas
        CantidadDependencias: cantidadDependencias,
      };

      if (!payload.NumProyecto) delete payload.NumProyecto;

      const response = await fetch(`${API_BASE}proyectos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error guardando proyecto");

      onSave();
      onHide();
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      header="Ingreso de proyecto"
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


        {/* Año */}
        <div className="flex flex-col">
          <label className="font-semibold">Año</label>
          <InputText value={formData.Ano ?? ""} maxLength={4} onChange={(e) => handleChange("Ano", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Fecha de Aprobación (obligatoria) */}
        <div className="flex flex-col">
          <label className="font-semibold">
            Fecha de aprobación <span className="text-red-500">*</span>
          </label>
            <Calendar
                value={formData.FechaAprovacion ? new Date(formData.FechaAprovacion + "T00:00:00") : null}
                onChange={(e) => handleChange("FechaAprovacion", toISODate(e.value as Date | null))}
                showIcon
                dateFormat="dd/mm/yy"
                placeholder="Seleccione fecha"
                appendTo="self"
                className={`w-full border rounded-md p-2 bg-white ${errors.FechaAprovacion ? "border-red-400" : "border-gray-300"}`}
              />

          {errors.FechaAprovacion && <span className="text-xs text-red-500 mt-1">{errors.FechaAprovacion}</span>}
        </div>

        {/* NombreActor */}
        <div className="flex flex-col">
          <label className="font-semibold">Nombre actor</label>
          <InputText value={formData.NombreActor ?? ""} onChange={(e) => handleChange("NombreActor", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" placeholder="Escriba el nombre completo" />
        </div>

        {/* Nombre del Proyecto (obligatorio) */}
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">
            Nombre del proyecto <span className="text-red-500">*</span>
          </label>
          <InputText
            value={formData.NombreProyecto ?? ""}
            onChange={(e) => handleChange("NombreProyecto", e.target.value)}
            className={`w-full border rounded-md p-2 ${errors.NombreProyecto ? "border-red-400" : "border-gray-300"}`}
            placeholder="Escribe el nombre"
          />
          {errors.NombreProyecto && <span className="text-xs text-red-500 mt-1">{errors.NombreProyecto}</span>}
        </div>

        

        {/* Etapa / Dependencia */}
        <div className="flex flex-col">
          <label className="font-semibold">Etapa</label>

          <Dropdown
            value={formData.EtapaProyecto || ""}
            options={etapas}
            onChange={(e) => handleChange("EtapaProyecto", e.value)}
            appendTo={`self`}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>
        {/* Cantidad de dependencias */}
        <div className="flex flex-col">
          <label className="font-semibold">Cantidad de dependencias</label>
          <Dropdown
            value={cantidadDependencias}
            options={[
              { label: "Una", value: "una" },
              { label: "Más de una", value: "varias" },
            ]}
            onChange={(e) => handleCantidadDependenciasChange(e.value)}
            className="w-full border border-gray-300 rounded-md"
            appendTo="self"
          />
        </div>

        {/* Dependencia(s) solicitante(s) */}
        <div className="flex flex-col ">
          <label className="font-semibold">
            {cantidadDependencias === "una"
              ? "Dependencia solicitante"
              : "Dependencias solicitantes"}
          </label>
          {cantidadDependencias === "una" ? (
            <Dropdown
              value={formData.InstitucionSolicitante || ""}
              options={EntidadesDependencias}
              optionLabel="label"
              optionValue="value"
              onChange={(e) =>
                handleChange("InstitucionSolicitante", e.value)
              }
              className="w-full border border-gray-300 rounded-md"
              appendTo="self"
            />
          ) : (
            <MultiSelect
              value={formData.InstitucionSolicitante || []}
              options={EntidadesDependencias}
              optionLabel="label"
              optionValue="value"
              onChange={(e) =>
                handleChange("InstitucionSolicitante", e.value)
              }
              className="w-full border border-gray-300 rounded-md"
              display="chip" 
              appendTo="self"
              selectAllLabel="Seleccionar todas"
              
            />
          )}
        </div>
        {/*Modalidad / Sector */}    
        <div className="flex flex-col">
          <label className="font-semibold">Modalidad</label>
           <Dropdown
            value={formData.Modalidad || ""}
            options={modalidades}
            onChange={(e) => handleChange("Modalidad", e.value)}
            appendTo={`self`}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Sector</label>
           <Dropdown
            value={formData.Sector || ""}
            options={sectores}
            onChange={(e) => handleChange("Sector", e.value)}
            appendTo={`self`}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>

          {/* Región */}

        <div className="flex flex-col">
          <label className="font-semibold">Región</label>
          <InputText value={formData.Region ?? ""} onChange={(e) => handleChange("Region", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>

        {/* Tipo de cooperacion / Autoridad Acargo */}

         <div className="flex flex-col">
          <label className="font-semibold">Tipo de cooperacion</label>
           <Dropdown
            value={formData.TipoCooperacion || ""}
            options={TipoCooperaciones}
            onChange={(e) => handleChange("TipoCooperacion", e.value)}
            appendTo={`self`}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label className="font-semibold">Autoridad a cargo</label>
           <Dropdown
            value={formData.AutoridadAcargo || ""}
            options={AutoridadesAcargo}
            onChange={(e) => handleChange("AutoridadAcargo", e.value)}
            appendTo={`self`}
            className="w-full border border-gray-300 rounded-md"
          />
        </div>     


        {/* Tipo / Area */}

          <div className="flex flex-col">
        <label className="font-semibold">
          Área <span className="text-red-500">*</span>
        </label>
        {agregandoArea ? (
          <InputText
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
            placeholder="Ingrese nueva área"
            className="w-full border border-gray-300 rounded-md p-2 bg-white"
          />
        ) : (
          <>
            <Dropdown
              value={formData.IdAreas ?? null}
              options={listaAreas}
              placeholder="Seleccione un área"
              onChange={(e) => handleAreaChange(e.value)}
              className={`w-full border rounded-md ${errors.IdAreas ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.IdAreas && <span className="text-xs text-red-500 mt-1">{errors.IdAreas}</span>}
          </>
        )}
      </div>

        {/* Contrapartidas */}
        <div className="flex flex-col">
          <label className="font-semibold">Contrapartida institucional</label>
          <InputText value={formData.ContrapartidaInstitucional ?? ""} onChange={(e) => handleChange("ContrapartidaInstitucional", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" placeholder="Escriba en dolares"/>
        </div>
        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold">Contrapartida del cooperante</label>
          <InputText value={formData.ContrapartidaCooperante ?? ""} onChange={(e) => handleChange("ContrapartidaCooperante", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" placeholder="Escriba en dolares" />
        </div>

        {/* Costo Total */}
        <div className="flex flex-col">
          <label className="font-semibold">Costo total</label>
          <InputText value={formData.CostoTotal ?? ""} onChange={(e) => handleChange("CostoTotal", e.target.value)} className="w-full border border-gray-300 rounded-md p-2 bg-white" placeholder="Escriba en dolares" />
        </div>



        {/* Campos largos */}
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Objetivo general</label>
          <InputTextarea value={formData.ObjetivoGeneral ?? ""} onChange={(e) => handleChange("ObjetivoGeneral", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Resultados</label>
          <InputTextarea value={formData.Resultados ?? ""} onChange={(e) => handleChange("Resultados", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>        
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Productos</label>
          <InputTextarea value={formData.Productos ?? ""} onChange={(e) => handleChange("Productos", e.target.value)} rows={2} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>


        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">Observaciones</label>
          <InputTextarea value={formData.Observaciones ?? ""} onChange={(e) => handleChange("Observaciones", e.target.value)} rows={3} className="w-full border border-gray-300 rounded-md p-2 bg-white" />
        </div>
      </div>       
       {/* ✅ Documentos obligatorios (2 campos) */}
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">
            Carta de aprobación MIDEPLAN (URL) <span className="text-red-500">*</span>
          </label>
          <InputText 
            value={cartaAprobacionMideplan} 
            onChange={(e) => setCartaAprobacionMideplan(e.target.value)} 
            placeholder="https://ejemplo.com/carta-mideplan.pdf" 
            className={`w-full border rounded-md p-2 bg-white ${errors.CartaAprobacionMideplan ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.CartaAprobacionMideplan && <span className="text-xs text-red-500 mt-1">{errors.CartaAprobacionMideplan}</span>}
        </div>

        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">
            Formulario de proyecto (URL) <span className="text-red-500">*</span>
          </label>
          <InputText 
            value={formularioProyecto} 
            onChange={(e) => setFormularioProyecto(e.target.value)} 
            placeholder="https://ejemplo.com/formulario-proyecto.pdf" 
            className={`w-full border rounded-md p-2 bg-white ${errors.FormularioProyecto ? "border-red-400" : "border-gray-300"}`}
          />
          {errors.FormularioProyecto && <span className="text-xs text-red-500 mt-1">{errors.FormularioProyecto}</span>}
        </div>
        <div className="flex flex-col md:col-span-3">
          <label className="font-semibold">
            Informe del proyecto (URL)
          </label>
          <InputText 
            value={informeProyecto} 
            onChange={(e) => setInformeProyecto(e.target.value)} 
            placeholder="https://ejemplo.com/informe-proyecto.pdf" 
            className="w-full border rounded-md p-2 bg-white"
          />
        </div>
    </Dialog>
  );
}

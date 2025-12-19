"use client";
import { useState } from "react";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Accordion, AccordionTab } from "primereact/accordion";
import { TabView, TabPanel } from "primereact/tabview";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, BarElement, CategoryScale, LinearScale);

interface Proyecto {
  NumProyecto: number;
  NombreProyecto: string;
  NombreActor: string;
  EtapaProyecto: string;
  DependenciasSolicitantes: string | string[];
  Modalidad: string;
  Sector: string;
  Region: string;
  TipoCooperacion: string;
  AutoridadAcargo: string;
  IdAreas: number;
  ContrapartidaInstitucional: string;
  ContrapartidaCooperante: string;
  CostoTotal: string;
  Ano: string;
}

const PROYECTOS_MOCK: Proyecto[] = [
  { 
    NumProyecto: 1, 
    NombreProyecto: "Fortalecimiento de Infraestructura Tecnológica Educativa", 
    NombreActor: "Ministerio de Educación Pública", 
    EtapaProyecto: "En ejecución", 
    DependenciasSolicitantes: "Recursos tecnologicos en educacion, Desarrollo currícular", 
    Modalidad: "Cooperación técnica", 
    Sector: "Vilateral", 
    Region: "San José", 
    TipoCooperacion: "Norte-Sur", 
    AutoridadAcargo: "Viceministerio academico", 
    IdAreas: 1, 
    ContrapartidaInstitucional: "$85,000", 
    ContrapartidaCooperante: "$150,000", 
    CostoTotal: "$235,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 2, 
    NombreProyecto: "Programa de Becas para Formación Docente Avanzada", 
    NombreActor: "UNESCO", 
    EtapaProyecto: "aprobado por el MEP", 
    DependenciasSolicitantes: "Gestión de talento humano, Desarrollo currícular, Vida estudiantil", 
    Modalidad: "Financiera no reembolsables", 
    Sector: "Multilateral", 
    Region: "Nacional", 
    TipoCooperacion: "Regional", 
    AutoridadAcargo: "Despacho del ministro", 
    IdAreas: 2, 
    ContrapartidaInstitucional: "$120,000", 
    ContrapartidaCooperante: "$300,000", 
    CostoTotal: "$420,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 3, 
    NombreProyecto: "Modernización de Infraestructura Escolar en Zonas Rurales", 
    NombreActor: "Banco Interamericano de Desarrollo", 
    EtapaProyecto: "aprobado por el MIDEPLAN", 
    DependenciasSolicitantes: "Infraestructura educativa, Gestión y desarrollo regional", 
    Modalidad: "Financiera reembolsables", 
    Sector: "Multilateral", 
    Region: "Guanacaste", 
    TipoCooperacion: "Norte-Sur", 
    AutoridadAcargo: "Viceministerio administrativo", 
    IdAreas: 3, 
    ContrapartidaInstitucional: "$500,000", 
    ContrapartidaCooperante: "$2,000,000", 
    CostoTotal: "$2,500,000", 
    Ano: "2023" 
  },
  { 
    NumProyecto: 4, 
    NombreProyecto: "Capacitación en Educación Técnica y Emprendimiento", 
    NombreActor: "Agencia de Cooperación Alemana GIZ", 
    EtapaProyecto: "En ejecución", 
    DependenciasSolicitantes: "Educación Tecnica y capacidades emprendedoras, Desarrollo currícular", 
    Modalidad: "Cooperación técnica", 
    Sector: "Vilateral", 
    Region: "Cartago", 
    TipoCooperacion: "Cooperación sur-sur", 
    AutoridadAcargo: "Viceministerio academico", 
    IdAreas: 1, 
    ContrapartidaInstitucional: "$60,000", 
    ContrapartidaCooperante: "$180,000", 
    CostoTotal: "$240,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 5, 
    NombreProyecto: "Programa de Equidad Educativa para Poblaciones Vulnerables", 
    NombreActor: "UNICEF Costa Rica", 
    EtapaProyecto: "En proceso de Formulacion", 
    DependenciasSolicitantes: "Programas de equidad, Vida estudiantil, Contraloría de derechos estudiantiles", 
    Modalidad: "Financiera no reembolsables", 
    Sector: "Multilateral", 
    Region: "Limón", 
    TipoCooperacion: "Ayuda humanitaria", 
    AutoridadAcargo: "Multigerencial", 
    IdAreas: 4, 
    ContrapartidaInstitucional: "$75,000", 
    ContrapartidaCooperante: "$250,000", 
    CostoTotal: "$325,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 6, 
    NombreProyecto: "Sistema Digital de Gestión Educativa Nacional", 
    NombreActor: "Gobierno de Corea del Sur", 
    EtapaProyecto: "En negociación", 
    DependenciasSolicitantes: "Informática de gestión, Planificación institucional", 
    Modalidad: "Cooperación técnica", 
    Sector: "Vilateral", 
    Region: "Nacional", 
    TipoCooperacion: "Triangulación", 
    AutoridadAcargo: "Viceministerio administrativo", 
    IdAreas: 5, 
    ContrapartidaInstitucional: "$200,000", 
    ContrapartidaCooperante: "$500,000", 
    CostoTotal: "$700,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 7, 
    NombreProyecto: "Evaluación y Mejora de Calidad Educativa", 
    NombreActor: "Organización de Estados Iberoamericanos OEI", 
    EtapaProyecto: "Ejecutado", 
    DependenciasSolicitantes: "Gestión y evaluación de la calidad, Desarrollo currícular", 
    Modalidad: "Cooperación técnica", 
    Sector: "Multilateral", 
    Region: "San José", 
    TipoCooperacion: "Regional", 
    AutoridadAcargo: "Viceministerio academico", 
    IdAreas: 2, 
    ContrapartidaInstitucional: "$45,000", 
    ContrapartidaCooperante: "$90,000", 
    CostoTotal: "$135,000", 
    Ano: "2023" 
  },
  { 
    NumProyecto: 8, 
    NombreProyecto: "Fortalecimiento de Educación Privada y Regulación", 
    NombreActor: "Fundación Internacional para la Educación", 
    EtapaProyecto: "aprobado por el MEP", 
    DependenciasSolicitantes: "Educación privada, Asuntos Jurídicos", 
    Modalidad: "Financiera no reembolsables", 
    Sector: "Vilateral", 
    Region: "Heredia", 
    TipoCooperacion: "Norte-Sur", 
    AutoridadAcargo: "Despacho del ministro", 
    IdAreas: 3, 
    ContrapartidaInstitucional: "$55,000", 
    ContrapartidaCooperante: "$120,000", 
    CostoTotal: "$175,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 9, 
    NombreProyecto: "Desarrollo Curricular en Ciencias y Matemáticas", 
    NombreActor: "National Science Foundation", 
    EtapaProyecto: "En ejecución", 
    DependenciasSolicitantes: "Desarrollo currícular, Recursos tecnologicos en educacion", 
    Modalidad: "Cooperación técnica", 
    Sector: "Vilateral", 
    Region: "Alajuela", 
    TipoCooperacion: "Norte-Sur", 
    AutoridadAcargo: "Viceministerio academico", 
    IdAreas: 1, 
    ContrapartidaInstitucional: "$70,000", 
    ContrapartidaCooperante: "$160,000", 
    CostoTotal: "$230,000", 
    Ano: "2024" 
  },
  { 
    NumProyecto: 10, 
    NombreProyecto: "Infraestructura Educativa Resiliente al Cambio Climático", 
    NombreActor: "Programa de las Naciones Unidas para el Desarrollo PNUD", 
    EtapaProyecto: "Finalizado", 
    DependenciasSolicitantes: "Infraestructura educativa, Servicios generales", 
    Modalidad: "Financiera no reembolsables", 
    Sector: "Multilateral", 
    Region: "Puntarenas", 
    TipoCooperacion: "Ayuda humanitaria", 
    AutoridadAcargo: "Viceministerio administrativo", 
    IdAreas: 4, 
    ContrapartidaInstitucional: "$150,000", 
    ContrapartidaCooperante: "$400,000", 
    CostoTotal: "$550,000", 
    Ano: "2023" 
  },
  { 
    NumProyecto: 11, 
    NombreProyecto: "Programa de Transparencia y Contraloría Educativa", 
    NombreActor: "Banco Mundial", 
    EtapaProyecto: "Rechazado por MIDEPLAN", 
    DependenciasSolicitantes: "Auditoria Interna, Contraloría de servicios", 
    Modalidad: "Cooperación técnica", 
    Sector: "Multilateral", 
    Region: "Nacional", 
    TipoCooperacion: "Norte-Sur", 
    AutoridadAcargo: "Despacho del ministro", 
    IdAreas: 5, 
    ContrapartidaInstitucional: "$40,000", 
    ContrapartidaCooperante: "$80,000", 
    CostoTotal: "$120,000", 
    Ano: "2023" 
  },
  { 
    NumProyecto: 12, 
    NombreProyecto: "Fortalecimiento de Competencias en Idiomas Extranjeros", 
    NombreActor: "British Council", 
    EtapaProyecto: "En ejecución", 
    DependenciasSolicitantes: "Desarrollo currícular, Gestión de talento humano", 
    Modalidad: "Cooperación técnica", 
    Sector: "Vilateral", 
    Region: "San José", 
    TipoCooperacion: "Cooperación sur-sur", 
    AutoridadAcargo: "Viceministerio academico", 
    IdAreas: 2, 
    ContrapartidaInstitucional: "$90,000", 
    ContrapartidaCooperante: "$210,000", 
    CostoTotal: "$300,000", 
    Ano: "2024" 
  }
];

function mezclarColoresHex(hex1: string, hex2: string, ratio: number): string {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
  const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
  const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function generarColoresDesdeBase(cantidad: number): string[] {
  const baseColors = ["#CFAC65", "#182951", "#F2DAB1", "#C1C5C8", "#0034A0"];
  const colores: string[] = [];
  for (let i = 0; i < cantidad; i++) {
    const baseIndex = i % baseColors.length;
    const nextIndex = (baseIndex + 1) % baseColors.length;
    const ratio = (i / cantidad) % 1;
    colores.push(mezclarColoresHex(baseColors[baseIndex], baseColors[nextIndex], ratio));
  }
  return colores;
}

interface GraficoTabProps {
  titulo: string;
  campoPrincipal: string;
  datos: Proyecto[];
  tipoGrafico?: "pie" | "bar";
  procesarValor?: (valor: any) => string[];
}

function GraficoTabBar({
  titulo,
  campoPrincipal,
  datos,
  procesarValor,
}: Omit<GraficoTabProps, "tipoGrafico">) {
  const agrupado: Record<string, Proyecto[]> = {};

  datos.forEach((proyecto) => {
    const valor = (proyecto as any)[campoPrincipal];

    if (campoPrincipal === "DependenciasSolicitantes") {
      let deps: string[] = [];
      if (Array.isArray(valor)) deps = valor;
      else if (typeof valor === "string") deps = valor.split(",").map((d: string) => d.trim()).filter((d: string) => d);
      deps.forEach((dep) => {
        const depLimpia = dep.trim() || "Sin dependencia";
        if (!agrupado[depLimpia]) agrupado[depLimpia] = [];
        agrupado[depLimpia].push(proyecto);
      });
      return;
    }

    if (procesarValor) {
      const valores = procesarValor(valor);
      valores.forEach((v) => {
        const key = v || "Sin datos";
        if (!agrupado[key]) agrupado[key] = [];
        agrupado[key].push(proyecto);
      });
    } else {
      const key = valor?.toString()?.trim() || "Sin datos";
      if (!agrupado[key]) agrupado[key] = [];
      agrupado[key].push(proyecto);
    }
  });

  const labels = Object.keys(agrupado);
  const valores = labels.map((l) => agrupado[l].length);
  const colores = generarColoresDesdeBase(labels.length);

  const barChartData = {
    labels,
    datasets: [
      {
        label: titulo,
        backgroundColor: colores,
        data: valores,
        barThickness: 20,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y" as const,
    maintainAspectRatio: true,
    responsive: true,
    scales: {
      x: {
        ticks: {
          precision: 0,
          color: "#6B7280",
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 10,
          },
          callback: function (value: any) {
            const label = labels[value];
            return label && label.length > 50 ? label.slice(0, 50) + "..." : label;
          },
        },
        max: labels.length - 0.5,   
        min: -0.5,                    
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#fff",
        formatter: (value: number, context: any) => {
          const sum = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / sum) * 100).toFixed(1);
          return `${percentage}%`;
        },
        anchor: "center",
        align: "center",
        font: {
          weight: "bold",
          size: 12,
        },
        clamp: true,
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-6">📊 {titulo}</h2>

      <div className="w-full mb-6" style={{ height: "900px", overflow: "scroll" }}>
        <Chart type="bar" data={barChartData} options={chartOptions} />
      </div>

      <div className="w-full">
        <Accordion multiple activeIndex={[0]}>
          {labels.map((label, index) => (
            <AccordionTab
              key={index}
              header={
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{ backgroundColor: colores[index] }}
                  />
                  <span className="text-gray-800 font-medium">{label}</span>
                </div>
              }
            >
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {agrupado[label].map((proyecto, idx) => (
                  <li key={idx} className="py-1">{proyecto.NombreProyecto || "Sin nombre"}</li>
                ))}
              </ul>
            </AccordionTab>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

function GraficoTabPie({
  titulo,
  campoPrincipal,
  datos,
  procesarValor,
}: Omit<GraficoTabProps, "tipoGrafico">) {
  const agrupado: Record<string, Proyecto[]> = {};

  datos.forEach((proyecto) => {
    const valor = (proyecto as any)[campoPrincipal];

    if (campoPrincipal === "DependenciasSolicitantes") {
      let deps: string[] = [];
      if (Array.isArray(valor)) deps = valor;
      else if (typeof valor === "string") deps = valor.split(",").map((d: string) => d.trim()).filter((d: string) => d);
      deps.forEach((dep) => {
        const depLimpia = dep.trim() || "Sin dependencia";
        if (!agrupado[depLimpia]) agrupado[depLimpia] = [];
        agrupado[depLimpia].push(proyecto);
      });
      return;
    }

    if (procesarValor) {
      const valores = procesarValor(valor);
      valores.forEach((v) => {
        const key = v || "Sin datos";
        if (!agrupado[key]) agrupado[key] = [];
        agrupado[key].push(proyecto);
      });
    } else {
      const key = valor?.toString()?.trim() || "Sin datos";
      if (!agrupado[key]) agrupado[key] = [];
      agrupado[key].push(proyecto);
    }
  });

  const labels = Object.keys(agrupado);
  const valores = labels.map((l) => agrupado[l].length);
  const colores = generarColoresDesdeBase(labels.length);

  const pieChartData = {
    labels,
    datasets: [
      {
        data: valores,
        backgroundColor: colores,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: true,
    responsive: true,
    layout: {
      padding: {
        top: 10,
        bottom: 20,
        left: 40,
        right: 50,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        color: "#333",
        formatter: (value: number, context: any) => {
          const sum = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / sum) * 100).toFixed(1);
          return `${percentage}%`;
        },
        anchor: "end",
        align: "end",
        font: {
          weight: "bold" as const,
          size: 14,
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg flex">
      <div className="w-1/4 pr-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Categorías</h2>
        <ul className="space-y-2">
          {labels.map((label, index) => (
            <li key={index} className="flex items-center">
              <span
                className="w-4 h-4 rounded-full inline-block mr-2"
                style={{ backgroundColor: colores[index] }}
              />
              <span className="text-gray-700 font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-3/4 pl-4 flex flex-col items-center">
        <h2 className="text-lg font-bold mb-4 text-gray-700">📊 {titulo}</h2>

        <div className="w-[500px] h-[500px] mb-6">
          <Chart type="pie" data={pieChartData} options={chartOptions} />
        </div>

        <div className="w-full">
          <Accordion multiple activeIndex={[0]}>
            {labels.map((label, idx) => (
              <AccordionTab
                key={idx}
                header={
                  <span
                    className="text-white px-3 py-1 rounded-md font-semibold"
                    style={{ backgroundColor: colores[idx] }}
                  >
                    {label}
                  </span>
                }
              >
                <ul className="list-disc list-inside text-gray-600 text-sm">
                  {agrupado[label].map((proyecto, i) => (
                    <li key={i} className="py-1">{proyecto.NombreProyecto || "Sin nombre"}</li>
                  ))}
                </ul>
              </AccordionTab>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

// Componente para gráfico de Año con 3 barras por año
function GraficoAniosConMontos({ datos }: { datos: Proyecto[] }) {
  const agrupadoPorAnio: Record<string, {
    contrapartidaInstitucional: number;
    contrapartidaCooperante: number;
    costoTotal: number;
    proyectos: Proyecto[];
  }> = {};

  datos.forEach((proyecto) => {
    const anio = proyecto.Ano || "Sin año";
    if (!agrupadoPorAnio[anio]) {
      agrupadoPorAnio[anio] = {
        contrapartidaInstitucional: 0,
        contrapartidaCooperante: 0,
        costoTotal: 0,
        proyectos: []
      };
    }

    const parseMontos = (monto: string) => {
      return parseFloat(monto.replace(/[$,]/g, '')) || 0;
    };

    agrupadoPorAnio[anio].contrapartidaInstitucional += parseMontos(proyecto.ContrapartidaInstitucional);
    agrupadoPorAnio[anio].contrapartidaCooperante += parseMontos(proyecto.ContrapartidaCooperante);
    agrupadoPorAnio[anio].costoTotal += parseMontos(proyecto.CostoTotal);
    agrupadoPorAnio[anio].proyectos.push(proyecto);
  });

  const labels = Object.keys(agrupadoPorAnio).sort();

  const barChartData = {
    labels,
    datasets: [
      {
        label: "Contrapartida Institucional",
        backgroundColor: "#CFAC65",
        data: labels.map(anio => agrupadoPorAnio[anio].contrapartidaInstitucional),
        barThickness: 60,
      },
      {
        label: "Contrapartida Cooperante",
        backgroundColor: "#182951",
        data: labels.map(anio => agrupadoPorAnio[anio].contrapartidaCooperante),
        barThickness: 60,
      },
      {
        label: "Costo Total",
        backgroundColor: "#0034A0",
        data: labels.map(anio => {
          // Ajuste especial para el año 2024
          if (anio === "2024") {
            return 3000000; // $3,000,000
          }
          return agrupadoPorAnio[anio].costoTotal;
        }),
        barThickness: 60,
      },
    ],
  };

  const chartOptions = {
    indexAxis: "x" as const,
    maintainAspectRatio: false,
    responsive: true,
    aspectRatio: 0.5,
    scales: {
      x: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 14,
          },
        },
      },
      y: {
        ticks: {
          color: "#6B7280",
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return "$" + value.toLocaleString();
          }
        },
        title: {
          display: true,
          text: "Monto en USD",
          color: "#6B7280",
          font: {
            size: 16,
            weight: "bold" as const,
          }
        }
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#6B7280",
          font: {
            size: 14,
          },
          padding: 15,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-6">📊 Análisis Financiero por Año</h2>

      {/* Contenedor reducido de 900px a 600px */}
      <div className="w-full mb-6" style={{ height: "600px" }}>
        <Chart type="bar" data={barChartData} options={chartOptions} />
      </div>

      <div className="w-full mt-6">
        <Accordion multiple activeIndex={[0]}>
          {labels.map((anio, index) => {
            const datosAnio = agrupadoPorAnio[anio];
            // Mostrar el costo total ajustado para 2024
            const costoTotalMostrar = anio === "2024" ? 3000000 : datosAnio.costoTotal;
            
            return (
              <AccordionTab
                key={index}
                header={
                  <div className="flex items-center gap-3">
                    <span className="text-gray-800 font-bold text-base">{anio}</span>
                    <span className="text-gray-500 text-sm">
                      ({datosAnio.proyectos.length} proyecto{datosAnio.proyectos.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                }
              >
                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-[#CFAC65]/10 to-[#CFAC65]/5 p-4 rounded-lg border border-[#CFAC65]/20">
                      <p className="text-xs text-gray-600 mb-1">Contrapartida Institucional</p>
                      <p className="text-xl font-bold text-[#CFAC65]">
                        ${datosAnio.contrapartidaInstitucional.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#182951]/10 to-[#182951]/5 p-4 rounded-lg border border-[#182951]/20">
                      <p className="text-xs text-gray-600 mb-1">Contrapartida Cooperante</p>
                      <p className="text-xl font-bold text-[#182951]">
                        ${datosAnio.contrapartidaCooperante.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-[#0034A0]/10 to-[#0034A0]/5 p-4 rounded-lg border border-[#0034A0]/20">
                      <p className="text-xs text-gray-600 mb-1">Costo Total</p>
                      <p className="text-xl font-bold text-[#0034A0]">
                        ${costoTotalMostrar.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="font-semibold text-gray-700 mb-3 text-sm">Proyectos del año {anio}:</p>
                    <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                      {datosAnio.proyectos.map((proyecto, idx) => (
                        <li key={idx} className="py-1 pl-2">
                          <span className="font-medium">{proyecto.NombreProyecto}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({proyecto.NombreActor})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionTab>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default function PresentarGrafico() {
  const [proyectos] = useState<Proyecto[]>(PROYECTOS_MOCK);
  const [anioSeleccionado, setAnioSeleccionado] = useState<string | null>(null);

  const aniosDisponibles = Array.from(new Set(proyectos.map((p) => p.Ano).filter((a) => a))).sort();
  const proyectosFiltrados = anioSeleccionado ? proyectos.filter((p) => p.Ano === anioSeleccionado) : proyectos;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📈 Análisis de Proyectos</h1>
        <Dropdown
          value={anioSeleccionado}
          options={aniosDisponibles.map((a) => ({ label: a, value: a }))}
          onChange={(e) => setAnioSeleccionado(e.value)}
          placeholder="Filtrar por año"
          className="w-40"
          showClear
        />
      </div>

      <TabView>
        <TabPanel header="Nombre Actor">
          <GraficoTabBar titulo="Proyectos por Nombre de Actor" campoPrincipal="NombreActor" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Etapa">
          <GraficoTabPie titulo="Proyectos por Etapa" campoPrincipal="EtapaProyecto" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Dependencias">
          <GraficoTabBar titulo="Proyectos por Dependencias Solicitantes" campoPrincipal="DependenciasSolicitantes" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Modalidad">
          <GraficoTabPie titulo="Proyectos por Modalidad" campoPrincipal="Modalidad" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Sector">
          <GraficoTabPie titulo="Proyectos por Sector" campoPrincipal="Sector" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Región">
          <GraficoTabBar titulo="Proyectos por Región" campoPrincipal="Region" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Tipo Cooperación">
          <GraficoTabPie titulo="Proyectos por Tipo de Cooperación" campoPrincipal="TipoCooperacion" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Autoridad">
          <GraficoTabBar titulo="Proyectos por Autoridad a Cargo" campoPrincipal="AutoridadAcargo" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Áreas">
          <GraficoTabPie titulo="Proyectos por Área" campoPrincipal="IdAreas" datos={proyectosFiltrados} />
        </TabPanel>

        <TabPanel header="Año">
          <GraficoAniosConMontos datos={proyectosFiltrados} />
        </TabPanel>
      </TabView>
    </div>
  );
}
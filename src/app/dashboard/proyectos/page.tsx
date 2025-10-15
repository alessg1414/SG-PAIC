"use client";

import Proyectos from "@/app/components/Proyectos";
import { TabView, TabPanel } from "primereact/tabview";

export default function ProyectosPage() {
  return (
    <TabView>
      <TabPanel header="Proyectos">
        <div>
          {/* Bloque de título */}
          <div className="mb-8 mt-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-[#172951] tracking-tight leading-tight">
                Lista de Proyectos
              </h1>
            </div>
            <p className="text-gray-500 text-base mt-1">
              Gestión y seguimiento de proyectos de cooperación
            </p>
          </div>

          {/* Componente principal */}
          <Proyectos />
        </div>
      </TabPanel>
    </TabView>
  );
}

"use client";

import Presupuestos from "@/app/components/Presupuestos";
import { TabView, TabPanel } from "primereact/tabview";

export default function ProyectosPage() {
  return (
    <TabView>
      <TabPanel header="Presupuestos">
        <div>
          {/* Bloque de título */}
          <div className="mb-8 mt-2">
            <div className="flex items-center gap-3">
             
            </div>
          </div>

          {/* Componente principal */}
          <Presupuestos />
        </div>
      </TabPanel>
    </TabView>
  );
}

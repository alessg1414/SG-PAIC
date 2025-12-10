"use client";

import { TabView, TabPanel } from "primereact/tabview";
import { useState } from "react";

export default function AcuerdosViajesEstaPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-[#172951] mb-4">
          Estadísticas - Viajes al Exterior
        </h1>
        
        <div className="custom-tabs">
          <TabView
            className="slanted-tabview"
            activeIndex={activeIndex}
            onTabChange={(e) => setActiveIndex(e.index)}
          >
            <TabPanel header="📊 Gráfico 1">
              <div className="p-4 fade-in">
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center h-64 flex items-center justify-center">
                  <div>
                    <i className="pi pi-chart-bar text-5xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600 font-semibold">Distribución por destino</p>
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel header="📈 Gráfico 2">
              <div className="p-4 fade-in">
                <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center h-64 flex items-center justify-center">
                  <div>
                    <i className="pi pi-chart-pie text-5xl text-gray-400 mb-2"></i>
                    <p className="text-gray-600 font-semibold">Viajes por mes</p>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  );
}
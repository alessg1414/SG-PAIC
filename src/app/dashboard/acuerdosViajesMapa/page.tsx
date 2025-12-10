"use client";

export default function AcuerdosViajesMapaPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-[#172951] mb-4">
          Mapa de Viajes al Exterior
        </h1>
        
        <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <i className="pi pi-map-marker text-6xl text-gray-500 mb-3"></i>
            <p className="text-gray-600 font-semibold text-lg">
              Mapa Interactivo de Destinos
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Aquí se mostrará el mapa con los destinos de viaje
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
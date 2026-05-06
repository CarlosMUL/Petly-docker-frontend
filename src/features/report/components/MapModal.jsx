import { useState, useEffect, useRef } from "react";
import Map from "../../map/components/mapBox";
import Field from "../../../shared/components/Field";


export default function MapModal({ open = true, onClose, onContinue }) {
  const [coords, setCoords] = useState(null);
  const mapRef = useRef();

  // Mapbox a veces no detecta bien su nuevo tamaño cuando se abre dentro de un modal, por eso se le aplica un delay de 100ms, mapa resizea segun modal
  useEffect(() => {
    setTimeout(() => {
      mapRef.current?.resize?.();
    }, 100);
  }, []);

  if (!open) return null;

  const valid =
    coords &&
    !isNaN(coords.lat) &&
    !isNaN(coords.lng);

  return (
    <div className="fixed inset-0 z-50">

      <div className="absolute inset-0">
        <Map
          ref={mapRef}
          selectable
          selectedCoords={coords}
          onLocationSelect={setCoords}
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">

        <div className="relative flex items-center p-4 bg-black/50 backdrop-blur-md text-white pointer-events-auto">

          <div>
            <button
              onClick={onClose}
              className="text-sm text-white/70 bg-white/8 hover:bg-white/12 border border-white/10 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Volver
            </button>
          </div>



          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="text-xs text-white/40 block uppercase tracking-wide">
              Ubicación
            </span>

            <span className="text-sm text-white/80">
              {valid
                ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
                : "Toca el mapa"}
            </span>
          </div>

          <div className="ml-auto w-22" />

        </div>




        {!valid && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full border border-white/10 backdrop-blur pointer-events-none">
            Toca para seleccionar ubicación
          </div>
        )}



        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/70 to-transparent" />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <button
            id="fab-confirm"
            disabled={!valid}
            onClick={() => onContinue?.(coords)}
            className={`
              h-16 w-16 rounded-full flex items-center justify-center
              transition-all duration-300 ease-out mb-10
              ${valid
                ? "bg-[#5DCAA5] text-[#0a1a10] shadow-lg shadow-[#5DCAA5]/30 hover:scale-110 active:scale-95 cursor-pointer"
                : "bg-white/10 text-white/20 border border-white/10 scale-95"}
            `}
          >
            {/* Tick correcto */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}
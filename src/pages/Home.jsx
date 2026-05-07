import { useEffect, useRef, useState } from "react";


import FloatingButton from "../shared/components/FloatingButton";
import { useReport } from "../features/report/hooks/useReport";
import Map from "../features/map/components/mapBox";
import PetGrid from "../features/incidents/components/PetGrid";
import Filters from "../features/incidents/components/Filter";
import { DEFAULT_PET_FILTERS } from "../features/incidents/constants/filters";
import { usePets } from "../features/incidents/hooks/usePets";
import SearchBar from "../features/incidents/components/SearchBar";
import { useUserLocation } from "../shared/hooks/useUserLocation";
import ReportModal from "../features/report/components/ReportModal";
import AuthGuardModal from "../shared/components/AuthGuardModal";
import { useAuth } from "../features/auth/components/AuthContext";

export default function Home() {

  const [modalOpen, setModalOpen] = useState(false);
  const [authGuardOpen, setAuthGuardOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_PET_FILTERS);
  const { submitReport } = useReport();
  const { user } = useAuth();
  const [actionType, setActionType] = useState(null);
  const gridRef = useRef(null);
  const { pets, loading } = usePets(filters);
  const { location } = useUserLocation();
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [tipoReporte, setTipoReporte] = useState(null);

  const mapTipo = {
    Encontrado: "ENCONTRADA",
    Perdido: "PERDIDA",
    Avistamiento: "AVISTAMIENTO",
  };

  async function handleSubmit(data) {
    await submitReport(data, tipoReporte);
  }

  function handleClose() {
    setModalOpen(false);
    setTipoReporte(null);
    setActionType(null);
  }

  useEffect(() => {
    if (!selectedReportId) return;

    function handlePointerDown(event) {
      if (gridRef.current?.contains(event.target)) return;
      setSelectedReportId(null);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedReportId]);

  return (

    <div className="flex flex-col md:flex-row min-h-screen bg-linear-to-b from-[#369467] via-[#1a412f] to-[#0a1a10]">
      {/*Este mapa esta comentado debido a que me ayuda a no usar de manera innecesaria la capacidad gratis de mapbox, pero en este caso me encantaria que este mapa abarcara la mitad de la pantalla también*/}
      <div className="w-full md:w-1/2 md:h-[calc(100vh-3rem)] h-75 md:sticky md:top-12">
        <Map
          filters={filters}
          selectedReportId={selectedReportId}
          onReportSelect={(report) => setSelectedReportId(report.id)}
        />

      </div>

      <section className="w-full md:w-1/2 p-4 md:pt-20 bg-white/5 backdrop-blur-xl border-l border-white/10 md:h-full md:overflow-y-auto">


        <SearchBar
          value={filters.search}
          onChange={(val) => setFilters({ ...filters, search: val })}
        />

        {/* Este es el filtro que realiza el puente entre el front y la lógica del backend, al cambiar el filtro se actualizan los incidentes mostrados en el petgrid, lo ideal es que este filtro se mantuviera fijo en la parte superior de la pantalla mientras se hace scroll por los incidentes. */}
        <Filters value={filters} onChange={setFilters} />
        {/*Este petgrid me ayuda a mostrar los animales disponibles para adopción/búsqueda. Al fin y al cabo es solo muestreo, me encantaría que ocupara solo la mitad de la pantalla*/}

        <PetGrid
          pets={pets}
          loading={loading}
          referenceLocation={location}
          selectedPetId={selectedReportId}
          onCardClick={(pet) => console.log("[Home] mascota seleccionada:", pet)} //Aqui deberia ir la lógica de expansión de mascota para mostrar más detalles, fotos, etc.
        />
      </section>

      {/*Este floating button sirve para crear reportes de pérdida. Lo ideal es lograr que este al medio, es de prueba, por lo tanto no hay que centrarse (Aún) en funcionalidad*/}
      {/* FAB centrado horizontalmente */}
      <FloatingButton
        onAction={(type) => {
          if (!user) {
            setAuthGuardOpen(true);
            return;
          }
          setActionType(type);
          setModalOpen(true);
          setTipoReporte(mapTipo[type]);
        }}
      />

      <ReportModal
        open={modalOpen}
        actionType={actionType}
        tipoReporte={tipoReporte}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />

      <AuthGuardModal open={authGuardOpen} onClose={() => setAuthGuardOpen(false)} />


    </div>
  );
}

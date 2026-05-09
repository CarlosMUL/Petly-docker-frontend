import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import heroImage from "../assets/heromascotas.jpg";
import { useAuth } from "../features/auth/context/authContext";
import AuthGuardModal from "../shared/components/AuthGuardModal";

const REPORTS_API_URL =
  import.meta.env.VITE_REPORTS_MAP_URL || "http://localhost:8080/petly/reportes";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Home2() {
  const carouselRef = useRef(null);
  const [authGuardOpen, setAuthGuardOpen] = useState(false);
  const [backendReports, setBackendReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const reports = useMemo(() => {
    return backendReports.slice(0, 8).map(normalizeReport);
  }, [backendReports]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadBackendReports() {
      setLoadingReports(true);
      setReportsError(null);

      try {
        const response = await fetch(REPORTS_API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const reportsFromBackend = Array.isArray(data) ? data : [];
        const reportsWithPlaces = await enrichReportsWithPlaces(
          reportsFromBackend,
          controller.signal
        );

        setBackendReports(reportsWithPlaces);
      } catch (error) {
        if (error.name !== "AbortError") {
          setBackendReports([]);
          setReportsError("No se pudieron cargar los reportes del servidor.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingReports(false);
        }
      }
    }

    loadBackendReports();

    return () => controller.abort();
  }, []);

  function handleReportAction(routeType) {
    if (!user) {
      setAuthGuardOpen(true);
      return;
    }

    navigate(`/reportar/${routeType}`);
  }

  function scrollCarousel(direction) {
    carouselRef.current?.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  }

  return (
    <div className="h-full overflow-y-auto bg-[#f7faf6] pb-16 text-[#102218] md:h-[calc(100vh-6rem)]">
      <section className="relative min-h-[380px] overflow-hidden bg-[#143624] md:min-h-[440px]">
        <img
          src={heroImage}
          alt="Persona abrazando a una mascota"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#07170f]/90 via-[#143624]/55 to-[#07170f]/20" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#f7faf6] to-transparent" />

        <div className="relative z-10 mx-auto grid min-h-[380px] max-w-7xl items-center gap-8 px-4 py-10 md:min-h-[440px] md:grid-cols-[1fr_360px] md:px-8">
          <div className="max-w-2xl pt-4 text-white">
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
              Red comunitaria Petly
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-[3.35rem]">
              Ayudemos a que cada mascota vuelva a casa
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
              Publica reportes claros, revisa avisos recientes y conecta rapido
              con personas cerca de tu sector.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/30 bg-white/92 p-5 shadow-2xl backdrop-blur">
            <div className="mb-5 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2f7f5a]">
                Comienza aqui
              </p>
              <h2 className="mt-2 text-2xl font-black text-[#102218]">
                Crear un reporte
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ActionCard
                title="Mascota perdida"
                text="Necesito encontrarla"
                tone="lost"
                onClick={() => handleReportAction("perdido")}
              />
              <ActionCard
                title="Mascota encontrada"
                text="Quiero ayudar"
                tone="found"
                onClick={() => handleReportAction("encontrado")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 md:px-8 md:py-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#2f7f5a]">
              Comunidad activa
            </p>
            <h2 className="mt-1 text-3xl font-black text-[#102218]">
              Reportes recientes
            </h2>
          </div>

          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Ver reportes anteriores"
              onClick={() => scrollCarousel(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#143624]/15 bg-white text-[#143624] shadow-sm transition hover:bg-[#e7f6ef]"
            >
              <ArrowLeftIcon />
            </button>
            <button
              type="button"
              aria-label="Ver mas reportes"
              onClick={() => scrollCarousel(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#143624]/15 bg-white text-[#143624] shadow-sm transition hover:bg-[#e7f6ef]"
            >
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loadingReports
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[260px] min-w-[230px] animate-pulse rounded-2xl bg-[#dce9df]"
                />
              ))
            : reports.map((report) => <ReportPreview key={report.id} report={report} />)}
        </div>

        {!loadingReports && reports.length === 0 && (
          <div className="rounded-2xl border border-[#143624]/10 bg-white p-8 text-center shadow-sm">
            <p className="text-sm font-bold text-[#102218]/70">
              {reportsError || "Aun no hay reportes publicados desde el servidor."}
            </p>
          </div>
        )}
      </section>

      <section className="bg-[#1a412f] text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-9 md:grid-cols-[1fr_340px] md:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9fe2c9]">
              Mas ojos, mas oportunidades
            </p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Ayuda a reunir mascotas perdidas
            </h2>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/75">
              Revisa los reportes, comparte con tus vecinos y avisa si tienes
              informacion. Petly funciona mejor cuando la comunidad se mueve.
            </p>
            <button
              type="button"
              onClick={() => handleReportAction("encontrado")}
              className="mt-6 rounded-lg bg-[#082c4f] px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-[#061f38]"
            >
              Reportar mascota encontrada
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {reports.slice(0, 2).map((report) => (
              <MiniReport key={report.id} report={report} />
            ))}
          </div>
        </div>
      </section>

      <AuthGuardModal open={authGuardOpen} onClose={() => setAuthGuardOpen(false)} />
    </div>
  );
}

function ActionCard({ title, text, tone, onClick }) {
  const isLost = tone === "lost";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl p-4 text-center shadow-sm transition",
        "hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1a412f]/35",
        isLost ? "bg-[#1a412f] text-white" : "bg-[#91e4ec] text-[#0d2440]",
      ].join(" ")}
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white/55">
        {isLost ? <SearchIcon /> : <PawIcon />}
      </span>
      <span className="text-base font-black">{title}</span>
      <span className="text-xs font-bold opacity-75">{text}</span>
    </button>
  );
}

function ReportPreview({ report }) {
  const typeStyles = {
    PERDIDA: "bg-[#e51f2e] text-white",
    ENCONTRADA: "bg-[#1a412f] text-white",
    AVISTAMIENTO: "bg-[#f5a20b] text-[#102218]",
  };

  return (
    <article className="min-w-[230px] snap-start overflow-hidden rounded-2xl border border-[#143624]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-36 bg-[#dce9df]">
        {report.photo ? (
          <img src={report.photo} alt={report.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center bg-linear-to-br from-[#e9f5ee] to-[#b8dfcd] text-[#143624]">
            <PawIcon size="large" />
          </div>
        )}
        <span
          className={[
            "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-black",
            typeStyles[report.type] || "bg-[#143624] text-white",
          ].join(" ")}
        >
          {report.typeLabel}
        </span>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-base font-black text-[#102218]">
          {report.title}
        </h3>
        <p className="mt-1 text-sm font-semibold text-[#102218]/62">
          {report.breed || report.speciesLabel}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-[#102218]/62">
          <span>{report.color}</span>
          <span className="text-right">{report.timeLabel}</span>
          <span className="col-span-2 text-[#2f7f5a]">{report.sector}</span>
        </div>
      </div>
    </article>
  );
}

function MiniReport({ report }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="h-28 bg-[#dce9df]">
        {report.photo ? (
          <img src={report.photo} alt={report.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-[#143624]">
            <PawIcon />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-black text-[#2f7f5a]">{report.typeLabel}</p>
        <h3 className="mt-1 line-clamp-1 text-sm font-black text-[#102218]">
          {report.title}
        </h3>
        <p className="mt-1 text-xs font-semibold text-[#102218]/60">{report.sector}</p>
      </div>
    </article>
  );
}

function normalizeReport(report) {
  const type = report.tipoReporte || report.tipo_reporte || report.status || "REPORTE";
  const normalizedType = String(type).toUpperCase();

  return {
    id: report.id || report.idreporte || report.estadoReporte || report.name,
    title:
      report.estadoReporte ||
      report.estado_reporte ||
      report.name ||
      report.nombre ||
      "Mascota reportada",
    type: normalizedType,
    typeLabel: formatType(normalizedType),
    speciesLabel: formatSpecies(report.species || report.especie),
    breed: report.breed || report.raza || "",
    color: report.color || report.colorPrincipal || report.color_principal || "Sin color",
    sector:
      report.sector ||
      report.comuna ||
      report.ubicacion ||
      report.resolvedPlace ||
      "Sector no informado",
    photo: report.photo || report.imagenUrl || report.imagen_url || "",
    timeLabel: formatTime(report.fechaReporte || report.fecha_reporte || report.reportedAt),
  };
}

async function enrichReportsWithPlaces(reports, signal) {
  const visibleReports = reports.slice(0, 8);

  const enrichedVisibleReports = await Promise.all(
    visibleReports.map(async (report) => {
      if (getTextPlace(report) || !hasCoordinates(report)) {
        return report;
      }

      const place = await getPlaceFromCoords(
        report.latitud,
        report.longitud,
        signal
      );

      return {
        ...report,
        resolvedPlace: place,
      };
    })
  );

  return [...enrichedVisibleReports, ...reports.slice(8)];
}

async function getPlaceFromCoords(lat, lng, signal) {
  if (!MAPBOX_TOKEN) return "Sector no informado";

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "Sector no informado";
  }

  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    language: "es",
    types: "neighborhood,locality,place,address",
    limit: "1",
  });

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${params.toString()}`,
      { signal }
    );

    if (!response.ok) return "Sector no informado";

    const data = await response.json();
    const feature = data.features?.[0];

    return getReadablePlace(feature) || "Sector no informado";
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return "Sector no informado";
  }
}

function getReadablePlace(feature) {
  if (!feature) return "";

  const street = feature.text;
  const neighborhood = feature.context?.find((item) =>
    item.id?.startsWith("neighborhood")
  )?.text;
  const locality = feature.context?.find((item) =>
    item.id?.startsWith("locality")
  )?.text;
  const place = feature.context?.find((item) =>
    item.id?.startsWith("place")
  )?.text;
  const region = feature.context?.find((item) =>
    item.id?.startsWith("region")
  )?.text;

  const parts = [street, place || locality || region]
    .filter(Boolean)
    .filter((part, index, list) => list.indexOf(part) === index);

  return parts.slice(0, 2).join(", ") || feature.place_name;
}

function getTextPlace(report) {
  return report.sector || report.comuna || report.ubicacion || report.resolvedPlace;
}

function hasCoordinates(report) {
  const latitude = Number(report.latitud);
  const longitude = Number(report.longitud);

  return Number.isFinite(latitude) && Number.isFinite(longitude);
}

function formatType(type) {
  const labels = {
    PERDIDA: "Perdida",
    LOST: "Perdida",
    ENCONTRADA: "Encontrada",
    FOUND: "Encontrada",
    AVISTAMIENTO: "Avistamiento",
  };

  return labels[type] || "Reporte";
}

function formatSpecies(species) {
  const labels = {
    dog: "Perro",
    cat: "Gato",
    other: "Mascota",
  };

  return labels[species] || species || "Mascota";
}

function formatTime(value) {
  if (!value) return "Reciente";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Reciente";

  const hours = Math.max(0, Math.floor((Date.now() - date.getTime()) / 3600000));
  if (hours < 1) return "Ahora";
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
}

function SearchIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2.4" />
      <path d="m15 15 4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10.5 8.2v2.6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="10.5" cy="13.4" r="1" fill="currentColor" />
    </svg>
  );
}

function PawIcon({ size = "normal" }) {
  const className = size === "large" ? "h-16 w-16" : "h-8 w-8";

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="8" cy="6" rx="2" ry="2.7" />
      <ellipse cx="16" cy="6" rx="2" ry="2.7" />
      <ellipse cx="5" cy="11" rx="1.8" ry="2.3" />
      <ellipse cx="19" cy="11" rx="1.8" ry="2.3" />
      <path d="M12 11.2c-3.4 0-6 2.3-6 5.3 0 1.9 1.4 3.3 3.1 3.3.8 0 1.5-.3 2-.6.6-.3 1.2-.3 1.8 0 .5.3 1.2.6 2 .6 1.7 0 3.1-1.4 3.1-3.3 0-3-2.6-5.3-6-5.3Z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

import { useEffect, useMemo, useState } from "react";

const REPORTS_API_URL =
  import.meta.env.VITE_REPORTS_MAP_URL || "http://localhost:8080/petly/reportes";
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const FILTERS = [
  { label: "Todos", value: "TODOS" },
  { label: "Perdidos", value: "PERDIDA" },
  { label: "Encontrados", value: "ENCONTRADA" },
  { label: "Avistamientos", value: "AVISTAMIENTO" },
];

export default function Reportes() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("TODOS");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadReports() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(REPORTS_API_URL, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const backendReports = Array.isArray(data) ? data : [];
        const reportsWithPlaces = await enrichReportsWithPlaces(
          backendReports,
          controller.signal
        );

        setReports(reportsWithPlaces.map(normalizeReport));
      } catch (err) {
        if (err.name !== "AbortError") {
          setReports([]);
          setError("No se pudieron cargar los reportes desde el servidor.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => controller.abort();
  }, []);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesType =
        activeFilter === "TODOS" || report.tipoReporte === activeFilter;

      if (!matchesType) return false;
      if (!query) return true;

      return [
        report.titulo,
        report.tipoLabel,
        report.especie,
        report.raza,
        report.color,
        report.tamanio,
        report.sexo,
        report.descripcion,
        report.ubicacion,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [activeFilter, reports, search]);

  return (
    <div className="h-full overflow-y-auto bg-[#f7faf6] pb-20 text-[#102218] md:h-[calc(100vh-6rem)]">
      <section className="border-b border-[#143624]/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#2f7f5a]">
            Comunidad Petly
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-black text-[#102218]">
                Todos los reportes
              </h1>
              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#102218]/65">
                Revisa las mascotas perdidas, encontradas y avistadas que han
                sido publicadas por la comunidad.
              </p>
            </div>

            <div className="rounded-2xl border border-[#143624]/10 bg-[#f7faf6] px-4 py-3 text-sm font-black text-[#102218]">
              {filteredReports.length} reporte{filteredReports.length === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#143624]/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={[
                  "rounded-full px-4 py-2 text-sm font-black transition",
                  activeFilter === filter.value
                    ? "bg-[#5DCAA5] text-[#0a1a10]"
                    : "bg-[#eef5f0] text-[#102218]/70 hover:bg-[#dceee5]",
                ].join(" ")}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <label className="relative block md:w-80">
            <span className="sr-only">Buscar reportes</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por especie, color, contacto..."
              className="w-full rounded-xl border border-[#143624]/10 bg-[#f7faf6] px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-[#102218]/35 focus:border-[#5DCAA5] focus:ring-4 focus:ring-[#5DCAA5]/20"
            />
          </label>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-10 md:px-8">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[330px] animate-pulse rounded-2xl bg-[#dce9df]"
              />
            ))}
          </div>
        ) : error ? (
          <EmptyState title="No se pudo cargar" text={error} />
        ) : filteredReports.length === 0 ? (
          <EmptyState
            title="Sin reportes"
            text="No hay reportes que coincidan con los filtros actuales."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ReportCard({ report }) {
  const typeStyles = {
    PERDIDA: "bg-red-500 text-white",
    ENCONTRADA: "bg-[#5DCAA5] text-[#0a1a10]",
    AVISTAMIENTO: "bg-[#f5a20b] text-[#102218]",
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-[#143624]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-44 bg-[#dce9df]">
        {report.imagen ? (
          <img
            src={report.imagen}
            alt={report.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center bg-linear-to-br from-[#e9f5ee] to-[#b8dfcd] text-[#143624]">
            <PawIcon />
          </div>
        )}

        <span
          className={[
            "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-black",
            typeStyles[report.tipoReporte] || "bg-[#143624] text-white",
          ].join(" ")}
        >
          {report.tipoLabel}
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <h2 className="line-clamp-1 text-lg font-black text-[#102218]">
            {report.titulo}
          </h2>
          <p className="mt-1 text-xs font-bold text-[#102218]/45">
            Publicado {report.fecha}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-[#102218]/65">
          <Info label="Especie" value={report.especie} />
          <Info label="Raza" value={report.raza} />
          <Info label="Color" value={report.color} />
          <Info label="Tamano" value={report.tamanio} />
          <Info label="Sexo" value={report.sexo} />
          <Info label="Edad" value={report.edad} />
        </div>

        <div className="rounded-xl bg-[#f7faf6] p-3 text-xs font-semibold leading-5 text-[#102218]/68">
          <p className="font-black text-[#2f7f5a]">{report.ubicacion}</p>
          <p className="mt-2 line-clamp-3">{report.descripcion}</p>
        </div>

      </div>
    </article>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="rounded-2xl border border-[#143624]/10 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#5DCAA5]/15 text-[#143624]">
        <PawIcon small />
      </div>
      <h2 className="mt-4 text-xl font-black text-[#102218]">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-[#102218]/60">{text}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <span className="block text-[#102218]/38">{label}</span>
      <span>{value || "Sin dato"}</span>
    </p>
  );
}

function normalizeReport(report) {
  const tipoReporte = String(
    report.tipoReporte || report.tipo_reporte || "REPORTE"
  ).toUpperCase();

  return {
    id:
      report.id ||
      report.idreporte ||
      `${tipoReporte}-${report.fechaReporte || report.fecha_reporte || Math.random()}`,
    titulo:
      report.estadoReporte ||
      report.estado_reporte ||
      report.nombre ||
      formatType(tipoReporte),
    tipoReporte,
    tipoLabel: formatType(tipoReporte),
    especie: report.especie || report.species || "Sin dato",
    raza: report.raza || report.breed || "Sin dato",
    color: report.colorPrincipal || report.color_principal || report.color || "Sin dato",
    tamanio: report.tamanio || report.size || "Sin dato",
    sexo: report.sexo || report.sex || "Sin dato",
    edad: report.edadAproximada || report.edad_aproximada || "Sin dato",
    descripcion: report.descripcion || "Sin descripcion",
    ubicacion:
      report.sector ||
      report.comuna ||
      report.ubicacion ||
      report.resolvedPlace ||
      "Ubicacion no informada",
    imagen: report.imagenUrl || report.imagen_url || report.photo || "",
    fecha: formatDate(report.fechaReporte || report.fecha_reporte),
  };
}

async function enrichReportsWithPlaces(reports, signal) {
  return Promise.all(
    reports.map(async (report) => {
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
}

async function getPlaceFromCoords(lat, lng, signal) {
  if (!MAPBOX_TOKEN) return "Ubicacion no informada";

  const latitude = Number(lat);
  const longitude = Number(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return "Ubicacion no informada";
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

    if (!response.ok) return "Ubicacion no informada";

    const data = await response.json();
    const feature = data.features?.[0];

    return getReadablePlace(feature) || "Ubicacion no informada";
  } catch (error) {
    if (error.name === "AbortError") throw error;
    return "Ubicacion no informada";
  }
}

function getReadablePlace(feature) {
  if (!feature) return "";

  const street = feature.text;
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
    ENCONTRADA: "Encontrada",
    AVISTAMIENTO: "Avistamiento",
  };

  return labels[type] || "Reporte";
}

function formatDate(value) {
  if (!value) return "recientemente";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function PawIcon({ small = false }) {
  return (
    <svg
      className={small ? "h-8 w-8" : "h-16 w-16"}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <ellipse cx="8" cy="6" rx="2" ry="2.7" />
      <ellipse cx="16" cy="6" rx="2" ry="2.7" />
      <ellipse cx="5" cy="11" rx="1.8" ry="2.3" />
      <ellipse cx="19" cy="11" rx="1.8" ry="2.3" />
      <path d="M12 11.2c-3.4 0-6 2.3-6 5.3 0 1.9 1.4 3.3 3.1 3.3.8 0 1.5-.3 2-.6.6-.3 1.2-.3 1.8 0 .5.3 1.2.6 2 .6 1.7 0 3.1-1.4 3.1-3.3 0-3-2.6-5.3-6-5.3Z" />
    </svg>
  );
}

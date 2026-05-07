function getReportValue(report, camelKey, snakeKey, fallback = "Sin información") {
  return report[camelKey] || report[snakeKey] || fallback;
}

function formatDate(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function MiReporteCard({ report }) {
  const reportType = getReportValue(report, "tipoReporte", "tipo_reporte", "Reporte");
  const reportStatus = getReportValue(report, "estadoReporte", "estado_reporte", "Activo");
  const petStatus = getReportValue(report, "estadoMascota", "estado_mascota");
  const imageUrl = getReportValue(report, "imagenUrl", "imagen_url", "");
  const color = getReportValue(report, "colorPrincipal", "color_principal");
  const approximateAge = getReportValue(report, "edadAproximada", "edad_aproximada");
  const reportDate = getReportValue(report, "fechaReporte", "fecha_reporte", "");

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#5DCAA5]/40 hover:shadow-xl">
      <div className="relative h-44 bg-[#0f2e1f]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={report.nombre || reportType}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-5xl text-white/50">
            🐾
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-[#5DCAA5]/30 bg-[#5DCAA5]/20 px-3 py-1 text-xs font-semibold text-[#5DCAA5]">
          {reportType}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-bold text-white">
              {report.nombre || "Mascota sin nombre"}
            </h3>
            <span className="rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[11px] text-white/70">
              {reportStatus}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/50">
            Publicado: {formatDate(reportDate)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
          <Row label="Estado mascota" value={petStatus} />
          <Row label="Especie" value={report.especie} />
          <Row label="Raza" value={report.raza} />
          <Row label="Color" value={color} />
          <Row label="Tamaño" value={report.tamanio} />
          <Row label="Sexo" value={report.sexo} />
          <Row label="Edad" value={approximateAge} />
          <Row label="Contacto" value={report.contacto} />
        </div>

        {report.descripcion && (
          <p className="rounded-xl border border-white/10 bg-black/10 p-3 text-sm text-white/70">
            {report.descripcion}
          </p>
        )}
      </div>
    </article>
  );
}

function Row({ label, value }) {
  return (
    <p>
      <span className="block text-white/35">{label}</span>
      <span>{value || "Sin información"}</span>
    </p>
  );
}
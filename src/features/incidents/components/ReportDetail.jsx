const SPECIES_EMOJI = { dog: "🐕", cat: "🐈", other: "🐾" };
const REPORT_STYLES = {
  PERDIDA: "bg-red-500/20 text-red-300 border-red-400/30",
  ENCONTRADA: "bg-[#5DCAA5]/20 text-[#5DCAA5] border-[#5DCAA5]/30",
  AVISTAMIENTO: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
};

export default function ReportDetail({ report, onBack }) {
  if (!report) return null;

  const imageUrl = report.photo || report.imagen_url;
  const title = report.estadoReporte || report.name || report.tipoReporte || "Detalle del reporte";
  const reportStyle = REPORT_STYLES[report.tipoReporte] || "bg-white/10 text-white/70 border-white/20";

  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-full border border-[#5DCAA5]/40 bg-[#5DCAA5]/10 px-3 py-1.5 text-sm font-semibold text-[#5DCAA5] transition hover:bg-[#5DCAA5]/20"
        >
          <span aria-hidden="true">←</span>
          Volver a reportes
        </button>

        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${reportStyle}`}>
          {report.tipoReporte || "Sin tipo"}
        </span>
      </div>

      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f2e1f]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Imagen del reporte ${title}`}
              className="h-80 w-full object-cover sm:h-[28rem]"
            />
          ) : (
            <div className="flex h-80 w-full items-center justify-center sm:h-[28rem]">
              <span className="text-8xl select-none">{SPECIES_EMOJI[report.species] ?? "🐾"}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#5DCAA5]">
              Reporte seleccionado
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {report.description || "Este reporte no tiene descripción registrada."}
            </p>
          </header>

          <section className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Datos de la mascota</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="Estado mascota" value={report.status} />
              <DetailItem label="Especie" value={report.species} />
              <DetailItem label="Raza" value={report.breed} />
              <DetailItem label="Color" value={report.color} />
              <DetailItem label="Tamaño" value={report.size} />
              <DetailItem label="Sexo" value={report.sex} />
              <DetailItem label="Edad aprox." value={report.approximateAge} />
              <DetailItem label="Estado reporte" value={report.estadoReporte} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">Información del reporte</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailItem label="ID reporte" value={report.id} />
              <DetailItem label="Fecha" value={formatDate(report.fechaReporte)} />
              <DetailItem label="Latitud" value={report.latitud} />
              <DetailItem label="Longitud" value={report.longitud} />
            </div>
          </section>

          <section className="rounded-2xl border border-[#5DCAA5]/20 bg-[#5DCAA5]/10 p-4">
            <h3 className="mb-2 text-sm font-semibold text-[#5DCAA5]">Contacto</h3>
            <p className="text-sm text-white/80">{report.contacto || "Sin contacto registrado"}</p>
          </section>
        </div>
      </div>
    </article>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/35">{label}</p>
      <p className="mt-1 text-sm text-white/80">{value || "Sin información"}</p>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "Sin información";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

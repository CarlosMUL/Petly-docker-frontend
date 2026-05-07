import ReportCard from "./ReportCard";

export default function ReportGrid({ reports = [], loading }) {
  if (loading) {
    return (
      <div className="py-20 text-center text-white/40">
        Cargando reportes...
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/50 backdrop-blur-xl">
        <p className="text-lg font-semibold text-white">No tienes reportes creados</p>
        <p className="mt-2 text-sm">Cuando publiques un reporte, aparecerá en esta página.</p>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {reports.map((report) => (
        <ReportCard
          key={report.id || report.idreporte || `${report.nombre}-${report.fechaReporte || report.fecha_reporte}`}
          report={report}
        />
      ))}
    </div>
  );
}
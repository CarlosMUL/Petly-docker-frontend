import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../features/auth/context/authContext";
import { useReport } from "../features/report/hooks/useReport";
import ReportModal from "../features/report/components/ReportModal";
import AuthGuardModal from "../shared/components/AuthGuardModal";

const REPORT_FLOW = {
  perdido: {
    actionType: "Perdido",
    tipoReporte: "PERDIDA",
  },
  encontrado: {
    actionType: "Encontrado",
    tipoReporte: "ENCONTRADA",
  },
  avistamiento: {
    actionType: "Avistamiento",
    tipoReporte: "AVISTAMIENTO",
  },
};

export default function ReportFlowPage() {
  const { tipo } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitReport } = useReport();
  const [authGuardOpen, setAuthGuardOpen] = useState(true);

  const flow = useMemo(() => REPORT_FLOW[tipo], [tipo]);

  function goBack() {
    navigate("/");
  }

  async function handleSubmit(data) {
    await submitReport(data, flow.tipoReporte);
  }

  if (!flow) {
    return (
      <div className="flex min-h-[calc(100vh-3rem)] items-center justify-center bg-[#0a1a10] px-4 text-center text-white">
        <div>
          <h1 className="text-2xl font-black">Tipo de reporte no disponible</h1>
          <button
            type="button"
            onClick={goBack}
            className="mt-5 rounded-lg bg-[#5DCAA5] px-5 py-3 text-sm font-black text-[#0a1a10]"
          >
            Volver a Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3rem)] bg-[#0a1a10]">
        <AuthGuardModal
          open={authGuardOpen}
          onClose={() => {
            setAuthGuardOpen(false);
            goBack();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3rem)] bg-[#0a1a10]">
      <ReportModal
        open={true}
        actionType={flow.actionType}
        tipoReporte={flow.tipoReporte}
        onClose={goBack}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { getReportService } from "../services/ReportService";

export function useMyReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      setError("");

      const result = await getReportService();

      if (result.success) {
        setReports(Array.isArray(result.data) ? result.data : []);
      } else {
        setError(result.error);
      }

      setLoading(false);
    }

    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
  };
}
const MIS_REPORTES_URL =
  import.meta.env.VITE_MIS_REPORTES_URL || "http://localhost:8081/petly/reportes/mis-reportes";

function getToken() {
  return localStorage.getItem("token");
}

export async function getReportService() {
  const token = getToken();

  if (!token) {
    return {
      success: false,
      error: "Debes iniciar sesión para ver tus reportes.",
    };
  }

  try {
    const response = await fetch(MIS_REPORTES_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "No se pudieron cargar tus reportes.",
    };
  }
}
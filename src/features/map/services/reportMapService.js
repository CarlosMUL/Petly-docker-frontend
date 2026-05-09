const REPORTS_MAP_URL =
  import.meta.env.VITE_REPORTS_MAP_URL || "http://localhost:8080/petly/reportes";

function buildQuery(filters = {}) {
  const query = new URLSearchParams();

  if (filters.lat != null) query.append("lat", filters.lat);
  if (filters.lng != null) query.append("lng", filters.lng);
  if (filters.radio != null) query.append("radio", filters.radio);
  if (filters.estado) query.append("estado", filters.estado);
  if (filters.search) query.append("search", filters.search);

  return query.toString();
}


async function readJson(response) {
  if (!response.ok) {
    const text = await response.text();
    console.error("Error backend:", text);
    throw new Error(`Error al cargar reportes: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Respuesta no JSON:", text);
    throw new Error("El backend respondió HTML en vez de JSON");
  }

  return response.json();
}

export async function getMapReports(filters = {}) {
  const query = buildQuery(filters);

  const urlPrincipal = query
    ? `${REPORTS_MAP_URL}?${query}`
    : REPORTS_MAP_URL;

  const urlFallback = query
    ? `${REPORTS_MAP_URL}/todos?${query}`
    : `${REPORTS_MAP_URL}/todos`;

  const response = await fetch(urlPrincipal);

  if (response.status === 403) {
    console.warn("403 detectado, usando /todos");
    const fallbackResponse = await fetch(urlFallback);
    return readJson(fallbackResponse);
  }

  return readJson(response);
}

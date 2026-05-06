const REPORTS_MAP_URL =
  import.meta.env.VITE_REPORTS_MAP_URL || "http://localhost:8083/petly/reportes";

function buildQuery(filters = {}) {
  const query = new URLSearchParams();

  if (filters.lat != null) query.append("lat", filters.lat);
  if (filters.lng != null) query.append("lng", filters.lng);
  if (filters.radio != null) query.append("radio", filters.radio);
  if (filters.estado) query.append("estado", filters.estado);
  if (filters.search) query.append("search", filters.search);

  return query.toString();
}

export async function getMapReports(filters = {}) {
  const query = buildQuery(filters);
  const url = query ? `${REPORTS_MAP_URL}?${query}` : REPORTS_MAP_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al cargar reportes: HTTP ${response.status}`);
  }

  return response.json(); // devuelve el array de reportes de tu backend
}

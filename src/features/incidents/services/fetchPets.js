import { mockPets } from "../data/MockPets";
const USE_MOCK = import.meta.env.VITE_USE_MOCKS === "true";
const REPORTS_API_URL = "http://localhost:8080/petly/reportes";
const REPORTS_BY_TYPE_API_URL = `${REPORTS_API_URL}/filtrar/tipo`;

function getReportTypeFilter(filters) {
    return filters.tipoReporte || filters.tipo_reporte;
}

function buildReportsUrl(filters = {}) {
    const tipoReporte = getReportTypeFilter(filters);

    if (tipoReporte) {
        const query = new URLSearchParams({ tipoReporte });
        return `${REPORTS_BY_TYPE_API_URL}?${query.toString()}`;
    }

    const query = new URLSearchParams();

    if (filters.estado) query.append("estado", filters.estado);
    if (filters.search) query.append("search", filters.search);

    const queryString = query.toString();
    return queryString ? `${REPORTS_API_URL}?${queryString}` : REPORTS_API_URL;
}

function normalizePets(data) {
    return data.map((pet) => ({
        id: pet.id || pet.idreporte,
        name: pet.nombre || pet.tipoReporte || pet.tipo_reporte || "Sin nombre",
        species: pet.especie,
        breed: pet.raza,
        color: pet.colorPrincipal || pet.color_principal,
        size: pet.tamanio,
        sex: pet.sexo,
        approximateAge: pet.edadAproximada || pet.edad_aproximada,
        tipoReporte: pet.tipoReporte || pet.tipo_reporte,
        status: pet.estadoMascota || pet.estado_mascota,
        description: pet.descripcion,
        contacto: pet.contacto,
        photo: pet.photo || pet.imagenUrl || pet.imagen_url,
        imagen_url: pet.imagenUrl || pet.imagen_url,
        latitud: pet.latitud,
        longitud: pet.longitud,
        fechaReporte: pet.fechaReporte || pet.fecha_reporte,
        estadoReporte: pet.estadoReporte || pet.estado_reporte,
    }));
}

function filterPets(pets, filters) {
    return pets.filter(p => {
        const tipoReporte = getReportTypeFilter(filters);

        if (tipoReporte && p.tipoReporte !== tipoReporte && p.tipo_reporte !== tipoReporte) return false;
        if (filters.estado && p.estadoReporte !== filters.estado && p.estado_reporte !== filters.estado) return false;
        if (filters.search) {
            const searchableText = [
                p.name,
                p.species,
                p.breed,
                p.color,
                p.size,
                p.sex,
                p.approximateAge,
                p.description,
                p.contacto,
            ].join(" ").toLowerCase();

            if (!searchableText.includes(filters.search.toLowerCase())) return false;
        }
        return true;
    });
}

export async function fetchPets(filters = {}) {
    if (USE_MOCK) {
        return filterPets(mockPets, filters);
    }

    const url = buildReportsUrl(filters);

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        return normalizePets(data);
    } catch (error) {
        console.warn("Fallback a mock:", error);
        return filterPets(mockPets, filters);
    }
}
